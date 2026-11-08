# ArcadeCream Mobile

Aplicativo React Native criado com Expo. Reutiliza a API e o banco Supabase do projeto.

## Executar

Na raiz do repositório, configure `EXPO_PUBLIC_API_URL` no `.env` com o IP local do computador, por exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3001
```

Depois, em terminais separados:

```powershell
npm.cmd run dev:api
npm.cmd run dev:mobile
```

Leia o QR Code usando o Expo Go. O celular e o computador precisam estar na mesma rede.

Para Android Emulator, a URL padrão `http://10.0.2.2:3001` acessa o computador. Para um aparelho físico, informe obrigatoriamente o IPv4 do computador.
