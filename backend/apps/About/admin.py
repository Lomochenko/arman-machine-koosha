from django.contrib import admin

# Register your models here.
from .models import About, Gallery, Employee, Honer, Services

admin.site.register(About)
admin.site.register(Gallery)
admin.site.register(Employee)
admin.site.register(Honer)
admin.site.register(Services)
