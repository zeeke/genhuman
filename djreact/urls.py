"""djreact URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.views import generic

from genetic_human import views

urlpatterns = [
    url(r'^api/v1/algorithms/(?P<algorithm_id>[0-9]+)/reset', views.reset_algorithm),
    url(r'^api/v1/algorithms/(?P<algorithm_id>[0-9]+)/individuals/update', views.update_individual),
    url(r'^api/v1/algorithms/(?P<algorithm_id>[0-9]+)/individuals', views.fetch_individuals),
    url(r'^api/v1/algorithms', views.get_algorithms),
    url(r'^admin/', admin.site.urls),
    url(r'^app2/', generic.TemplateView.as_view(template_name='sample_app2.html')),
    url(r'^$', generic.TemplateView.as_view(template_name='sample_app.html')),
    url(r'^algorithms/.*$', generic.TemplateView.as_view(template_name='sample_app.html')),
]

