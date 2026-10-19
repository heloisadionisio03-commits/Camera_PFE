
# CAPTURE — Câmera Web

## Integrantes
- Nome do integrante 

## Descrição
O CAPTURE é uma aplicação web desenvolvida para acessar a
câmera do dispositivo, realizar fotografias e processar as
imagens diretamente no navegador.

O usuário pode escolher um efeito visual, informar uma
identificação e gerar uma fotografia contendo a data e a
hora da captura.

## Tecnologias utilizadas
- HTML5: estrutura da aplicação.
- CSS3: estilização e responsividade.
- JavaScript: interações e controle da câmera.
- MediaDevices e getUserMedia: acesso à câmera.
- Canvas API: processamento e composição da fotografia.
- DOM: manipulação dos elementos da interface.

## Funcionalidades
- Acesso à câmera com solicitação de permissão.
- Visualização do vídeo em tempo real.
- Captura de fotografias.
- Efeitos preto e branco, sépia, original e alto contraste.
- Identificação personalizada na imagem.
- Registro da data e hora na fotografia.
- Visualização e download da imagem final.
- Controles para ligar e desligar a câmera.
- Mensagens de orientação em caso de erros.

## Como executar
1. Abra a pasta do projeto no Visual Studio Code.
2. Execute o arquivo index.html usando a extensão Live Server.
3. Permita o acesso à câmera quando o navegador solicitar.
4. Informe uma identificação e selecione um efeito.
5. Clique em Capturar imagem.
6. Visualize e baixe a fotografia processada.

O acesso à câmera exige um contexto seguro, como HTTPS ou
localhost. O arquivo pode não funcionar corretamente se for
aberto diretamente pelo caminho file://.

## Processamento e privacidade
O processamento da imagem é realizado no próprio navegador.
A aplicação não envia as fotografias para um servidor.

Ao desligar a câmera, todas as faixas do stream são
interrompidas por meio do método stop().

## Atividade
Programação Front-End
Professora Andreza Quintas
