from django.contrib import admin
from .models import Category, Product

admin.site.register(Category)


@admin.register(Product)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', ]
    list_filter = ['is_active']
