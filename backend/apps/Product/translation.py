from modeltranslation.translator import translator, TranslationOptions
from modeltranslation.decorators import register
from .models import Category, Product


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('title', 'short_description')
