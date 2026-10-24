---
title: Wo die Sterne liegen
description: Wo loopy Sterne und Fortschritt speichert, wie es sie schützt und was sie löschen kann.
sidebar:
  order: 1
---
Deine Sterne wohnen auf diesem Handy oder Computer. Sie bleiben da, wenn du loopy schließt.

loopy hat keine Konten. Alles liegt in diesem Browser, auf diesem Gerät. Nichts wird gesendet, außer ein Erwachsener schaltet den [Familien-Sync](/loopy/guide/de/stars/family-sync/) ein.

## Zwei Speicher im Browser

loopy speichert alles zweimal:

- **localStorage**, ein kleiner Speicher. Jede Seite liest ihn beim Öffnen.
- **IndexedDB**, ein großer Speicher. Er hat eine Kopie der gleichen Dinge.

Wird der kleine Speicher gelöscht, aber der große hat die Kopie noch, holt loopy alles zurück und lädt die Seite einmal neu. Sperrt ein Browser den großen Speicher (manche privaten Fenster tun das), arbeitet loopy nur mit dem kleinen.

Sobald ein Kind Sterne hat, bittet loopy den Browser, sie dauerhaft zu behalten. Dann löscht der Browser sie nicht, wenn auf dem Gerät der Platz knapp wird. loopy fragt nur einmal pro Gerät.

## Was gespeichert wird, und für wen

Jedes Kind hat eigene Sterne, Abzeichen, Serien, ein eigenes Alter, eigene Stufen und Einstellungen in den Spielen, die Antworten je Art und die falschen Antworten für die Seite für Erwachsene und sein letztes Spiel. Mehr unter [Kinder und Alter](/loopy/guide/de/setup/kids-and-ages/).

Farbthema, **Leichter lesen**, Ton und Sprache gelten für alle auf dem Gerät.

## Was sie löschen kann

- **Browserdaten löschen.** Löschst du Verlauf, Cookies oder Websitedaten für loopy, sind die Sterne weg.
- **Private Fenster.** Ein privates oder Inkognito-Fenster vergisst alles, wenn es zugeht.
- **Ein Kind entfernen** in den ⚙ Einstellungen löscht die Sterne dieses Kindes auf diesem Gerät.
- **Ein anderer Browser** hat eigene Speicher. Sterne in Safari sind nicht in Chrome.
- **Die App auf dem Home-Bildschirm** hat auf iPhone, iPad und Mac eigene Sterne, getrennt von Safari. Mehr unter [Zum Home-Bildschirm](/loopy/guide/de/setup/home-screen/).

Auf der Seite für Erwachsene löscht **Antworten löschen** nur die Liste der Antworten. Sterne und Abzeichen bleiben. Antworten, die älter als 30 Tage sind, verschwinden von selbst.

## Eine Kopie behalten

Sicher ist sicher. Bewahre eine Kopie woanders auf:

1. Mach mit **Sicherung speichern** eine Sicherungsdatei. Mehr unter [Sicherungsdatei](/loopy/guide/de/stars/backup-file/).
2. Oder bring die Sterne auf ein zweites Gerät. Mehr unter [Sterne auf ein anderes Gerät bringen](/loopy/guide/de/stars/move-stars/).
3. Oder schalte den [Familien-Sync](/loopy/guide/de/stars/family-sync/) ein, dann haben alle Geräte der Familie sie.
