"""
Enhanced media file service for artists with security and Celery integration
"""
import os
import hashlib
import mimetypes
import logging
from typing import Dict, Any, Optional, List
from django.core.files.uploadedfile import UploadedFile
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.conf import settings
from django.db import models
from celery import shared_task
from accounts.models import AuditLog
from artists.models import Track, Album

logger = logging.getLogger(__name__)


class MediaFileService:
    """Service for handling secure media file uploads with validation and processing"""
    
    # Maximum file sizes (in bytes)
    MAX_FILE_SIZES = {
        'audio': 100 * 1024 * 1024,  # 100MB for audio
        'image': 10 * 1024 * 1024,   # 10MB for images
    }
    
    # Allowed file types
    ALLOWED_AUDIO_TYPES = {
        'audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/flac',
        'audio/mp4', 'audio/aac', 'audio/ogg', 'audio/x-m4a'
    }
    
    ALLOWED_IMAGE_TYPES = {
        'image/jpeg', 'image/png', 'image/webp', 'image/gif'
    }
    
    # Dangerous file extensions to block
    BLOCKED_EXTENSIONS = {
        '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js',
        '.jar', '.php', '.asp', '.aspx', '.jsp', '.py', '.rb', '.pl',
        '.sh', '.ps1', '.msi', '.deb', '.rpm'
    }
    
    @classmethod
    def validate_media_file(cls, file: UploadedFile, file_type: str = 'auto') -> Dict[str, Any]:
        """
        Comprehensive media file validation
        
        Args:
            file: The uploaded file to validate
            file_type: 'audio', 'image', or 'auto' to detect
            
        Returns:
            Dict containing validation results and file metadata
            
        Raises:
            ValidationError: If file fails validation
        """
        errors = []
        
        # Auto-detect file type if not specified
        if file_type == 'auto':
            content_type = file.content_type or mimetypes.guess_type(file.name)[0]
            if content_type and content_type.startswith('audio/'):
                file_type = 'audio'
            elif content_type and content_type.startswith('image/'):
                file_type = 'image'
            else:
                errors.append('Unable to determine file type')
        
        # Check file size
        max_size = cls.MAX_FILE_SIZES.get(file_type, cls.MAX_FILE_SIZES['image'])
        if file.size > max_size:
            errors.append(f'File size ({file.size} bytes) exceeds maximum allowed size ({max_size} bytes)')
        
        # Check file type
        content_type = file.content_type or mimetypes.guess_type(file.name)[0]
        allowed_types = cls.ALLOWED_AUDIO_TYPES if file_type == 'audio' else cls.ALLOWED_IMAGE_TYPES
        
        if content_type not in allowed_types:
            errors.append(f'File type {content_type} is not allowed for {file_type} files')
        
        # Check file extension
        _, ext = os.path.splitext(file.name.lower())
        if ext in cls.BLOCKED_EXTENSIONS:
            errors.append(f'File extension {ext} is not allowed for security reasons')
        
        # Check for null bytes (potential security issue)
        if b'\x00' in file.name.encode('utf-8', errors='ignore'):
            errors.append('File name contains invalid characters')
        
        # Perform content-based validation
        cls._validate_file_content(file, file_type, errors)
        
        if errors:
            raise ValidationError(errors)
        
        return {
            'valid': True,
            'content_type': content_type,
            'size': file.size,
            'file_type': file_type,
            'extension': ext
        }
    
    @classmethod
    def _validate_file_content(cls, file: UploadedFile, file_type: str, errors: List[str]):
        """Validate file content for security"""
        file.seek(0)
        content = file.read(10240)  # Read first 10KB
        file.seek(0)
        
        # Check for malware patterns
        malware_patterns = [
            b'eval(', b'exec(', b'system(', b'shell_exec(',
            b'<script', b'javascript:', b'vbscript:',
            b'<?php', b'<%', b'#!/bin/sh', b'#!/bin/bash'
        ]
        
        content_lower = content.lower()
        for pattern in malware_patterns:
            if pattern in content_lower:
                errors.append(f'File contains potentially malicious content: {pattern.decode("utf-8", errors="ignore")}')
        
        # Check for executable headers
        if content.startswith(b'MZ') or content.startswith(b'\x7fELF'):
            errors.append('Executable files are not allowed')
        
        # Validate image files
        if file_type == 'image':
            try:
                from PIL import Image
                file.seek(0)
                img = Image.open(file)
                img.verify()
                file.seek(0)
                
                # Check image dimensions (reasonable limits)
                if hasattr(img, 'size'):
                    width, height = img.size
                    if width > 5000 or height > 5000:
                        errors.append('Image dimensions too large (max 5000x5000)')
                        
            except Exception as e:
                errors.append(f'Invalid image file: {str(e)}')
        
        # Validate audio files (basic checks)
        elif file_type == 'audio':
            # Check for common audio file signatures
            audio_signatures = {
                b'ID3': 'MP3',
                b'\xff\xfb': 'MP3',
                b'\xff\xf3': 'MP3',
                b'\xff\xf2': 'MP3',
                b'RIFF': 'WAV',
                b'fLaC': 'FLAC',
                b'OggS': 'OGG'
            }
            
            valid_signature = False
            for signature, format_name in audio_signatures.items():
                if content.startswith(signature) or signature in content[:100]:
                    valid_signature = True
                    break
            
            if not valid_signature:
                errors.append('Invalid audio file format or corrupted file')
    
    @classmethod
    def calculate_file_hash(cls, file: UploadedFile) -> str:
        """Calculate SHA-256 hash of file content"""
        file.seek(0)
        file_content = file.read()
        file_hash = hashlib.sha256(file_content).hexdigest()
        file.seek(0)
        return file_hash
    
    @classmethod
    def process_track_upload(
        cls, 
        user, 
        track_data: Dict[str, Any], 
        audio_file: UploadedFile,
        cover_art: Optional[UploadedFile] = None,
        process_async: bool = True
    ) -> Dict[str, Any]:
        """
        Process track upload with enhanced security and async processing
        
        Args:
            user: The user uploading the track
            track_data: Track metadata
            audio_file: The audio file
            cover_art: Optional cover art image
            process_async: Whether to process asynchronously with Celery
            
        Returns:
            Dict with upload results and processing status
        """
        # Validate audio file
        audio_validation = cls.validate_media_file(audio_file, 'audio')
        
        # Validate cover art if provided
        cover_validation = None
        if cover_art:
            cover_validation = cls.validate_media_file(cover_art, 'image')
        
        # Calculate file hashes for duplicate detection
        audio_hash = cls.calculate_file_hash(audio_file)
        cover_hash = cls.calculate_file_hash(cover_art) if cover_art else None
        
        # Check for duplicate audio files
        existing_track = Track.objects.filter(audio_file_hash=audio_hash).first()
        if existing_track:
            raise ValidationError('This audio file has already been uploaded')
        
        # Get or create artist for user
        artist = user.artists.first()
        if not artist:
            raise ValidationError('User must have an artist profile to upload tracks')
        
        # Create track record with pending status
        track = Track.objects.create(
            artist=artist,
            title=track_data.get('title', 'Untitled'),
            audio_file=audio_file,
            cover_art=cover_art,
            audio_file_hash=audio_hash,
            cover_art_hash=cover_hash,
            processing_status='pending',
            **{k: v for k, v in track_data.items() if k in [
                'genre', 'release_date', 'lyrics', 'explicit', 'album'
            ]}
        )
        
        # Log the upload
        AuditLog.objects.create(
            user=user,
            action='track_upload',
            resource_type='Track',
            resource_id=str(track.id),
            request_data={
                'title': track.title,
                'audio_filename': audio_file.name,
                'audio_size': audio_file.size,
                'cover_filename': cover_art.name if cover_art else None,
                'processing_async': process_async
            }
        )
        
        # Process file asynchronously if requested
        if process_async:
            process_track_media.delay(track.id)
            processing_status = 'queued'
        else:
            # Process synchronously
            processing_status = cls._process_track_media_sync(track)
        
        return {
            'track_id': track.id,
            'title': track.title,
            'processing_status': processing_status,
            'audio_hash': audio_hash,
            'cover_hash': cover_hash,
            'validation_results': {
                'audio': audio_validation,
                'cover': cover_validation
            }
        }
    
    @classmethod
    def _process_track_media_sync(cls, track: Track) -> str:
        """Process track media synchronously"""
        try:
            # Verify file integrity
            if not track.verify_audio_integrity():
                track.processing_status = 'failed'
                track.processing_error = 'Audio file integrity check failed'
                track.save()
                return 'failed'
            
            # Generate additional formats if needed (placeholder for future implementation)
            # This could include generating MP3/WAV versions, thumbnails, etc.
            
            # Extract metadata (placeholder for future implementation)
            # This could include duration, bitrate, sample rate, etc.
            
            track.processing_status = 'completed'
            track.processed_at = timezone.now()
            track.save()
            
            return 'completed'
            
        except Exception as e:
            track.processing_status = 'failed'
            track.processing_error = str(e)
            track.save()
            return 'failed'
    
    @classmethod
    def get_track_processing_status(cls, track_id: int) -> Dict[str, Any]:
        """Get processing status for a track"""
        try:
            track = Track.objects.get(id=track_id)
            return {
                'track_id': track_id,
                'status': track.processing_status,
                'error': getattr(track, 'processing_error', None),
                'processed_at': getattr(track, 'processed_at', None),
                'title': track.title
            }
        except Track.DoesNotExist:
            return {'track_id': track_id, 'status': 'not_found'}
    
    @classmethod
    def scan_media_file_for_malware(cls, file_path: str) -> Dict[str, Any]:
        """
        Enhanced malware scanning for media files with comprehensive threat detection
        
        Args:
            file_path: Path to the file to scan
            
        Returns:
            Dict with scan results
        """
        scan_result = {
            'is_safe': True,
            'threats_found': [],
            'scan_time': timezone.now().isoformat(),
            'scan_details': {
                'file_size': 0,
                'file_type': 'unknown',
                'signatures_checked': 0,
                'deep_scan_performed': False
            }
        }
        
        try:
            file_size = os.path.getsize(file_path)
            scan_result['scan_details']['file_size'] = file_size
            
            with open(file_path, 'rb') as f:
                # Read more content for thorough scanning
                initial_content = f.read(50 * 1024)  # First 50KB
                f.seek(-min(10 * 1024, file_size), 2)  # Last 10KB
                final_content = f.read()
                
                # Combine content for analysis
                content_to_scan = initial_content + final_content
                content_lower = content_to_scan.lower()
                
                # Enhanced script detection patterns
                script_patterns = [
                    (b'<script', 'HTML script tag'),
                    (b'javascript:', 'JavaScript protocol'),
                    (b'vbscript:', 'VBScript protocol'),
                    (b'eval(', 'JavaScript eval function'),
                    (b'exec(', 'Code execution function'),
                    (b'system(', 'System command execution'),
                    (b'shell_exec(', 'Shell execution function'),
                    (b'<?php', 'PHP code block'),
                    (b'<%', 'Server-side script tag'),
                    (b'#!/bin/sh', 'Shell script shebang'),
                    (b'#!/bin/bash', 'Bash script shebang'),
                    (b'powershell', 'PowerShell command'),
                    (b'cmd.exe', 'Windows command prompt'),
                    (b'CreateObject(', 'ActiveX object creation'),
                    (b'WScript.Shell', 'Windows Script Host'),
                ]
                
                scan_result['scan_details']['signatures_checked'] = len(script_patterns)
                
                for pattern, description in script_patterns:
                    if pattern in content_lower:
                        scan_result['is_safe'] = False
                        scan_result['threats_found'].append(f'{description}: {pattern.decode("utf-8", errors="ignore")}')
                
                # Enhanced executable detection
                executable_signatures = [
                    (b'MZ', 'Windows PE executable'),
                    (b'\x7fELF', 'Linux ELF executable'),
                    (b'\xca\xfe\xba\xbe', 'Java class file'),
                    (b'\xfe\xed\xfa\xce', 'Mach-O executable'),
                    (b'\xfe\xed\xfa\xcf', 'Mach-O 64-bit executable'),
                    (b'PK\x03\x04', 'ZIP archive (potential executable)'),
                ]
                
                for signature, description in executable_signatures:
                    if content_to_scan.startswith(signature):
                        scan_result['is_safe'] = False
                        scan_result['threats_found'].append(f'{description} detected')
                
                # Check for suspicious metadata and embedded content
                suspicious_patterns = [
                    (b'<metadata>', 'Suspicious metadata tag'),
                    (b'<script>', 'Script in metadata'),
                    (b'javascript', 'JavaScript reference'),
                    (b'onload=', 'Event handler'),
                    (b'onerror=', 'Error handler'),
                    (b'document.write', 'DOM manipulation'),
                    (b'window.location', 'Location redirect'),
                    (b'XMLHttpRequest', 'AJAX request'),
                    (b'ActiveXObject', 'ActiveX object'),
                    (b'WScript', 'Windows Script Host'),
                    (b'Shell.Application', 'Shell application'),
                    (b'ADODB.Stream', 'ADO stream object'),
                ]
                
                for pattern, description in suspicious_patterns:
                    if pattern in content_lower:
                        scan_result['is_safe'] = False
                        scan_result['threats_found'].append(f'{description}: {pattern.decode("utf-8", errors="ignore")}')
                
                # Deep scan for larger files
                if file_size > 1024 * 1024:  # Files larger than 1MB
                    scan_result['scan_details']['deep_scan_performed'] = True
                    cls._perform_deep_malware_scan(f, scan_result)
                
                # Detect file type for additional validation
                if content_to_scan.startswith(b'ID3') or b'\xff\xfb' in content_to_scan[:100]:
                    scan_result['scan_details']['file_type'] = 'MP3'
                elif content_to_scan.startswith(b'RIFF'):
                    scan_result['scan_details']['file_type'] = 'WAV'
                elif content_to_scan.startswith(b'fLaC'):
                    scan_result['scan_details']['file_type'] = 'FLAC'
                elif content_to_scan.startswith(b'\xff\xd8\xff'):
                    scan_result['scan_details']['file_type'] = 'JPEG'
                elif content_to_scan.startswith(b'\x89PNG'):
                    scan_result['scan_details']['file_type'] = 'PNG'
                
        except Exception as e:
            scan_result['is_safe'] = False
            scan_result['threats_found'].append(f'Scan error: {str(e)}')
        
        return scan_result
    
    @classmethod
    def _perform_deep_malware_scan(cls, file_handle, scan_result: Dict[str, Any]):
        """Perform deep malware scan for larger files"""
        try:
            # Scan file in chunks
            chunk_size = 64 * 1024  # 64KB chunks
            file_handle.seek(0)
            
            suspicious_byte_sequences = [
                b'\x90\x90\x90\x90',  # NOP sled
                b'\xcc\xcc\xcc\xcc',  # INT3 instructions
                b'\x31\xc0\x50\x68',  # Common shellcode pattern
                b'\x6a\x0b\x58\x99',  # Another shellcode pattern
            ]
            
            while True:
                chunk = file_handle.read(chunk_size)
                if not chunk:
                    break
                
                chunk_lower = chunk.lower()
                
                # Check for shellcode patterns
                for pattern in suspicious_byte_sequences:
                    if pattern in chunk:
                        scan_result['is_safe'] = False
                        scan_result['threats_found'].append(f'Suspicious byte sequence detected: {pattern.hex()}')
                
                # Check for repeated suspicious strings
                if b'eval' in chunk_lower and chunk_lower.count(b'eval') > 5:
                    scan_result['is_safe'] = False
                    scan_result['threats_found'].append('Multiple eval() calls detected (potential obfuscation)')
                
        except Exception as e:
            scan_result['threats_found'].append(f'Deep scan error: {str(e)}')
    
    @classmethod
    def quarantine_media_file(cls, track: Track, reason: str) -> bool:
        """
        Quarantine a media file due to security concerns
        
        Args:
            track: The track to quarantine
            reason: Reason for quarantine
            
        Returns:
            bool: True if successfully quarantined
        """
        try:
            track.is_quarantined = True
            track.quarantine_reason = reason
            track.processing_status = 'failed'
            track.processing_error = f'Quarantined: {reason}'
            track.save()
            
            # Log quarantine action
            AuditLog.objects.create(
                user=track.artist.user,
                action='media_file_quarantined',
                resource_type='Track',
                resource_id=str(track.id),
                request_data={
                    'track_title': track.title,
                    'quarantine_reason': reason,
                    'file_path': track.audio_file.name if track.audio_file else None
                }
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to quarantine track {track.id}: {str(e)}")
            return False


@shared_task(bind=True, max_retries=3)
def process_track_media(self, track_id: int):
    """
    Celery task for processing track media files asynchronously
    
    Args:
        track_id: ID of the track to process
    """
    try:
        track = Track.objects.get(id=track_id)
        track.processing_status = 'processing'
        track.save()
        
        # Process the track media
        result = MediaFileService._process_track_media_sync(track)
        
        # Log the processing completion
        AuditLog.objects.create(
            user=track.artist.user,
            action='track_processing_completed',
            resource_type='Track',
            resource_id=str(track_id),
            request_data={
                'processing_result': result,
                'title': track.title
            }
        )
        
        return {'track_id': track_id, 'status': result}
        
    except Track.DoesNotExist:
        return {'track_id': track_id, 'status': 'not_found'}
    except Exception as exc:
        # Retry on failure
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60 * (2 ** self.request.retries))
        
        # Mark as failed after max retries
        try:
            track = Track.objects.get(id=track_id)
            track.processing_status = 'failed'
            track.processing_error = str(exc)
            track.save()
        except:
            pass
        
        return {'track_id': track_id, 'status': 'failed', 'error': str(exc)}


@shared_task
def scan_media_files_for_malware():
    """
    Comprehensive periodic task to scan all media files for malware and security threats
    """
    from django.core.files.storage import default_storage
    
    # Get all tracks that haven't been scanned recently (within 7 days)
    cutoff_time = timezone.now() - timezone.timedelta(days=7)
    tracks_to_scan = Track.objects.filter(
        models.Q(last_malware_scan__lt=cutoff_time) | models.Q(last_malware_scan__isnull=True)
    ).exclude(is_quarantined=True)[:100]  # Limit to 100 tracks per run
    
    # Also scan albums
    albums_to_scan = Album.objects.filter(
        models.Q(last_malware_scan__lt=cutoff_time) | models.Q(last_malware_scan__isnull=True)
    )[:50]  # Limit to 50 albums per run
    
    scan_results = {
        'tracks': [],
        'albums': [],
        'total_scanned': 0,
        'threats_found': 0,
        'quarantined': 0
    }
    
    # Scan track audio files and cover art
    for track in tracks_to_scan:
        track_result = {'track_id': track.id, 'files_scanned': [], 'threats': []}
        
        # Scan audio file
        if track.audio_file and default_storage.exists(track.audio_file.name):
            try:
                file_path = default_storage.path(track.audio_file.name)
                scan_result = MediaFileService.scan_media_file_for_malware(file_path)
                
                track_result['files_scanned'].append({
                    'file_type': 'audio',
                    'file_path': track.audio_file.name,
                    'is_safe': scan_result['is_safe'],
                    'threats': scan_result['threats_found'],
                    'scan_details': scan_result['scan_details']
                })
                
                if not scan_result['is_safe']:
                    track_result['threats'].extend(scan_result['threats_found'])
                    
            except Exception as e:
                track_result['files_scanned'].append({
                    'file_type': 'audio',
                    'file_path': track.audio_file.name,
                    'is_safe': False,
                    'threats': [f'Scan error: {str(e)}'],
                    'scan_details': {}
                })
                track_result['threats'].append(f'Audio scan error: {str(e)}')
        
        # Scan cover art
        if track.cover_art and default_storage.exists(track.cover_art.name):
            try:
                file_path = default_storage.path(track.cover_art.name)
                scan_result = MediaFileService.scan_media_file_for_malware(file_path)
                
                track_result['files_scanned'].append({
                    'file_type': 'cover_art',
                    'file_path': track.cover_art.name,
                    'is_safe': scan_result['is_safe'],
                    'threats': scan_result['threats_found'],
                    'scan_details': scan_result['scan_details']
                })
                
                if not scan_result['is_safe']:
                    track_result['threats'].extend(scan_result['threats_found'])
                    
            except Exception as e:
                track_result['files_scanned'].append({
                    'file_type': 'cover_art',
                    'file_path': track.cover_art.name,
                    'is_safe': False,
                    'threats': [f'Scan error: {str(e)}'],
                    'scan_details': {}
                })
                track_result['threats'].append(f'Cover art scan error: {str(e)}')
        
        # Handle threats found
        if track_result['threats']:
            scan_results['threats_found'] += 1
            
            # Log security threat
            AuditLog.objects.create(
                user=track.artist.user,
                action='malware_detected',
                resource_type='Track',
                resource_id=str(track.id),
                request_data={
                    'track_title': track.title,
                    'threats': track_result['threats'],
                    'files_scanned': [f['file_path'] for f in track_result['files_scanned']],
                    'scan_timestamp': timezone.now().isoformat()
                }
            )
            
            # Quarantine the track
            if MediaFileService.quarantine_media_file(track, f"Malware detected: {'; '.join(track_result['threats'][:3])}"):
                scan_results['quarantined'] += 1
        
        # Update scan timestamp
        track.last_malware_scan = timezone.now()
        track.save()
        
        track_result['is_safe'] = len(track_result['threats']) == 0
        scan_results['tracks'].append(track_result)
        scan_results['total_scanned'] += 1
    
    # Scan album cover art
    for album in albums_to_scan:
        album_result = {'album_id': album.id, 'files_scanned': [], 'threats': []}
        
        if album.cover_art and default_storage.exists(album.cover_art.name):
            try:
                file_path = default_storage.path(album.cover_art.name)
                scan_result = MediaFileService.scan_media_file_for_malware(file_path)
                
                album_result['files_scanned'].append({
                    'file_type': 'cover_art',
                    'file_path': album.cover_art.name,
                    'is_safe': scan_result['is_safe'],
                    'threats': scan_result['threats_found'],
                    'scan_details': scan_result['scan_details']
                })
                
                if not scan_result['is_safe']:
                    album_result['threats'].extend(scan_result['threats_found'])
                    scan_results['threats_found'] += 1
                    
                    # Log security threat for album
                    AuditLog.objects.create(
                        user=album.artist.user,
                        action='malware_detected',
                        resource_type='Album',
                        resource_id=str(album.id),
                        request_data={
                            'album_title': album.title,
                            'threats': scan_result['threats_found'],
                            'file_path': album.cover_art.name,
                            'scan_timestamp': timezone.now().isoformat()
                        }
                    )
                    
            except Exception as e:
                album_result['files_scanned'].append({
                    'file_type': 'cover_art',
                    'file_path': album.cover_art.name,
                    'is_safe': False,
                    'threats': [f'Scan error: {str(e)}'],
                    'scan_details': {}
                })
                album_result['threats'].append(f'Cover art scan error: {str(e)}')
        
        # Update scan timestamp
        album.last_malware_scan = timezone.now()
        album.save()
        
        album_result['is_safe'] = len(album_result['threats']) == 0
        scan_results['albums'].append(album_result)
        scan_results['total_scanned'] += 1
    
    # Log scan completion
    AuditLog.objects.create(
        user=None,  # System task
        action='malware_scan_completed',
        resource_type='System',
        resource_id='malware_scanner',
        request_data={
            'scan_summary': {
                'total_scanned': scan_results['total_scanned'],
                'threats_found': scan_results['threats_found'],
                'quarantined': scan_results['quarantined'],
                'tracks_scanned': len(scan_results['tracks']),
                'albums_scanned': len(scan_results['albums'])
            },
            'scan_timestamp': timezone.now().isoformat()
        }
    )
    
    return scan_results