
const video = document.getElementById("video");
const btnCamera = document.getElementById("btnCamera");
const btnCapturar = document.getElementById("btnCapturar");
const identificacao = document.getElementById("identificacao");
const efeito = document.getElementById("efeito");
const indicador = document.getElementById("indicador");
const status = document.getElementById("status");
const aviso = document.getElementById("aviso");
const mensagemCamera = document.getElementById("mensagemCamera");
const imagemFinal = document.getElementById("imagemFinal");
const resultadoVazio = document.getElementById("resultadoVazio");
const btnBaixar = document.getElementById("btnBaixar");

let stream = null;

// Liga a câmera e solicita autorização ao usuário.
async function ligarCamera() {
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {
        aviso.textContent =
            "Seu navegador não permite acessar a câmera neste endereço. " +
            "Use HTTPS ou localhost.";
        return;
    }

    btnCamera.disabled = true;
    aviso.textContent = "Solicitando acesso à câmera...";

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user"
            },
            audio: false
        });

        video.srcObject = stream;
        await video.play();

        video.style.display = "block";
        mensagemCamera.hidden = true;

        indicador.classList.add("ativo");
        status.textContent = "Câmera ligada";
        btnCamera.textContent = "Desligar câmera";
        btnCapturar.disabled = false;

        aviso.textContent = "Câmera pronta para capturar.";
    } catch (erro) {
        stream = null;

        if (erro.name === "NotAllowedError" ||
            erro.name === "PermissionDeniedError") {
            aviso.textContent =
                "Permissão negada. Autorize o uso da câmera nas " +
                "configurações do navegador e tente novamente.";
        } else if (erro.name === "NotFoundError") {
            aviso.textContent =
                "Nenhuma câmera foi encontrada neste dispositivo.";
        } else {
            aviso.textContent =
                "Não foi possível acessar a câmera. Verifique se " +
                "ela está conectada e se outro aplicativo a está utilizando.";
        }

        status.textContent = "Câmera indisponível";
        video.srcObject = null;
        video.style.display = "none";
        mensagemCamera.hidden = false;
        btnCapturar.disabled = true;
    } finally {
        btnCamera.disabled = false;
    }
}

// Desliga a câmera interrompendo todas as faixas do stream.
function desligarCamera() {
    if (stream) {
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    stream = null;
    video.pause();
    video.srcObject = null;
    video.style.display = "none";

    indicador.classList.remove("ativo");
    status.textContent = "Câmera desligada";
    btnCamera.textContent = "Ligar câmera";
    btnCapturar.disabled = true;
    mensagemCamera.hidden = false;

    aviso.textContent =
        "Câmera desligada. Você pode ligá-la novamente quando quiser.";
}

// Verifica se a câmera continua disponível.
function cameraDisponivel() {
    return stream &&
        stream.active &&
        stream.getVideoTracks().some((track) =>
            track.readyState === "live"
        ) &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        video.videoWidth > 0 &&
        video.videoHeight > 0;
}

// Captura e processa a fotografia usando Canvas.
function capturarImagem() {
    if (!cameraDisponivel()) {
        aviso.textContent =
            "Ligue a câmera e aguarde a imagem aparecer antes de capturar.";
        return;
    }

    const canvas = document.createElement("canvas");
    const contexto = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Espelha a imagem para corresponder à prévia da câmera.
    contexto.save();
    contexto.translate(canvas.width, 0);
    contexto.scale(-1, 1);

    // Aplica o efeito escolhido pelo usuário.
    contexto.filter = efeito.value;
    contexto.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    contexto.restore();
    contexto.filter = "none";

    // Cria uma faixa escura para facilitar a leitura dos textos.
    const alturaFaixa = Math.max(75, canvas.height * 0.17);

    contexto.fillStyle = "rgba(0, 0, 0, 0.72)";
    contexto.fillRect(
        0,
        canvas.height - alturaFaixa,
        canvas.width,
        alturaFaixa
    );

    const nome = identificacao.value.trim() ||
        "Captura sem identificação";

    const agora = new Date();

    const dataHora = agora.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium"
    });

    const margem = canvas.width * 0.035;

    // Ajusta os textos conforme o tamanho da imagem.
    const tamanhoFonte = Math.max(16, canvas.width * 0.035);

    contexto.fillStyle = "#ffffff";
    contexto.textAlign = "left";
    contexto.textBaseline = "middle";
    contexto.font = `bold ${tamanhoFonte}px Arial`;

    // Identificação gravada na fotografia.
    contexto.fillText(
        nome,
        margem,
        canvas.height - alturaFaixa * 0.65,
        canvas.width - margem * 2
    );

    contexto.font = `${Math.max(12, tamanhoFonte * 0.65)}px Arial`;

    // Data e hora gravadas na fotografia.
    contexto.fillText(
        dataHora,
        margem,
        canvas.height - alturaFaixa * 0.25,
        canvas.width - margem * 2
    );

    // Exibe o resultado final.
    const imagem = canvas.toDataURL("image/png");

    imagemFinal.src = imagem;
    imagemFinal.hidden = false;
    resultadoVazio.hidden = true;

    btnBaixar.href = imagem;
    btnBaixar.hidden = false;

    aviso.textContent = "Fotografia capturada com sucesso!";
}

// Eventos da interface.
btnCamera.addEventListener("click", () => {
    if (stream && stream.active) {
        desligarCamera();
    } else {
        ligarCamera();
    }
});

btnCapturar.addEventListener("click", capturarImagem);

// Encerra a câmera ao sair ou recarregar a página.
window.addEventListener("pagehide", desligarCamera);
