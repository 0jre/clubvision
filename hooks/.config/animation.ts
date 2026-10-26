export function hackAnimation(element: HTMLDivElement,message: string,  Stats: boolean, delay = 500, charDelay = 8, prefix = "",  onFinish?: () => void
) {
  const systemIPs = [
    "192.168.23.14", "172.45.66.78", "10.34.99.55", "45.23.16.82", "203.0.113.12", "172.66.12.9", "10.0.0.100"
  ];

  const passwords = [
    "admin123", "root!42", "secure!@#89", "system!2023", "defaultPass", "qwerty123", "toor@123", "newpassword!42", "rootAdmin@#456"
  ];

  const hackMessages = [
    "Initializing breach... Please wait...",
    "Establishing secure connection...",
    "Bypassing firewall protections...",
    "Injecting backdoor exploit...",
    "Accessing primary server...",
    "Decrypting security protocols...",
    "Verifying credentials...",
    "Searching for hidden admin keys...",
    "Injecting SQL payload into database...",
    "Injecting malicious script into user accounts...",
    "Root access achieved, searching for sensitive data...",
    "Exploit detected... Bypassing security alert...",
    "Attempting multiple exploits...",
    "Creating backdoor user...",
    "Disabling logging mechanisms...",
    "Gathering system metadata...",
    "Copying user credentials..."
  ];

  const randIp = systemIPs[Math.floor(Math.random() * systemIPs.length)];
  const randPassword = passwords[Math.floor(Math.random() * passwords.length)];
  const randMessage = hackMessages[Math.floor(Math.random() * hackMessages.length)];
  const visionId = Math.floor(Math.random() * 99999999);
  const hackStatus = Stats ? 'SUCCESS' : 'FAILURE';
   
  const randomError = Math.random() > 0.7 ? "ERROR: Network unstable, retrying..." : "ERROR: Access blocked, rerouting...";

  const asciiArt = `
   ______    _______  __   __  _______  __    _  __   __ 
  /    /|  /  ___  |/  |  |/  /  ___  |/  |  |/  |  |/
 |   / | |  /  _  |/   |   |/   /   |   |   |  |   |  |  
 |  /  | | |  /  _  |    |  |    /  |__|   |  |    |__  
 |_|   |_|/__/ |_|_|   |_|_/|_|_/  |_| |_|  
   `;

  const successCode = `
  [ INITIATING HACK... ] 
  > Connecting to target network... 
  > Spoofing DNS: ${randIp} 
  > Bypassing firewall...
  > ${randomError}

  [*] Target: SYSTEM MAINFRAME [${randIp}]
  [*] Searching for hidden credentials...
  [✓] Admin node found: system-node05.local
  [!] Failed login attempt #1 - retrying...
  [!] Failed login attempt #2 - retrying...
  [✓] Admin password found: ${randPassword}

  > ${randMessage}

  [*] Injecting malicious payload into system...
  [+] Access granted. Root access achieved.
  > Searching for sensitive data...
  > Searching for user credentials...
  > Searching for login information...
  > Attacking backup server...

  [*] Target System: novision
  [✓] Successfully accessed novision system...
  [✓] Accessing clubvision database...
  [✓] SQL Injection successful - injecting malicious data.

  [+] User found: vision_${visionId}
  [✓] Initializing system...
  [✓] Updating security protocols...

  > SYSTEM ALERT: Unauthorized access detected...
  > IP of attacker found: ${randIp} 
  > Sharing findings with security team...

  > SYSTEM ALERT: Intruder detected, ownerich initiated security lockdown!
  > Deploying countermeasures... [Security Sector Online]
  > SYSTEM INTRUSION: Hacker's vulnerability found.

  > SYSTEM RECOVERY IN PROGRESS... SYSTEM LOCKDOWN ENGAGED.

  > SYSTEM DELETED: COMPLETE FAILURE

  [✓] **SUCCESS**! O ataque foi bem-sucedido e o cliente foi verificado. 🎉
  [x] Parabéns! Você conseguiu o selo de verificação.
  > [system] ${message}
  ${asciiArt}
  `;

  const failureCode = `
  [ INITIATING HACK... ] 
  > Connecting to target network... 
  > Spoofing DNS: ${randIp} 
  > Bypassing firewall...

  [*] Target: SYSTEM MAINFRAME [${randIp}]
  [*] Searching for hidden credentials...
  [✓] Admin node found: system-node05.local
  [!] Failed login attempt #1 - retrying...
  [!] Failed login attempt #2 - retrying...
  [✓] Admin password found: ${randPassword}

  > ${randMessage}

  [*] Injecting malicious payload into system...
  [+] Access granted. Root access achieved.
  > Searching for sensitive data...
  > Searching for user credentials...
  > Searching for login information...
  > Attacking backup server...

  [*] Target System: novision
  [✓] Successfully accessed novision system...
  [✓] Accessing clubvision database...
  [✓] SQL Injection successful - injecting malicious data.
  [✓] Deploying data exfiltration tool...

  [+] User found: vision_${visionId}
  [✓] Initializing system...
  [✓] Updating security protocols...
  [✓] Disabling firewall...
  [✓] Deleting logs...

  > SYSTEM ALERT: Unauthorized access detected...
  > IP of attacker found: ${randIp} 
  > Sharing findings with security team...

  > SYSTEM ALERT: Intruder detected, ownerich initiated security lockdown!
  > Deploying countermeasures... [Security Sector Online]
  > SYSTEM INTRUSION: Hacker's vulnerability found.

  > Warning: Exploit triggered! Trojan horse deployed...
  [+] Trojan horse delivered... System infected.
  > Attacker's machine compromised. Infection spreading...
  > SYSTEM SHUTDOWN IN 5 SECONDS

  > aaaaaaaaaaaaaaaaaaaaaaah, fui descoberto!! 😱
  > Minha máquina foi infectada. 😡

  [!!!] SYSTEM FAILURE: Infection Complete
  > SYSTEM SHUTDOWN INITIATED... SYSTEM FAILURE PENDING...

  > SYSTEM RECOVERY IN PROGRESS... SYSTEM LOCKDOWN ENGAGED.

  > SYSTEM DELETED: COMPLETE FAILURE

  [!] ATTACKER: Infection successfully traced. Hack attempt foiled. Access revoked.
  > SYSTEM BACK ONLINE.

  ${asciiArt}

  [!] **FAILURE**! O ataque falhou... 😞
  > Desconectando... Não há mais como voltar. 
  `;

  // Função para exibir as mensagens iniciais
  const initialMessage = `
    Conectando ao darkvision...
    Aguardando um hacker...
  `;
  
  // Exibindo mensagens iniciais de "Conectando ao sistema..." e "Aguardando um hacker..."
  const initialDiv = document.createElement("div");
  element.appendChild(initialDiv);
  
  setTimeout(() => {
    initialMessage.split("\n").forEach((line, lineIndex) => {
      const lineDiv = document.createElement("div");
      initialDiv.appendChild(lineDiv);
      
      setTimeout(() => {
        line.split("").forEach((char, charIndex) => {
          setTimeout(() => {
            const span = document.createElement("span");
            span.textContent = char;
            lineDiv.appendChild(span);
          }, charDelay * charIndex);
        });
      }, delay * lineIndex);
    });
  }, delay);

  const waitTime = 10000 ; //  10 segundos

  setTimeout(() => {
    // Exibindo mensagem de conexão do hacker
    const hackerConnectionMessage = `
      Conectando ao sistema... Por favor, aguarde...
      [Hacker]: "Vou te ajudar com o hack para ter acesso ao selo de verificação."
      [Hacker]: "O preço pelo serviço já foi retirado de sua walletvision."
      [Hacker]: "Iniciando o hack..."
    `;
    
    const hackerDiv = document.createElement("div");
    element.appendChild(hackerDiv);
    
    setTimeout(() => {
      hackerConnectionMessage.split("\n").forEach((line, lineIndex) => {
        const lineDiv = document.createElement("div");
        hackerDiv.appendChild(lineDiv);
        
        setTimeout(() => {
          line.split("").forEach((char, charIndex) => {
            setTimeout(() => {
              const span = document.createElement("span");
              span.textContent = char;
              lineDiv.appendChild(span);
            }, charDelay * charIndex);
          });
        }, delay * lineIndex);
      });
    }, delay);

    // Iniciando a animação de hack após a mensagem de conexão
    setTimeout(() => {
      const lines = (hackStatus === 'SUCCESS' ? successCode : failureCode).split("\n");
      // Tempo total da animação de hack
const totalHackDuration = delay * lines.length + charDelay * Math.max(...lines.map(l => l.length));
 
      lines.forEach((line, lineIndex) => {
        const lineText = prefix + line;

        const lineDiv = document.createElement("div");
        element.appendChild(lineDiv);

        setTimeout(() => {
          lineText.split("").forEach((char, charIndex) => {
            setTimeout(() => {
              const span = document.createElement("span");
              span.textContent = char;

              if (char === " ") {
                span.classList.add("ml-1");
              }

              span.classList.add("char");
              lineDiv.appendChild(span);

 

            }, charDelay * charIndex);
          });
        }, delay * lineIndex);

         
// Dispara onFinish depois da animação terminar
setTimeout(() => {
  if (onFinish) {
    onFinish();
  }
}, totalHackDuration);
      })  
    }, waitTime);

    
    
  }, waitTime); // Tempo de espera antes de mostrar a mensagem de conexão
}


export function updateProgressBar(seconds: number, onComplete?: () => void) {
  let progress = 0
  const updateInterval = 1000
  const totalTime = seconds * 1000
  const progressIncrement = 100 / (totalTime / updateInterval)

  const progressBar = document.getElementById("progress-bar")
  const progressPercent = document.getElementById("progress-percent")

  if (!progressBar || !progressPercent) return

  const timer = setInterval(() => {
    progress += Math.floor(progressIncrement)

    if (progressBar) {
      progressBar.style.width = `${Math.min(100, progress)}%`
    }

    if (progressPercent) {
      progressPercent.textContent = `${Math.min(100, progress)}%`
    }

    if (progress >= 100) {
      clearInterval(timer)
      if (onComplete) onComplete()
    }
  }, updateInterval)
}
