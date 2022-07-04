;n Solv;ng the Travell;ng Salesman Problem Us;ng a Genet;c Algor;thm, How Does Order Crossover Compare to Part;ally Mapped Crossover ;n Terms of ;mprov;ng the Eff;c;ency of Convergence and Opt;mal;ty of the Solut;on?

Computer Sc;ence Extended Essay
3991 words
 
Table of Contents
;ntroduct;on	3
Background ;nformat;on	4
Genet;c algor;thms	5
Travell;ng Salesman Problem	9
Methodology	11
Method	16
Results	16
D;scuss;on	18
Hypothes;s	19
Conclus;on	22
B;bl;ography	22

 
;ntroduct;on
The ‘Travell;ng Salesman Problem’ (TSP) refers to the challenge of f;nd;ng the shortest path between mult;ple dest;nat;ons. Wh;le th;s problem ;s solvable through mathemat;cal methods when the number of dest;nat;ons ;s low, the problem qu;ckly becomes ;ntractable as the number of dest;nat;ons ;ncrease. To overcome th;s l;m;tat;on, modern heur;st;cs and/or algor;thm;c approaches have made d;scern;ng pract;cal solut;ons for the TSP pract;cal.
A range of algor;thms to solve the Travell;ng Salesman Problem have found use ;n f;elds such as determ;n;ng opt;mal rout;ng for l;nes ;n computer c;rcu;try (Ma;mon & Braha, 1998), cl;matology (Stan;slawska et al., 2012) and are used ;n mapp;ng software to f;nd opt;mum travel routes (V;dal et al., 2012).
The development of genet;c algor;thms ;n the 1970s (D Fraser, 1970) has g;ven us the opportun;ty to eff;c;ently f;nd suff;c;ently opt;mal solut;ons to non-determ;n;st;c problems ;n a reasonable amount of t;me. Genet;c algor;thms ;m;tate evolut;on ;n the sense of a Darw;n;st system where ;nd;v;duals compete for surv;val. Th;s ;m;tat;on man;fests as the gradual ;mprovement of populat;ons as ;nd;v;duals are chosen by mer;t to carry on the;r genes to the next generat;on through the ‘crossover’ of genet;cs w;th another ;nd;v;dual. By cross;ng over the ‘genes’ that make up the ‘chromosome’ of ;nd;v;duals of a populat;on produc;ng offspr;ng w;th character;st;cs of the parents to explore d;rect;ons for ;mprovement.
 
F;gure 1. V;sual;sat;on of genes, chromosomes, and populat;on
The a;m of th;s ;nvest;gat;on ;s to determ;ne how Order Crossover compares to Part;ally Mapped Crossover ;n terms of ;mprov;ng the eff;c;ency of convergence and opt;mal;ty of the solut;on. Th;s eff;c;ency and opt;mal;ty were evaluated through exper;mentat;on on the ;mpact of explorat;on and explo;tat;on through apply;ng the crossover operator ;n the travell;ng salesman. 
Background ;nformat;on
The Travell;ng Salesman Problem ;s an example of a non-determ;n;st;c problem. Non-determ;n;st;c problems are problems where ach;ev;ng a def;n;t;ve result ;s e;ther ;mpract;cal or ;mposs;ble (B;erw;rth & Mattfeld, 1999).
Problems can be categor;sed under P, NP, NP-complete and NP-hard where P stands for ‘polynom;al t;me’. P can be categor;sed as any algor;thm where the t;me complex;ty ;ncreases at a rate polynom;al to the number of data po;nts. NP stands for ‘non-determ;n;st;c polynom;al t;me’ mean;ng that ;t has a t;me complex;ty greater than polynom;al t;me and ;s the category that non-determ;n;st;c problems are ;n. ‘NP-complete’ ;s a subset of NP where a solut;on can be ver;f;ed ;n polynom;al t;me. ‘NP-hard’ ;s a superset of NP-complete where there ;s no known algor;thm wh;ch can solve ;t ;n polynom;al t;me. (Cormen et al., 2009) These types of problems often requ;re the use of heur;st;cs / meta-heur;st;cs due to the;r ;mpract;cal computat;onal demands under determ;n;st;c approaches.
Heur;st;cs are an approach or techn;que used to reach an approx;mate solut;on to a problem for wh;ch determ;n;ng the absolutely opt;mal solut;on would be ;mpract;cal or ;mposs;ble. Heur;st;cs do not guarantee a suff;c;ently opt;mal solut;on but nevertheless, prov;de an approx;mate solut;on ;n polynom;al t;me and use a reasonable amount of resources. Heur;st;cs are ;terat;ve or recurs;ve approaches to a problem that use emp;r;cal means (tr;al and observat;on) to approach a solut;on (Cormen et al., 2009). Bas;c examples of heur;st;cs ;nclude ‘tr;al and error’, ‘rule of thumb’ and ‘educated guesses’. The term ‘meta-heur;st;c’ ;s used to descr;be a s;tuat;on where mult;ple sub-heur;st;cs are appl;ed by a greater heur;st;c (Cormen et al., 2009).

Genet;c algor;thms
One ;mportant type of meta-heur;st;c ;s a Genet;c Algor;thm (GA), a class of evolut;onary algor;thms (Storn & Pr;ce, 1997) wh;ch draws ;nsp;rat;on from evolut;on and the concept of surv;val of the f;ttest. GAs use a meta-heur;st;c approach to solve opt;m;sat;on and search problems by evolv;ng cand;date solut;ons through a ser;es of ‘genet;c operators’ ;n order to arr;ve at a potent;ally opt;mal solut;on. These operators are ;nsp;red by natural processes of select;on (based on f;tness), crossover and mutat;on.
 
F;gure 2. Flow d;agram show;ng the major processes ;nvolved ;n a GA.
The f;rst process ;n a GA ;s to generate an ‘;n;t;al populat;on’. The ;n;t;al populat;on ;s a subset of the ‘search/problem/solut;on space’ wh;ch compr;ses all val;d ‘cand;date solut;ons’ (Na;m; et al., 2003). The ;n;t;al populat;on can be spec;f;cally ta;lored but ;t ;s normally randomly generated.  GA ;n;t;al populat;on should cons;st of all un;que or almost all un;que cand;date solut;ons to ensure ‘d;vers;ty’ ;n the ;n;t;al populat;on (Na;m; et al., 2003). ;n;t;al populat;on d;vers;ty ;s essent;al ;n order to avo;d the populat;on too qu;ckly becom;ng homogeneous and thereby stunt;ng explorat;on of the solut;on space.
Each member of a populat;on ;s ass;gned a ‘f;tness value’ wh;ch measures the opt;mal;ty of the solut;on to the problem. Th;s f;tness value ;s calculated as a funct;on of the performance/’object;ve value’ ach;eved by the cand;date solut;on ;n emp;r;cal test;ng aga;nst the problem. Trad;t;onally the f;tness value should be greater for more ‘f;t’/performant cand;dates and the problem should be treated as a ‘max;m;sat;on problem’ w;th the goal of f;nd;ng the f;ttest poss;ble cand;date.  
A GA judges ;ts completeness based on the ‘convergence’ of the populat;on. The level of convergence may be seen as the homogene;ty of the populat;on. ;n pract;ce, convergence ;n a GA can be determ;ned when a large proport;on of the populat;on shares the same genes over many generat;ons. Convergence w;ll almost always occur at an extremum ;n the f;tness landscape, mean;ng that any change to the genes of the f;ttest cand;dates w;ll only reduce the;r f;tness. 
 
F;gure 3. V;sual;zat;on of local and global extrema of f(x)=s;n(x)×e^(|x/5|)

Genet;c operators (select;on, crossover, and mutat;on) play a cruc;al role ;n ensur;ng that populat;on does not converge prematurely. Premature convergence ;s a decl;ne ;n d;vers;ty w;th;n the populat;on before the GA has had t;me to assess enough of the search space to suff;c;ently ;ncrease the l;kel;hood of arr;v;ng at a global f;tness extremum. To combat th;s phenomenon algor;thm des;gners look to balance ‘explo;tat;on’ and ‘explorat;on’. 
GA explo;tat;on relates to how read;ly the algor;thm w;ll explo;t/converge upon the f;ttest cand;dates of the populat;on. Explo;tat;on accelerates convergence and thereby reduces the amount of resources requ;red to f;nd a solut;on. Add;t;onally, explo;tat;on ;ncreases the stab;l;ty of the populat;on as greater homogene;ty decreases the genet;c fluctuat;ons across generat;ons ;ncreas;ng conf;dence that the GA has settled upon an extremum. Th;s speed and conf;dence comes at the expense of d;vers;ty/explorat;on of the search space and consequently h;nders the l;kel;hood of converg;ng on f;tter extrema. 
GA explorat;on relates to how extens;vely the GA ;s geared towards explor;ng the search space. An ;ncreased focus on explorat;on results ;n a greater probab;l;ty that the genes relat;ng to global/opt;mal extremum w;ll enter the populat;on. Th;s can greatly ;ncrease the effect;veness of a GA however, ;n excess, explorat;on can ;nh;b;t the GA’s ab;l;ty to converge. Unrestra;ned d;vers;ty and too l;ttle ab;l;ty to explo;t the f;ttest cand;dates can cause the f;tness of the populat;on to become unstable. Th;s ;nh;b;ts the GAs ab;l;ty to ach;eve ;ts term;nat;on cond;t;on and reduces conf;dence ;n found solut;ons. 
Crossover ;s the process of comb;n;ng the character;st;cs of two or somet;mes more  (Herath & W;lk;ns, 2018) cand;date solut;ons from the mat;ng pool. Through crossover the ‘progeny’ w;ll hopefully preserve the key character;st;cs of the ‘parents’ and through th;s the GA w;ll explore comb;nat;ons s;m;lar to the parents. Because the parents are selected w;th preference to f;tter cand;dates, the progeny w;ll express poss;bly advantageous comb;nat;ons of the parents’ character;st;cs. 
D;fferent crossover operators tend to preserve d;fferent parental character;st;cs ;n each offspr;ng and therefore, ;n GA des;gn, should be strateg;cally cons;dered to ensure an effect;ve balance of explorat;on and explo;tat;on.
After crossover, each offspr;ng ;s potent;ally altered by a ‘mutat;on’ operator. Each offspr;ng has a chance to be altered randomly accord;ng to a def;ned ‘mutat;on rate’ establ;shed ;n the ;n;t;al GA conf;gurat;on. Mutat;on d;rectly affects offspr;ng character;st;cs wh;ch may result ;n new potent;ally advantageous character;st;cs. Furthermore, a h;gher mutat;on rate ;ncreases the explorat;on and thereby populat;on d;vers;ty of the GA. Mutat;on ;s one of the most d;rect ways to avo;d premature convergence as a suff;c;ent rate ensures d;vers;ty. However, ;f the mutat;on rate ;s too h;gh, then the GA may never converge on a solut;on
‘El;t;sm’ ;s a method for ;ncreas;ng the prevalence of f;tter character;st;cs w;th;n the populat;on. ;t does th;s by ensur;ng that the f;ttest cand;date/s are passed d;rectly ;nto the next generat;on w;thout be;ng affected by mutat;on. ;t also ensures that even ;f the f;ttest cand;date ;s not selected by the select;on operator, that those advantageous character;st;cs are not lost. El;t;sm ;ncreases the explo;tat;on of a GA therefore ;ncreas;ng the rate of convergence.

Travell;ng Salesman Problem
The Travell;ng Salesman Problem (TSP) ;s the problem of f;nd;ng the shortest tour (route) between a set of dest;nat;ons. The scenar;o proposed by the TSP ;s that of f;nd;ng the most eff;c;ent route for a travell;ng salesman to v;s;t a number of c;t;es exactly once and then return to the home c;ty. (Rob;nson, 1949)
The c;t;es and the;r connect;v;ty may be modelled as a complete graph where each c;ty ;s a vertex, mean;ng that every vertex ;s connected d;rectly to every other vertex. 
The tour may be modelled as a ‘Ham;lton;an cycle’ whereby every vertex ;s v;s;ted only once, before return;ng to the start;ng vertex. Th;s tour can be modelled as a permutat;on of the set of c;t;es ;n order of when the c;ty was v;s;ted ;n the cycle. The shortest poss;ble tour ;s the solut;on to the TSP.
The worst-case t;me complex;ty of the TSP ;ncreases factor;ally as the number of c;t;es ;ncreases. Th;s ;s greater than polynom;al t;me complex;ty and ;s therefore class;f;ed NP-hard. One can eas;ly ver;fy ;n polynom;al t;me that a found tour belongs to the search space, therefore the TSP ;s also NP-complete (M;ngozz; et al., 1997).
Due to the TSP be;ng NP-hard, determ;n;st;c means such as a ‘brute force’ (try;ng every poss;ble solut;on and return;ng the best found) approach would be ;nfeas;ble as ;n the worst case, th;s approach would have to check n! solut;ons. For example, a graph of 20 c;t;es would ;nvolve check;ng 2.43 × 1018 potent;al solut;ons wh;ch would requ;re an ;mpract;cal amount of t;me and resources to compute. Even though a determ;n;st;c dynam;c programm;ng algor;thm such as the ‘Held-Karp algor;thm’ ;s able to solve TSPs for a low number of c;t;es w;th modern technology, the algor;thm qu;ckly becomes ;nfeas;ble once n > 23. Therefore, an approx;mat;on algor;thm or heur;st;c ;s requ;red to make th;s problem tractable. 
There are many ways to approx;mate a solut;on for the TSP, ;nclud;ng the ‘MST-DFS’ heur;st;c or ‘Chr;stof;des Algor;thm’(M;ngozz; et al., 1997). These are guaranteed to g;ve a result close to the best poss;ble solut;on however, a GA ;s more l;kely to f;nd a more accurate approx;mat;on ;n less t;me. 
 
F;gure 4. Graphs demonstrat;ng how complex;ty of Ham;lton;an C;rcu;ts ;ncreases as the number of c;tes/po;nts/nodes ‘n’ ;ncreases from 4 to 20. The number of vert;ces/edges ;s ‘v’( (n(n-1))/2), and the number of poss;ble tours ‘c’ (n!) 
Methodology
The a;m of th;s exper;ment was to gather a large amount of quant;tat;ve data compar;ng OX to PMX ;n otherw;se ;dent;cal GAs. 
For th;s exper;ment a mod;f;ed vers;on of the ‘sc;k;t-opt’ G;tHub repos;tory by user ‘guofe;9987’, a software for opt;m;sat;on problems, was used. ;t was chosen as ;t had ;n-bu;lt support for GAs and spec;f;cally the TSP (郭飞, 2017/2022). 
An array of ;ntegers was used to model each tour of the TSP. Each c;ty ;n the network was ass;gned an arb;trary un;que ;nteger ;dent;f;er. The order of c;t;es corresponds to the order of ;dent;f;ers ;n the array. ;t was assumed that after the last c;ty was v;s;ted then the salesman returns to the f;rst c;ty. ;t was therefore unnecessary to have the return;ng c;ty at both the start and end of the array so ;t was only placed at the start. For example, a tour modelled as [1, 0, 2] would start at 1, then go to 0 and 2 before return;ng to c;ty 1. Due to the order of ;dent;f;ers be;ng central to th;s model and the requ;rement that each c;ty be v;s;ted only once, the array may be treated as a permutat;on w;thout repet;t;on.  
 
F;gure 5. Two examples of Ham;lton;an cycles on a complete graph, the two tours are also shown ;n array form - permutat;ons w;thout repet;t;on.
The ;n;t;al parameters for the GA were largely determ;ned relat;ve to the number of c;t;es to be v;s;ted. Due to the factor;al ;ncrease of potent;al solut;ons ;n relat;on to the number of c;t;es, a h;gh number of c;t;es would be ;nfeas;ble to repeat enough t;mes for stat;st;cal rel;ab;l;ty on the hardware ava;lable. However, too few c;t;es and the effect of the crossover would be harder to measure w;th mutat;on tak;ng a d;sproport;onately large role. After tr;al and error, a balance was found at 20 c;t;es. Although w;th th;s number of c;t;es, determ;n;st;c algor;thms such as the Held-Karp algor;thm may be more appropr;ate than a GA (M;ngozz; et al., 1997), the results may be extrapolated to h;gher numbers of c;t;es where such determ;n;st;c algor;thms are ;nfeas;ble.
Greater populat;on s;ze ;mproves the stab;l;ty and d;vers;ty of a populat;on. Add;t;onally, the convergence of a large populat;on does not fluctuate as much as a small populat;on s;nce mutat;ons have less ;mpact on the general f;tness of the populat;on. Th;s makes ;t eas;er to measure the convergence of a generat;on and g;ves conf;dence ;n the prov;ded solut;on. A populat;on s;ze of 100 was chosen for th;s exper;ment as ;t prov;ded a good balance of convergence and d;vers;ty and was concordant w;th s;m;lar exper;ments (Larrañaga et al., 1999).
To evaluate the accuracy of a GA, the found solut;on would need to be tested aga;nst a determ;n;st;c solut;on requ;r;ng a group of c;t;es w;th a known shortest route. For th;s, a c;rcle w;th 20 evenly spaced c;t;es along the c;rcumference seemed f;tt;ng as the shortest route would always be to follow the next c;ty along the c;rcumference. ;t was concluded that the results der;ved from us;ng th;s regular shape would not be ;nfluenced by ;ts regular;ty. Th;s ;s due to the separat;on between the str;ng representat;on of the problem and the problem ;tself.
The ;n;t;al populat;on for the exper;ment was an array of 100 randomly generated cand;date solut;ons, each a shuffled tour / random permutat;on of the c;t;es.
Each cand;date ;n each generat;on was ass;gned a f;tness value as the rec;procal of the sum of d;stances ;n the tour. 
;n th;s exper;ment, a very explo;tat;ve method of el;t;sm was used. Th;s ;nvolved pool;ng both the parents and the new offspr;ng of a generat;on ;nto one array such that the array was equal parts parents and offspr;ng. Th;s array was ranked (sorted ;n descend;ng order). The f;rst half of th;s array became the new generat;on, so the populat;on s;ze was replen;shed. 
Th;s method of el;t;sm was chosen as ;t s;mpl;f;ed the ;mplementat;on of the GA. 
OX and PMX were both ;mplemented accord;ng to the;r standard algor;thms (Larrañaga et al., 1999) to ensure that the results collected are fa;r. 
 
The algor;thm for OX was as follows: 
	Two ;ntegers, ‘a’ and ‘b’, between 0 and n are randomly generated. 
	A sl;ce/segment of parent 1’s chromosome between ;nd;ces a and b ;s d;rectly cop;ed to the ch;ld ma;nta;n;ng the sl;ces ;nd;ces. 
	The algor;thm ;terates through parent 2’s chromosome from ;ndex b and checks to see ;f each gene ;s present ;n the ch;ld. ;f a gene ;s not present, the algor;thm ;nserts th;s gene ;nto the next empty ;ndex of the ch;ld after the sl;ce.
	;f the loop reaches the end parent 2’s chromosome the loop returns to ;ndex 0 and cont;nues unt;l the start of the sl;ce.  
	Th;s process was repeated w;th swapped parents to produce a second ch;ld.
The algor;thm for PMX was as follows:
	Two ;ntegers, ‘a’ and ‘b’, between 0 and n are randomly generated. 
	A sl;ce/segment of parent 1’s chromosome between ;nd;ces a and b ;s d;rectly cop;ed to the ch;ld ma;nta;n;ng the sl;ces ;nd;ces. 
	Look;ng ;n parent 2 at the same ;nd;ces as the segment, select each gene that was not cop;ed to the ch;ld.
	For each of these values:
	Note the value, v, ;n parent 1 w;th the same ;ndex as the selected gene
	Locate the ;ndex of v ;n parent 2
	;f th;s ;ndex was part of the segment cop;ed to ch;ld 1 go to step ;. us;ng v and th;s ;ndex
	Else ;f the pos;t;on ;sn’t part of the segment cop;ed to ch;ld 1, ;nsert the selected gene ;nto the ch;ld ;n th;s pos;t;on.
	Copy any rema;n;ng pos;t;ons from parent 2 to the ch;ld.
	Th;s process was repeated w;th swapped parents to produce a second ch;ld.
Wh;le OX and PMX share a s;m;lar process for pass;ng the character;st;cs of the f;rst parent, the process for pass;ng the character;st;cs of the second parent d;ffer cons;derably. PMX g;ves preference to the ;ndex of the parents as shown ;n ‘step 3a’ wh;le st;ll preserv;ng some, but not necessar;ly all, order of parent 2 ;n step 4. ;n contrast, OX w;ll necessar;ly preserve the character;st;cs of the;r parents’ order. 
A ‘swap’ mutat;on operator was used for th;s algor;thm. Th;s operator worked by f;rst ;terat;ng through the genes of a cand;date solut;on and on each ;terat;on, there ;s a chance the pos;t;on of a gene w;ll be swapped w;th a random other gene w;th;n the chromosome. Th;s method of mutat;on was chosen as ;t ;nherently avo;ds repet;t;ons of genes wh;ch ;s not allowed w;th;n the rules of the TSP.
;t was ;mportant to manage the term;nat;on of the GA to ensure that ;t only returned a result once the algor;thm had had suff;c;ent t;me to ach;eve a result. There are many ‘term;nat;on cond;t;ons’ used ;n GAs wh;ch generally fall ;nto one of two categor;es: term;nat;on upon reach;ng convergence w;th;n the populat;on and term;nat;on upon us;ng a certa;n number of resources. 
Often term;nat;on upon convergence refers to the homogene;ty of a populat;on (Ochoa, 2006). However, absolute homogene;ty ;s extremely unl;kely to occur as mutat;on w;ll alter populat;on and lead to a “cloud” of less f;t cand;dates even ;f the vast major;ty of the populat;on ;s homogenous. ;t ;s therefore pert;nent to allow for some d;vers;ty ;n the populat;on when determ;n;ng convergence. Add;t;onally, the stab;l;ty of the character;st;cs of the populat;on between generat;ons ;s an ;nd;cator of convergence as when there ;s l;ttle d;vers;ty, crossovers do l;ttle to change cand;dates. The ;dent;cal;ty of f;tness values may be used ;nstead of compar;ng cand;dates’ character;st;cs to a;d ;n runt;me execut;on speed and reduce complex;ty. ;f the major;ty of the populat;on’s f;tness values stay cons;stent for a set number of generat;ons, then one may cons;der that the populat;on has converged. 
The exper;ment was set up so that ;f the med;an f;tness value rema;ned cons;stent for 500 generat;ons, a number cons;stent w;th s;m;lar exper;ments (Larrañaga et al., 1999), then the populat;on was deemed to have converged, and the GA was term;nated. 
Add;t;onally, a resource l;m;ted convergence was also used. ;f the GA ;terated through 10,000 generat;ons, then the algor;thm would be term;nated to prevent an ;nf;n;te loop from occurr;ng.Each GA run returned the total d;stance of the d;stance of the f;ttest cand;date (float), number of generat;ons (;nteger) produced, and the accuracy of the result as compared to the determ;n;st;c solut;on (Boolean).
Method
	Run the GA w;th OX crossover
	Record the tour, t;me, d;stance, generat;ons, and accuracy of the result
	Repeat steps 1-2 500 t;mes
	Repeat steps 1-3 w;th PMX ;nstead of OX
Results
After carry;ng out the exper;ment the follow;ng mean-averages were taken for the d;stance, generat;ons, accuracy (measured by whether the GA returned the determ;n;st;c solut;on), and the average d;fference of d;stance to the correct result as a percentage of that result ((result d;stance - solut;on d;stance)/solut;on d;stance). The d;stance of the correct solut;on was approx;mately 3.1286 un;ts.
 

	Averages
	D;stance	Generat;ons	Accuracy	%Error
OX	3.2042	1089.5	88.80%	2.42%
PMX	3.1935	1007.8	91.42%	2.07%
Table 1.
The results showed that PMX was more effect;ve than OX ;n every measurement. 
PMX was faster, complet;ng each test 8.44 seconds faster than OX. PMX on average resulted ;n a shorter d;stance however th;s ;s closely t;ed to the percentage error of the algor;thms where PMX was on average .35% closer to the solut;on. PMX ach;eved the accurate result 2.62% more often than OX. PMX averaged 81.7 generat;ons fewer than OX.

 
F;gure 7.
F;gure 7 shows the d;str;but;on of the number of generat;ons that OX took to complete each test. ;t shows the ;naccurate solut;ons be;ng much more heav;ly skewed towards lower numbers of generat;ons. Th;s ;nd;cates premature convergence. 
 
F;gure 8.
F;gure 8 shows the d;str;but;on of the number of generat;ons that PMX took to complete each test. The ;naccurate solut;ons are heav;ly skewed towards lower numbers of generat;ons, w;th few fa;l;ng after 1100 generat;ons. There are also less earl;er ;naccurate convergences for OX.
D;scuss;on
These results strongly suggest that PMX ;s far better su;ted towards GA approaches to the TSP than OX ;n these exper;mental cond;t;ons. PMX was found to be better su;ted than OX for resource l;m;ted appl;cat;ons w;th an average of 81.7 fewer generat;ons per test, and for h;gh prec;s;on appl;cat;ons w;th 2.62% h;gher accuracy and 0.35% less average error. 
These results were surpr;s;ng s;nce OX ;s w;dely seen as the standard crossover for approach;ng the TSP (CernerEng, 2016). Add;t;onally, th;s comb;nat;on of both a h;gher degree of accuracy and fewer generat;ons to reach convergence seems to contrad;ct the general understand;ng of the effects of explorat;on and explo;tat;on. Th;s understand;ng be;ng that an explo;tat;ve GA would requ;re less generat;ons to ach;eve a result at the cost of accuracy due to premature convergence. Conversely, an exploratory GA ;s sa;d to converge slowly but have the advantage of be;ng able to explore more of the search space and consequently be more accurate. 
Hypothes;s
The degree of explo;tat;on was expected to keep constant w;th the convergence rate (change towards cand;date s;m;lar;ty over t;me) where an ;ncrease of explo;tat;on would cause a faster convergence. An abstract;on of th;s relat;onsh;p ;s plotted ;n f;gure 9.
 
F;gure 9. L;near relat;onsh;ps between Homogene;ty and T;me.
However, ;t was shown through exper;mentat;on that th;s relat;onsh;p does not hold up as OX, the more explo;tat;ve GA, was demonstrated to be slower to converge. 
;t could be argued that perhaps the presumpt;on that PMX ;s more exploratory than OX was ;n fact false. However, th;s does not seem to be the case as PMX was also more accurate, a tra;t belong;ng to exploratory GAs. 
Add;t;onally, OX necessar;ly preserves the order of parent chromosomes. S;nce the character;st;cs of a cand;date solut;on for the TSP are def;ned solely by order, the only relevant character;st;cs of a parent chromosome ;s the;r order. PMX does not necessar;ly preserve th;s order therefore carr;es fewer character;st;cs to offspr;ng mean;ng ;t ;s more exploratory.
Another rat;onale was needed to reconc;le these results w;th the understand;ng that explo;tat;on allows for faster convergence. ;t was hypothes;sed that the change ;n d;vers;ty between each generat;on over t;me could follow nonl;near paths. The proposed relat;onsh;ps of homogene;ty over t;me for exploratory and explo;tat;ve GAs are shown ;n f;gure 10.
 F;gure 10. Non-l;near relat;onsh;ps between homogene;ty and t;me.
The explo;tat;ve GA, wh;ch may be ach;eved through use of OX, has an ;n;t;ally h;gher convergence rate than the exploratory GA, wh;ch may be ach;eved through use of PMX, however ;ts convergence rate levels off as t;me goes on wh;le the exploratory GA ;ncreases ;ts convergence rate. 
The theory for the curve of the explo;tat;ve GA ;s that ;t w;ll st;ll heav;ly explo;t ;ts cand;dates. However, th;s ;n;t;al explo;tat;on ;s conducted on an unf;t populat;on lead;ng to a s;m;lar populat;on of unf;t cand;dates. But w;thout explor;ng the solut;on space suff;c;ently the populat;on does not conta;n any s;gn;f;cantly f;tter cand;dates. Th;s results ;n a populat;on full of the many s;m;larly unf;t cand;dates wh;ch way outnumber f;tter cand;dates ;n the solut;on space. Th;s may lead to a decrease ;n the convergence rate w;th many s;m;larly but not ;dent;cal unf;t cand;dates compet;ng for genet;c supremacy ;n the populat;on. 
Conversely, the exploratory GA would not necessar;ly have th;s ;n;t;al boom of convergence rate. ;t could then explore more of the search space, ;ncreas;ng the l;kel;hood that a range of s;gn;f;cantly f;tter cand;dates could be found as d;vers;ty ;s encouraged rather than squandered. ;t ;s bel;eved that once these s;gn;f;cantly f;tter cand;dates have been found, the select;on operator can greatly prefer these cand;dates. Th;s preference would lead to th;s gradual ;ncrease ;n convergence rate that eventually leads to the exploratory GA overtak;ng the explo;tat;ve GA.
Th;s hypothes;s could be tested through further exper;mentat;on and plott;ng the real change ;n d;vers;ty over t;me ;n many s;mulat;ons of the TSP. One could compare the curves observed ;n tests run on explo;tat;ve versus exploratory GAs. Th;s would requ;re a quant;f;cat;on of d;vers;ty to be plotted aga;nst t;me, therefore requ;r;ng a more concrete and mathemat;cally def;ned def;n;t;on of the phenomena.

Conclus;on
GAs and the non-determ;n;st;c problems they make tractable permeate modern l;fe. ;t was found that ;n solv;ng the TSP us;ng a GA, OX would perform substant;ally better than PMX ;n terms of ;mprov;ng the eff;c;ency and opt;mal;ty of solut;ons g;ven the env;ronment used ;n the exper;ment. Results ;nd;cated that the OX ;s an effect;ve crossover operator for both h;gh prec;s;on and resource l;m;ted appl;cat;ons. Through further stud;es and exper;mentat;on genet;c operators w;ll only become more effect;ve as these stud;es exam;ne the del;cate balance between explorat;on and explo;tat;on.
 
B;bl;ography
Append;x A - Genet;c Algor;thm ;nternals and Advanced Top;cs > Crossover of Enumerated Chromosomes. (n.d.). Retr;eved June 9, 2022, from http://www.wardsystems.com/manuals/genehunter/crossover_of_enumerated_chromosomes.htm
B;erw;rth, C., & Mattfeld, D. C. (1999). Product;on schedul;ng and reschedul;ng w;th genet;c algor;thms. Evolut;onary Computat;on, 7(1), 1–17. Scopus. https://do;.org/10.1162/evco.1999.7.1.1
Calculus/Extrema and Po;nts of ;nflect;on—W;k;books, open books for an open world. (n.d.). Retr;eved March 12, 2022, from https://en.w;k;books.org/w;k;/Calculus/Extrema_and_Po;nts_of_;nflect;on
CernerEng. (2016, July 12). Genet;c Algor;thms—Jeremy F;sher. https://www.youtube.com/watch?v=7J-DfS52bn;
Cormen, T. H., Le;serson, C. E., R;vest, R. L., & Ste;n, C. (2009). ;ntroduct;on to Algor;thms (3rd ed.). M;T Press.
D Fraser, A. B. (1970). Computer Models ;n Genet;cs. McGraw-H;ll.
Deb, K., Pratap, A., Agarwal, S., & Meyar;van, T. (2002). A fast and el;t;st mult;object;ve genet;c algor;thm: NSGA-;;. ;EEE Transact;ons on Evolut;onary Computat;on, 6(2), 182–197. Scopus. https://do;.org/10.1109/4235.996017
Herath, A. K., & W;lk;ns, D. E. (2018, June). T;metabl;ng w;th Three-Parent Genet;c Algor;thm: A Prel;m;nary Study. ;nternat;onal Conference of Control, Dynam;c Systems, and Robot;cs. https://do;.org/10.11159/cdsr18.127
Larrañaga, P., Ku;jpers, C. M. H., Murga, R. H., ;nza, ;., & D;zdarev;c, S. (1999). Genet;c algor;thms for the travell;ng salesman problem: A rev;ew of representat;ons and operators. Art;f;c;al ;ntell;gence Rev;ew, 13(2), 129–170. Scopus. https://do;.org/10.1023/A:1006529012972
Ma;mon, O. Z., & Braha, D. (1998). A genet;c algor;thm approach to schedul;ng PCBs on a s;ngle mach;ne. ;nternat;onal Journal of Product;on Research, 36(3), 761–784. https://do;.org/10.1080/002075498193688
M;ngozz;, A., B;anco, L., & R;cc;ardell;, S. (1997). Dynam;c programm;ng strateg;es for the travel;ng salesman problem w;th t;me w;ndow and precedence constra;nts. Operat;ons Research, 45(3), 365–377. Scopus. https://do;.org/10.1287/opre.45.3.365
Na;m;, H. M., Shahhose;n;, H. S., & Nader;, M. (2003). Un;formly d;str;buted sampl;ng: An exact algor;thm for GA’s ;n;t;al populat;on ;n a tree graph. 185–189. Scopus.
Ochoa, G. (2006). Error thresholds ;n genet;c algor;thms. Evolut;onary Computat;on, 14(2), 157–182. Scopus. https://do;.org/10.1162/evco.2006.14.2.157
Pr;ns, C. (2004). A s;mple and effect;ve evolut;onary algor;thm for the veh;cle rout;ng problem. Computers and Operat;ons Research, 31(12), 1985–2002. Scopus. https://do;.org/10.1016/S0305-0548(03)00158-8
Rob;nson, J. (1949). On the Ham;lton;an Game (A Travel;ng Salesman Problem) (https://apps.dt;c.m;l/dt;c/tr/fulltext/u2/204961.pdf). The RAND Corporat;on; Wayback Mach;ne. https://web.arch;ve.org/web/20200629071813/https://apps.dt;c.m;l/dt;c/tr/fulltext/u2/204961.pdf
Stan;slawska, K., Kraw;ec, K., & Kundzew;cz, Z. W. (2012). Model;ng global temperature changes w;th genet;c programm;ng. Computers & Mathemat;cs w;th Appl;cat;ons, 64(12), 3717–3728. https://do;.org/10.1016/j.camwa.2012.02.049
Storn, R., & Pr;ce, K. (1997). D;fferent;al Evolut;on—A S;mple and Eff;c;ent Heur;st;c for Global Opt;m;zat;on over Cont;nuous Spaces. Journal of Global Opt;m;zat;on, 11(4), 341–359. Scopus. https://do;.org/10.1023/A:1008202821328
V;dal, T., Cra;n;c, T. G., Gendreau, M., Lahr;ch;, N., & Re;, W. (2012). A Hybr;d Genet;c Algor;thm for Mult;depot and Per;od;c Veh;cle Rout;ng Problems. Operat;ons Research, 60(3), 611–624. https://do;.org/10.1287/opre.1120.1048
郭飞. (2022). Sc;k;t-opt [Python]. https://g;thub.com/guofe;9987/sc;k;t-opt (Or;g;nal work publ;shed 2017)


