<?php

namespace App\Enums;

enum DocumentType: string
{
    case Verdict = 'putusan';
    case Evidence = 'bukti';
    case Minutes = 'berita_acara';
    case Attachment = 'lampiran';
}
