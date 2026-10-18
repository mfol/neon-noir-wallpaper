NEON NOIR — Setor Shinjuku 09

Wallpaper web original para o Wallpaper Engine. Cena cyberpunk procedurally desenhada em HTML, sem bibliotecas ou imagens externas obrigatórias.

## Importar no Wallpaper Engine

1. Abra o editor do Wallpaper Engine.
2. Arraste `index.html` desta pasta para **Create Wallpaper / Criar wallpaper**.
3. Mantenha-o como um projeto separado. Isso não troca o wallpaper que já está aplicado a nenhum monitor.
4. Use **AJUSTAR CIDADE** no card de clima para configurar a cidade do Weather Uplink. **CONFIGURAÇÕES**, no topo, abre perfil/avatar/fundo. As propriedades do projeto também permitem ajustar nickname, assinatura, cidade, chuva, brilho e idioma.

## Funcionalidades

- Cidade neon com chuva animada; alternar no botão de guarda-chuva ou tecla **R**.
- Dois níveis de brilho; botão de meia-lua ou tecla **B**.
- Imagem de fundo e avatar locais, nickname e assinatura personalizáveis no painel de engrenagem.
- Relógio analógico/digital e data locais.
- Clima ao vivo opcional via Open-Meteo: informe uma cidade no painel. Requer rede e envia o nome da cidade ao serviço; não precisa de chave de API.
- Layout responsivo; textos acompanham o idioma do navegador. No Wallpaper Engine, a opção **Idioma da interface** começa em Português (Brasil), pois o renderer interno pode informar `en-US` mesmo com o Windows em pt-BR.
- Visualizador de áudio do sistema Wallpaper Engine e listeners de metadados/capa da mídia, quando a integração do host estiver habilitada.
- Controles de mídia no card: faixa anterior, reproduzir/pausar e próxima faixa. Eles enviam teclas multimídia globais ao player ativo do Windows.
- Telemetria da sessão: tempo ativo, tempo por frame e coordenadas do ponteiro.
- **H** oculta/mostra o HUD; **Espaço** pausa animações ambientais; **Esc** fecha as configurações.

## Auxiliar dos controles de mídia

A integração web oficial do Wallpaper Engine fornece dados de mídia, mas não comandos de reprodução. Por isso, os botões usam `pack_midia_control.py`, um auxiliar local que aceita somente essas três ações e escuta apenas em `127.0.0.1:47613`.

Para iniciar, execute no Windows Terminal ou PowerShell:

```text
python "C:\temp\pack-midia-control\src\pack_midia_control.py"
```

Mantenha a janela aberta enquanto usar os controles; fechá-la encerra o auxiliar. Ele controla o player associado à sessão de mídia global do Windows, não um aplicativo específico, e não inicia automaticamente com o Windows.

Imagens e preferências ficam no armazenamento local da página do wallpaper. O wallpaper atual permanece intacto; importar o novo projeto não o aplica automaticamente a um monitor.
