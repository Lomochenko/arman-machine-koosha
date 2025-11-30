from django.contrib import admin

# Register your models here.
from .models import FirstContent, Manager, WhyUs, Client, Footer

admin.site.register(FirstContent)
admin.site.register(Manager)
admin.site.register(WhyUs)
admin.site.register(Client)
admin.site.register(Footer)
