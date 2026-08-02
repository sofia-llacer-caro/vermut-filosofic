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

### The contents of this repo are divided in the following folders:

- `diagram`: Which contains the assents and files used for the creation of the diagram used in the paper

- `presentations`: which contains the presentations for the workshop and the paper

- `deck`: which contains the assets and pdfs of the card game created for the workshop

- `utilities`: a set of python utilities to compress and decompress the assets and presentations bigger than 25 mb to be uploaded

- `website`: A WIP website to explore the framework in a more interactive way

### How to access the resources in this repo

The strucutre of the repo is the following:

```
friction-first/
├── deck/
│   ├── cards/
│   ├── images/
│   ├── pdf/
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

A few of these folders (`deck/pdf/hq_pdf`, `deck/pdf/illustrator`, `deck/images/psd`, `presentations/paper/compressed_keynote`, `presentations/paper/compressed_pdf_hq`) don't contain the original files directly — GitHub won't take anything over 25 MB, so anything bigger than that has been split into numbered `.zip` parts (`name_part1.zip`, `name_part2.zip`, ...) instead. `utilities/compress.py` and `utilities/uncompress.py` are what split them and what puts them back together.

**To reassemble a file:**

Make sure you have Python installed. On a Mac, if you don't already:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew update
brew install python
```

Then, from inside `utilities/`, run:

```
python3 uncompress.py
```

It'll ask for the folder containing the zip parts — point it at whichever one you need, for example:

```
Enter the folder path containing the zip parts: ../deck/pdf/hq_pdf
```

and it reassembles everything in that folder, printing each part as it goes:

```
Reassembling 'deck_hq' from 4 parts...
  ✓ Processed deck_hq_part1.zip
  ✓ Processed deck_hq_part2.zip
  ✓ Processed deck_hq_part3.zip
  ✓ Processed deck_hq_part4.zip
Output file: ../deck/pdf/hq_pdf/deck_hq
Size: 84.12 MB
```

The output file comes out without an extension, so you'll need to rename it to whatever it actually is (`.pdf`, `.psd`, `.key`, etc.) once it's done:

```
mv ../deck/pdf/hq_pdf/deck_hq ../deck/pdf/hq_pdf/deck_hq.pdf
```

`compress.py` works the same way in reverse, if you ever need to split a new large file before committing it.

## About us

We are <a href="https://www.linkedin.com/in/sofia-llàcer-caro/" target=_blank>Sofia LLàcer Caro</a> from **Universitat Autònoma de Barcelona** and <a href="https://www.linkedin.com/in/jorgemunozzanon/" target=_blank>Jorge Muñoz Zanón</a> from **Generalitat de Catalunya** we are currently based in Barcelona. If you have any interest in collaborating with us to recommend or enhance our work don't hesitate to write to us, we will be happy to chat. 
