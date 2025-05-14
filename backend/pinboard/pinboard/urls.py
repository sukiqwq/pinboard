# pinterest_clone/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('pin.urls')), # Include your app's URLs under /api/
    # You might add auth URLs here (e.g., using dj-rest-auth)
    # path('api/auth/', include('dj_rest_auth.urls')),
    # path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)