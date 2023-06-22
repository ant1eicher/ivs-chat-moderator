let chatConnection: WebSocket;

const init = () => {
  const form = document.getElementById("settings-form") as HTMLFormElement;
  const chat = document.getElementById("chat-container") as HTMLElement;
  const submitChat = document.getElementById("submit-chat") as HTMLButtonElement;
  const msgInput = document.getElementById("chat-input") as HTMLInputElement;
  const usernameInput = document.getElementById("chat-username") as HTMLInputElement;
  const tokenInput = document.getElementById("chat-token") as HTMLInputElement;
  const endpointSelect = document.getElementById("chat-endpoint") as HTMLSelectElement;
  const submitButton = document.getElementById("submit-settings") as HTMLButtonElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (form.checkValidity()) {
      form.classList.add("d-none");
      chat.classList.remove("d-none");
      initChat();
    }
    form.classList.add("was-validated");
  });

  submitChat.addEventListener("click", () => {
    const payload = {
      action: "SEND_MESSAGE",
      content: stripHtml(msgInput.value),
      attributes: {
        username: usernameInput.value,
      },
    };

    if (chatConnection.readyState === WebSocket.OPEN) {
      try {
        chatConnection.send(JSON.stringify(payload));
      } catch (e) {
        console.error(e);
      }
    } else {
      console.error("WebSocket connection is not open");
    }

    msgInput.value = "";
    msgInput.focus();
  });

  msgInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevents the addition of a new line in the input when pressing Enter
      submitChat.click(); // Programmatically clicks the submit button
    }
  });

  usernameInput.value = `User${Math.floor(Math.random() * 10000)}`;

  function checkForm() {
    submitButton.disabled = !(usernameInput.value && tokenInput.value && endpointSelect.value);
  }

  usernameInput.addEventListener("input", checkForm);
  tokenInput.addEventListener("input", checkForm);
  endpointSelect.addEventListener("change", checkForm);

  checkForm();
};

function appendMessage(msgHtml: string) {
  const chatContainer = document.getElementById("chat") as HTMLElement;
  chatContainer.innerHTML += msgHtml;
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

const initChat = () => {
  const tokenInput = document.getElementById("chat-token") as HTMLInputElement;
  const endpointSelect = document.getElementById("chat-endpoint") as HTMLSelectElement;

  const token = tokenInput.value;
  const endpoint = endpointSelect.value;

  chatConnection = new WebSocket(endpoint, token);

  // listen for incoming messages
  chatConnection.onmessage = (event) => {
    // parse the event data
    const data = JSON.parse(event.data);

    // append the incoming msg to the chat
    const msgHtml = `<div class="mb-2"><b class="text-primary">${data.Attributes["username"]}</b>: ${data.Content}</div>`;
    appendMessage(msgHtml);
  };

  // handle close event
  chatConnection.onclose = (event) => {
    console.log(`WebSocket closed with code ${event.code} and reason ${event.reason}, wasClean: ${event.wasClean}`);
    appendMessage(
      '<div class="mb-2"><b class="text-primary">Websocket</b>: connection closed. Did you reuse the same token?</div>',
    );
  };
};

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

document.addEventListener("DOMContentLoaded", init);
