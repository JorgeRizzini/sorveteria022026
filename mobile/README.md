# Soft Cream Mobile

Aplicativo React Native criado com Expo. Reutiliza a API e o banco Supabase do projeto.

## Funcionalidades

- Home e cardápio com busca, filtros e catálogo de contingência
- Carrinho persistente entre reinicializações do aplicativo
- Cadastro, login, renovação de sessão e logout
- Checkout com cálculo de preços no servidor
- Perfil e histórico de pedidos com atualização por gesto
- Token protegido com SecureStore

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

## Validação técnica

```powershell
npm.cmd run lint
npm.cmd run build
$env:EXPO_NO_TELEMETRY='1'
npm.cmd exec --workspace mobile expo export -- --platform android --output-dir ../dist/mobile
```

Antes da entrega, percorra cadastro, login, adição ao carrinho, reinicialização do app, checkout e histórico em pelo menos um aparelho Android real.
