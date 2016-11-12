from django.contrib import admin

# Register your models here.
from genetic_human.models import AlgorithmOptions, Algorithm, Individual, Generation, Gene, Genoma


class IndividualAdmin(admin.ModelAdmin):
    list_display = ('id', 'algorithm_id', 'get_as_json')

admin.site.register(AlgorithmOptions)
admin.site.register(Algorithm)
admin.site.register(Individual, IndividualAdmin)
admin.site.register(Generation)
admin.site.register(Gene)
admin.site.register(Genoma)



