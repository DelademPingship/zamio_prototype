from django.contrib import admin

from music_monitor.models import (
    Dispute, 
    FailedPlayLog, 
    MatchCache, 
    PlayLog, 
    StreamLog,
    SnippetIngest,
    AudioDetection
)

# Register your models here.
admin.site.register(MatchCache)
admin.site.register(PlayLog)
admin.site.register(FailedPlayLog)
admin.site.register(StreamLog)
admin.site.register(Dispute)

@admin.register(SnippetIngest)
class SnippetIngestAdmin(admin.ModelAdmin):
    list_display = ('chunk_id', 'station', 'started_at', 'processed')
    list_filter = ('processed', 'station')
    search_fields = ('chunk_id', 'station__name')
    raw_id_fields = ('audio_detection',)

@admin.register(AudioDetection)
class AudioDetectionAdmin(admin.ModelAdmin):
    list_display = ('detection_id', 'track', 'station', 'detection_source', 'confidence_score')
    list_filter = ('detection_source', 'processing_status')
    search_fields = ('track__title', 'station__name')
    raw_id_fields = ('track', 'station')
