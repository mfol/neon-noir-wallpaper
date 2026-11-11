# NEON NOIR — Setor Shinjuku 09

Wallpaper web original para o Wallpaper Engine. A cena cyberpunk é desenhada proceduralmente em HTML Canvas e CSS; não exige bibliotecas nem imagens externas para renderizar a cidade padrão.

## Arquivos do projeto

- `index.html` — interface, cena animada e lógica do wallpaper em um arquivo autocontido.
- `project.json` — metadados e propriedades que o Wallpaper Engine expõe no editor.
- `preview.jpg` — imagem de pré-visualização do projeto.

## Importar no Wallpaper Engine

1. Abra o editor do Wallpaper Engine.
2. Arraste `index.html` para **Create Wallpaper / Criar wallpaper**.
3. Mantenha-o como projeto separado. Importar não substitui nem aplica o wallpaper nos monitores.
4. Ajuste as propriedades no editor ou use os controles apresentados sobre a cena.

## Como funciona

A cidade, prédios, letreiros, iluminação e chuva são desenhados no navegador usando Canvas 2D. O layout adapta-se ao tamanho da janela. Relógio, data, telemetria de renderização e posição do ponteiro são calculados localmente; a telemetria não é enviada a um serviço.

### Controles

- **Chuva:** botão de guarda-chuva ou tecla `R`.
- **Brilho reduzido:** botão de meia-lua ou tecla `B`.
- **HUD:** tecla `H`.
- **Pausar efeitos ambientais:** `Espaço` (não pausa o player de mídia).
- **Fechar configurações:** `Esc`.
- **Configurações:** nickname, assinatura, avatar, fundo, chuva e brilho. O avatar (máx. 2 MB), fundo (máx. 3 MB) e demais preferências são guardados no `localStorage` do perfil do navegador/Wallpaper Engine, sob a chave `neonNoirPrefs.v1`. Remover os dados locais do perfil apaga essas preferências.
- **Idioma:** propriedade `Idioma da interface` no `project.json` (`pt-br`, `en-us` ou `auto`). O valor inicial é Português (Brasil), pois o renderer do Wallpaper Engine pode informar `en-US` mesmo com o Windows em português.

As propriedades do Wallpaper Engine (`nickname`, `signature`, `weathercity`, `rain`, `dim`, `uilanguage`) são recebidas por `window.wallpaperPropertyListener`; mudanças são refletidas na interface e persistidas nas preferências locais.

### Clima ao vivo (opcional)

Informe uma cidade em **AJUSTAR CIDADE** no card de clima ou nas configurações. O wallpaper consulta a API de geocodificação Open-Meteo para encontrar a primeira correspondência e depois consulta o endpoint de previsão atual para temperatura, sensação térmica, umidade, precipitação, código de condição e vento. Não requer chave de API. A consulta é refeita a cada 15 minutos enquanto houver uma cidade configurada. O nome da cidade é enviado ao Open-Meteo; se a rede falhar ou a cidade não for encontrada, o card indica indisponibilidade. Sem cidade, nenhum pedido de clima é feito.

### Integração de áudio e mídia do Wallpaper Engine

Quando a integração de mídia do Wallpaper Engine estiver habilitada, o wallpaper registra os listeners oficiais do host para áudio, metadados, capa, estado de reprodução e status. Eles atualizam o equalizador visual, título/artista e capa do álbum. Esses dados vêm do host e são separados dos comandos de controle descritos abaixo.

## Integração com `pack-midia-control`

O Wallpaper Engine fornece ao wallpaper dados e estado da mídia, mas essa integração web não fornece os comandos de transporte usados pelos três botões. Para **anterior**, **reproduzir/pausar** e **próxima**, o wallpaper chama o projeto auxiliar [`../pack-midia-control/README.md`](../pack-midia-control/README.md), que roda localmente no Windows.

### Fluxo

1. Inicie o auxiliar em um terminal Windows e deixe-o aberto:

   ```powershell
   python C:\temp\pack-midia-control\src\pack_midia_control.py
   ```

2. O servidor escuta somente em `127.0.0.1:47613` (loopback). No início, o wallpaper consulta `GET http://127.0.0.1:47613/health` para indicar se o auxiliar está acessível.
3. Ao clicar num controle, o wallpaper envia `POST` para uma rota permitida: `/media/previous`, `/media/play-pause` ou `/media/next`, com corpo JSON vazio `{}`.
4. O auxiliar converte a ação numa tecla multimídia global do Windows (`VK_MEDIA_PREV_TRACK`, `VK_MEDIA_PLAY_PAUSE` ou `VK_MEDIA_NEXT_TRACK`) usando `SendInput`. O Windows encaminha a tecla ao player que controla a sessão de mídia global ativa; o auxiliar não escolhe nem inicia um aplicativo.
5. Uma resposta bem-sucedida atualiza o indicador e mostra confirmação. Se o serviço estiver parado ou a chamada falhar, os controles mostram o estado offline e orientam iniciar `pack_midia_control.py`.

O auxiliar aceita origens CORS `null` (usada pela página local do Wallpaper Engine) e origens de preview local listadas no próprio código. Não habilite o serviço numa interface de rede: ele foi intencionalmente limitado a loopback. A lista de rotas é restrita às três ações; origens não autorizadas são recusadas. O auxiliar não registra títulos nem atividade de mídia.

O Wallpaper Engine **não inicia** o auxiliar, e ele não está configurado para iniciar automaticamente com o Windows. Encerrar a janela do terminal encerra os controles; os metadados e a visualização de áudio nativos do Wallpaper Engine podem continuar funcionando independentemente. Requisitos, implementação e testes do auxiliar estão no README do projeto adjacente. Os testes usam um emissor simulado e não controlam o player real.

## Uso de IA (Claude Code, Codex e outros)

O card **USO DE IA** mostra, para o mês corrente: custo estimado, tokens (entrada/saída), projeção até o fim do mês, consumo por agente e o bloco ativo de 5 horas (custo, tempo restante e custo por hora). Os dados vêm da rota `GET /usage` do mesmo auxiliar `pack-midia-control`, que executa o [ccusage](https://github.com/ryoppippi/ccusage) sobre os logs locais. Requer Node.js e o auxiliar em execução; sem ele o card mostra "OFFLINE". O wallpaper consulta a rota a cada 2 minutos.

- Os valores são estimativas calculadas a partir de tokens, não a cobrança oficial nem o percentual restante do plano.
- Propriedade `Orçamento mensal de IA (US$)` (`aibudget`, 0 = sem barra): quando maior que zero, o card mostra a barra de progresso e destaca em rosa se passar de 80% ou se a projeção ultrapassar o orçamento.

## Privacidade e rede

- A cena padrão, relógio, animações e telemetria são locais.
- O clima é opcional; quando configurado, o nome da cidade e coordenadas geocodificadas são enviados ao Open-Meteo para obter as condições atuais.
- Controles de transporte e o card de uso de IA usam somente o serviço local de loopback `127.0.0.1:47613`.
- Avatar, fundo e preferências permanecem no armazenamento local do perfil; não são enviados pelo wallpaper.

## Arquivos instalados

Este repositório é a cópia de desenvolvimento em `C:\temp\NeonNoirWallpaper`. O Wallpaper Engine pode manter uma cópia importada separadamente dentro da pasta de projetos do aplicativo; editar este checkout não atualiza automaticamente a cópia importada. O auxiliar de mídia tem checkout separado em `C:\temp\pack-midia-control`.
