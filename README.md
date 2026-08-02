# Friction first FAB26 Boston

The content in this repo has been created for the developement of the article [Friction First: A Toolkit for Teaching Critical Thinking in an Al-Saturated Classroom]() and for the complementary workshop [Friction First: Co-Building an Open Playbook for Critical Thinking Education in the Al Age](https://fab26.fabevent.org/programs/schedule?day=2026-07-28) presented at [FAB26](https://fab26.fabevent.org/) in Boston, Masachussetts.

## IMPORTANT NOTES ABOUT THE LICENSE OF THE CONTENT OF THIS REPO

All the work in this repo is licensed under **CC BY-NC-SA 4.0** which is Attribution-NonCommercial-ShareAlike 4.0 International check more on [LICENSE](./LICENSE)

![](./licensing/by-nc-sa.png)

## The framework

![](./diagram/diagram.png)

## Pedagocgical playbook

![](./deck/deck_layout.png)

## Content of this repo


### The contents of this repo are divided in the following folders:

- `diagram`: Which contains the assents and files used for the creation of the diagram used in the paper

- `presentations`: which contains the presentations for the workshop and the paper

- `deck`: which contains the assets and pdfs of the card game created for the workshop

- `utilities`: a set of python utilities to compress and decompress the assets and presentations bigger than 25 mb to be uploaded

- `website`: A WIP website to explore the framework in a more interactive way

### How to access the resources in this repo

The strucutre of the repo is the following:

```
FMB01_1665_IPompeuFabra/
├── deck/
│   ├── cards/
│   ├── images/
│   ├── pdf/
│   ├── key/
├── diagram/
│   ├── assets/
│   ├── photoshop/
│   ├── renders/
├── presentations/
│   ├── paper/
│   ├── workshop/
├── utilities/
├── website/
├── LICENSE
└── README.md
```

You might notice that inside the folders ```deck/pdf/hq_pdf```, ```deck/pdf/illustrator```, ```diagram/photoshop```,  ```presentations/paper/compressed_keynote```, and ```presentations/paper/compressed_pdf_hq``` there are a lot of ```.zip``` files. These files represent the compressed versions 

cada nom de subcarpeta a la carpeta ```presentations``` representa el tipus d'arxius dins ```pdf``` ```key``` (per keynote) i ```ppt``` (per arxius powerpoint). ```compress.py``` i ```uncompress.py``` són les utilitats que es faran servir per la descompressió. 

Dins de cada subcarpeta hi ha una nova jerarquia de carpetes, ```FULL``` per la presentació completa del mòdul o ```RA1```, ```RA2```, ```RA3```, ```RA4```, ```RA5``` i ```RA6``` per les presentacions (en el format que pertoque) de cada Resultat d'Aprenentatge. La carpeta ```pdf``` té un altra subcarpeta anomenada ```compressed```, aquesta té les presentacions de tot el mòdul i de cada RA com a pdf de baixa qualitat. Per fer ús d'aquestes, només cal obrir-les i prou, no hi ha cap altre procés.

En cas de que vulgueu accedir a pdfs de major qualitat o a altre tipus d'arxius editables, com els ja mencionats anteriorment, cal fer un pas posterior. 

## 4. Set up python

Si obriu qualsevol de les carpetes que no siga ```compressed```, vos adonareu de que aquestes contenen un munt d'arxius ```.zip``` (compressos) dividits en parts. La totalitat d'aquests representa cada presentació. Per accedir-hi, no les intenteu descomprimir amb els programes tradicionals, ja que, probablement no funcionarà. 

La descompressió és realitzarà amb l'arxiu ```uncompress.py```, un arxiu de python. Per fer-lo servir vos caldrà instal·lar python. Si teniu un mac, es farà de la següent manera:

### Instal·leu homebrew
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
```
brew update
```

### Instal·leu python && pip

```
brew install python
```

```
pip3 --version && python3 --version
```

### Instal·leu zipfile

```
pip install zip-files
```

## 5. Descompressió arxius

En el terminal, dins la carpeta ```presentations``` executeu el següent comandament:

```
python3 uncompress.py
```

Feu enter i rebreu el següent missatge al terminal:

```
Enter the folder path containing the zip parts:
```

Ací, haureu de teclejar la ruta de la carpeta on és la presentació a la qual voleu accedir. Posem-ne un exemple, si volguera descomprimir la presentació de l'RA2 en format keynote, posaria la ruta ```./key/RA2/```. La qual representa entrar a la carpeta ```key``` i subcarpeta ```RA2```, rebent el següent a la terminal:

```
➜  presentations git:(main) ✗ python3 uncompress.py
Enter the folder path containing the zip parts: ./key/RA2/

Reassembling 'RA2' from 8 parts...
  ✓ Processed RA2_part1.zip
  ✓ Processed RA2_part2.zip
  ✓ Processed RA2_part3.zip
  ✓ Processed RA2_part4.zip
  ✓ Processed RA2_part5.zip
  ✓ Processed RA2_part6.zip
  ✓ Processed RA2_part7.zip
  ✓ Processed RA2_part8.zip
Output file: ./key/RA2/RA2
Size: 102.44 MB
```

![](./imgs/documentation/step_3.png)
![](./imgs/documentation/step_4.png)
![](./imgs/documentation/step_5.png)

Una vegada fet veureu un arxiu generat, però sense extensió:

![](./imgs/documentation/step_6.png)

Per solventar-ho, caldra, en aquest cas, executar el següent comandament:

```
mv ./key/RA2/RA2 ./key/RA2/RA2.key
```

![](./imgs/documentation/step_7.png)
![](./imgs/documentation/step_8.png)

Cal que tingueu en compte, però, que caldra canviar les rutes ```./key/RA2/RA2``` i ```./key/RA2/RA2.key``` depenent de quin arxiu esteu descomprimint, per possar-ne un altre exemple, si volguera fer el mateix per la presentació de tot el mòdul complet en format power point, utilitzaria aquest comandament:


## About us

We are <a href="https://www.linkedin.com/in/sofia-llàcer-caro/" target=_blank>Sofia LLàcer Caro</a> from **Universitat Autònoma de Barcelona** and <a href="https://www.linkedin.com/in/jorgemunozzanon/" target=_blank>Jorge Muñoz Zanón</a> from **Generalitat de Catalunya** we are currently based in Barcelona. If you have any interest in collaborating with us to recommend or enhance our work don't hesitate to write to us, we will be happy to chat. 