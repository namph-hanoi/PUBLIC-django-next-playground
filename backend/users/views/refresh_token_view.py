from rest_framework_simplejwt.views import TokenRefreshView as TokenRefreshJWT
from devtools.debug import chill
from decouple import config


class TokenRefreshView(TokenRefreshJWT):

    def post(self, request, *args, **kwargs):
        response = super().post(
            request,
            *args,
            **kwargs,
        )
        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')
        response.data = {
            config("ACCESS_TOKEN_KEY", default="ACCESS_TOKEN"): access_token,
            config("REFRESH_TOKEN_KEY", default="REFRESH_TOKEN"): refresh_token,
        }
        
        return response
