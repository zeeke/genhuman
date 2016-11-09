from django.http.response import JsonResponse


def search_events_by_latitude_and_longitude(request):
    # Risposta farlocca per iniziare a lavorare sul frontend
    return JsonResponse({
        'meta': {
        },
        'items': [
            {
                'id': 'dryhaw7urgtka758q60',
                'name': 'cane'
            },
            {
                'id': 'fdsyufgi6qc2rct283c',
                'name': 'evento corrispondente alla ricerca di ' + request.GET['query']
            }
        ]
    })
