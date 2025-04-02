from django.urls import path
from .views import RegisterView, TaskListCreate, TaskDetail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('tasks/', TaskListCreate.as_view(), name='task_list_create'),
    path('tasks/<int:pk>/', TaskDetail.as_view(), name='task_detail'),
]
