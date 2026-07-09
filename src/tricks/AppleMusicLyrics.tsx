import {
  Music,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import beautifulDaysSrc from "../assets/sounds/harumachimusic-beautiful-days-feat-merrow.mp3";
import summerSongSrc from "../assets/sounds/sigmamusicart-summer-song.mp3";
import nobodyIsYouSrc from "../assets/sounds/sonican-country-song-nobody-is-you.mp3";

// --- Data Types ---
interface WordTiming {
  word: string;
  start: number; // in seconds
  duration: number; // in seconds
}

interface LyricLine {
  time: number; // start time in seconds
  duration: number; // duration in seconds
  text: string;
  words?: WordTiming[];
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  src: string;
  colors: string[]; // Blob colors
  coverBg: string; // CSS gradient for the cover
  lyrics: LyricLine[];
}

// --- Sample Tracks with Word-Level Synced Timings ---
const TRACKS: Track[] = [
  {
    id: "summer-song",
    title: "Summer Song",
    artist: "sigmamusicart",
    album: "Summer Anthems",
    duration: 134,
    src: summerSongSrc,
    colors: [
      "rgba(251,191,36,0.6)",
      "rgba(249,115,22,0.6)",
      "rgba(6,182,212,0.6)",
    ],
    coverBg: "linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #06b6d4 100%)",
    lyrics: [
      { time: 0, duration: 6.2, text: "[Upbeat EDM Intro]" },
      {
        time: 6.2,
        duration: 3.8,
        text: "Baby come closer",
        words: [
          { word: "Baby ", start: 6.2, duration: 0.8 },
          { word: "come ", start: 7.0, duration: 0.6 },
          { word: "closer", start: 7.6, duration: 2.4 },
        ],
      },
      {
        time: 10.0,
        duration: 4.1,
        text: "You're taking over me",
        words: [
          { word: "You're ", start: 10.0, duration: 0.5 },
          { word: "taking ", start: 10.5, duration: 0.8 },
          { word: "over ", start: 11.3, duration: 0.7 },
          { word: "me", start: 12.0, duration: 2.1 },
        ],
      },
      {
        time: 14.1,
        duration: 3.4,
        text: "Don't lose composure",
        words: [
          { word: "Don't ", start: 14.1, duration: 0.5 },
          { word: "lose ", start: 14.6, duration: 0.6 },
          { word: "composure", start: 15.2, duration: 2.3 },
        ],
      },
      {
        time: 17.5,
        duration: 4.5,
        text: "I know this summer's where we're meant to be",
        words: [
          { word: "I ", start: 17.5, duration: 0.3 },
          { word: "know ", start: 17.8, duration: 0.4 },
          { word: "this ", start: 18.2, duration: 0.3 },
          { word: "summer's ", start: 18.5, duration: 0.7 },
          { word: "where ", start: 19.2, duration: 0.4 },
          { word: "we're ", start: 19.6, duration: 0.3 },
          { word: "meant ", start: 19.9, duration: 0.5 },
          { word: "to ", start: 20.4, duration: 0.3 },
          { word: "be", start: 20.7, duration: 1.3 },
        ],
      },
      {
        time: 22.0,
        duration: 3.1,
        text: "Lights on the ceiling",
        words: [
          { word: "Lights ", start: 22.0, duration: 0.6 },
          { word: "on ", start: 22.6, duration: 0.3 },
          { word: "the ", start: 22.9, duration: 0.3 },
          { word: "ceiling", start: 23.2, duration: 1.9 },
        ],
      },
      {
        time: 25.1,
        duration: 3.1,
        text: "Your touch all I feel",
        words: [
          { word: "Your ", start: 25.1, duration: 0.4 },
          { word: "touch ", start: 25.5, duration: 0.6 },
          { word: "all ", start: 26.1, duration: 0.4 },
          { word: "I ", start: 26.5, duration: 0.3 },
          { word: "feel", start: 26.8, duration: 1.4 },
        ],
      },
      {
        time: 28.2,
        duration: 3.2,
        text: "Drinks keep on spilling",
        words: [
          { word: "Drinks ", start: 28.2, duration: 0.6 },
          { word: "keep ", start: 28.8, duration: 0.4 },
          { word: "on ", start: 29.2, duration: 0.4 },
          { word: "spilling", start: 29.6, duration: 1.8 },
        ],
      },
      {
        time: 31.4,
        duration: 3.4,
        text: "This night so unreal",
        words: [
          { word: "This ", start: 31.4, duration: 0.4 },
          { word: "night ", start: 31.8, duration: 0.6 },
          { word: "so ", start: 32.4, duration: 0.4 },
          { word: "unreal", start: 32.8, duration: 2.0 },
        ],
      },
      {
        time: 34.8,
        duration: 3.0,
        text: "Bodies are breathing",
        words: [
          { word: "Bodies ", start: 34.8, duration: 0.7 },
          { word: "are ", start: 35.5, duration: 0.3 },
          { word: "breathing", start: 35.8, duration: 2.0 },
        ],
      },
      {
        time: 37.8,
        duration: 3.1,
        text: "We're lost in the heat",
        words: [
          { word: "We're ", start: 37.8, duration: 0.4 },
          { word: "lost ", start: 38.2, duration: 0.6 },
          { word: "in ", start: 38.8, duration: 0.3 },
          { word: "the ", start: 39.1, duration: 0.3 },
          { word: "heat", start: 39.4, duration: 1.5 },
        ],
      },
      {
        time: 40.9,
        duration: 3.0,
        text: "Baby don't leave me",
        words: [
          { word: "Baby ", start: 40.9, duration: 0.6 },
          { word: "don't ", start: 41.5, duration: 0.5 },
          { word: "leave ", start: 42.0, duration: 0.5 },
          { word: "me", start: 42.5, duration: 1.4 },
        ],
      },
      {
        time: 43.9,
        duration: 4.6,
        text: "Just stay here with me",
        words: [
          { word: "Just ", start: 43.9, duration: 0.5 },
          { word: "stay ", start: 44.4, duration: 0.6 },
          { word: "here ", start: 45.0, duration: 0.5 },
          { word: "with ", start: 45.5, duration: 0.4 },
          { word: "me", start: 45.9, duration: 2.6 },
        ],
      },
      {
        time: 48.5,
        duration: 10.5,
        text: "[Synth Build-up & Chorus Melodies]",
      },
    ],
  },
  {
    id: "beautiful-days",
    title: "Beautiful Days",
    artist: "harumachimusic feat. merrow",
    album: "J-Pop Harmony",
    duration: 205.35,
    src: beautifulDaysSrc,
    colors: [
      "rgba(244,114,182,0.6)",
      "rgba(167,139,250,0.6)",
      "rgba(96,165,250,0.6)",
    ],
    coverBg: "linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #60a5fa 100%)",
    lyrics: [
      {
        time: 0.0,
        duration: 1.5,
        text: "[Piano Intro]",
      },
      {
        time: 1.5,
        duration: 6.1,
        text: "君の声を聞かせてよ",
        words: [
          { word: "君の", start: 1.5, duration: 1.4 },
          { word: "声を", start: 2.9, duration: 1.4 },
          { word: "聞かせて", start: 4.3, duration: 2.0 },
          { word: "よ", start: 6.3, duration: 1.3 },
        ],
      },
      {
        time: 7.6,
        duration: 6.2,
        text: "悲しみすら今は遠く",
        words: [
          { word: "悲しみ", start: 7.6, duration: 1.8 },
          { word: "すら", start: 9.4, duration: 1.1 },
          { word: "今は", start: 10.5, duration: 1.3 },
          { word: "遠く", start: 11.8, duration: 2.0 },
        ],
      },
      {
        time: 13.8,
        duration: 6.9,
        text: "その声を歌に重ねた日々を",
        words: [
          { word: "その", start: 13.8, duration: 0.9 },
          { word: "声を", start: 14.7, duration: 1.0 },
          { word: "歌に", start: 15.7, duration: 1.1 },
          { word: "重ねた", start: 16.8, duration: 1.6 },
          { word: "日々を", start: 18.4, duration: 2.3 },
        ],
      },
      {
        time: 20.7,
        duration: 4.8,
        text: "思い出して歩く",
        words: [
          { word: "思い出して", start: 20.7, duration: 3.0 },
          { word: "歩く", start: 23.7, duration: 1.8 },
        ],
      },
      {
        time: 25.5,
        duration: 12.3,
        text: "[Bright Piano & Synth Instrumental]",
      },
      {
        time: 37.8,
        duration: 5.7,
        text: "La la la la la",
        words: [
          { word: "La", start: 37.8, duration: 0.9 },
          { word: "la", start: 38.7, duration: 0.9 },
          { word: "la", start: 39.6, duration: 0.9 },
          { word: "la", start: 40.5, duration: 1.0 },
          { word: "la", start: 41.5, duration: 2.0 },
        ],
      },
      {
        time: 43.5,
        duration: 5.7,
        text: "La la la la la",
        words: [
          { word: "La", start: 43.5, duration: 0.9 },
          { word: "la", start: 44.4, duration: 0.9 },
          { word: "la", start: 45.3, duration: 0.9 },
          { word: "la", start: 46.2, duration: 1.0 },
          { word: "la", start: 47.2, duration: 2.0 },
        ],
      },
      {
        time: 49.2,
        duration: 5.6,
        text: "La la la la",
        words: [
          { word: "La", start: 49.2, duration: 1.0 },
          { word: "la", start: 50.2, duration: 1.0 },
          { word: "la", start: 51.2, duration: 1.1 },
          { word: "la", start: 52.3, duration: 2.5 },
        ],
      },

      {
        time: 54.8,
        duration: 6.2,
        text: "錆びついた花の色のように",
        words: [
          { word: "錆びついた", start: 54.8, duration: 2.0 },
          { word: "花の", start: 56.8, duration: 1.2 },
          { word: "色の", start: 58.0, duration: 1.2 },
          { word: "ように", start: 59.2, duration: 1.8 },
        ],
      },
      {
        time: 61.0,
        duration: 6.2,
        text: "忘れかけていたあの日の旋律",
        words: [
          { word: "忘れかけて", start: 61.0, duration: 2.2 },
          { word: "いた", start: 63.2, duration: 0.8 },
          { word: "あの日の", start: 64.0, duration: 1.4 },
          { word: "旋律", start: 65.4, duration: 1.8 },
        ],
      },
      {
        time: 67.2,
        duration: 6.2,
        text: "雑踏の中見送った背中を",
        words: [
          { word: "雑踏の", start: 67.2, duration: 1.5 },
          { word: "中", start: 68.7, duration: 0.8 },
          { word: "見送った", start: 69.5, duration: 1.7 },
          { word: "背中を", start: 71.2, duration: 2.2 },
        ],
      },
      {
        time: 73.4,
        duration: 6.2,
        text: "まだ胸の奥で探してる",
        words: [
          { word: "まだ", start: 73.4, duration: 1.2 },
          { word: "胸の", start: 74.6, duration: 1.3 },
          { word: "奥で", start: 75.9, duration: 1.3 },
          { word: "探してる", start: 77.2, duration: 2.4 },
        ],
      },
      {
        time: 79.6,
        duration: 7.4,
        text: "きらめくBeautiful Days",
        words: [
          { word: "きらめく", start: 79.6, duration: 2.5 },
          { word: "Beautiful", start: 82.1, duration: 2.4 },
          { word: "Days", start: 84.5, duration: 2.5 },
        ],
      },

      {
        time: 87.0,
        duration: 9.4,
        text: "[Piano & Synth Interlude]",
      },
      {
        time: 96.4,
        duration: 3.0,
        text: "La la la",
        words: [
          { word: "La", start: 96.4, duration: 0.8 },
          { word: "la", start: 97.2, duration: 0.8 },
          { word: "la", start: 98.0, duration: 1.4 },
        ],
      },

      {
        time: 99.4,
        duration: 6.1,
        text: "手を伸ばした空の向こうへ",
        words: [
          { word: "手を", start: 99.4, duration: 1.0 },
          { word: "伸ばした", start: 100.4, duration: 2.0 },
          { word: "空の", start: 102.4, duration: 1.1 },
          { word: "向こうへ", start: 103.5, duration: 2.0 },
        ],
      },
      {
        time: 105.5,
        duration: 6.2,
        text: "小さな夢をまた描いて",
        words: [
          { word: "小さな", start: 105.5, duration: 1.8 },
          { word: "夢を", start: 107.3, duration: 1.2 },
          { word: "また", start: 108.5, duration: 1.2 },
          { word: "描いて", start: 109.7, duration: 2.0 },
        ],
      },
      {
        time: 111.7,
        duration: 6.1,
        text: "迷いながら選んだ道も",
        words: [
          { word: "迷いながら", start: 111.7, duration: 2.8 },
          { word: "選んだ", start: 114.5, duration: 1.7 },
          { word: "道も", start: 116.2, duration: 1.6 },
        ],
      },
      {
        time: 117.8,
        duration: 6.2,
        text: "いつか優しさになる",
        words: [
          { word: "いつか", start: 117.8, duration: 1.8 },
          { word: "優しさに", start: 119.6, duration: 2.8 },
          { word: "なる", start: 122.4, duration: 1.6 },
        ],
      },
      {
        time: 124.0,
        duration: 6.1,
        text: "繰り返すBeautiful Days",
        words: [
          { word: "繰り返す", start: 124.0, duration: 2.7 },
          { word: "Beautiful", start: 126.7, duration: 2.0 },
          { word: "Days", start: 128.7, duration: 1.4 },
        ],
      },
      {
        time: 130.1,
        duration: 6.2,
        text: "夜を越えて",
        words: [
          { word: "夜を", start: 130.1, duration: 2.2 },
          { word: "越えて", start: 132.3, duration: 4.0 },
        ],
      },
      {
        time: 136.3,
        duration: 6.1,
        text: "願いの欠片が朝日に揺れる",
        words: [
          { word: "願いの", start: 136.3, duration: 1.5 },
          { word: "欠片が", start: 137.8, duration: 1.5 },
          { word: "朝日に", start: 139.3, duration: 1.5 },
          { word: "揺れる", start: 140.8, duration: 1.6 },
        ],
      },
      {
        time: 142.4,
        duration: 6.2,
        text: "君の声がした",
        words: [
          { word: "君の", start: 142.4, duration: 1.8 },
          { word: "声が", start: 144.2, duration: 1.8 },
          { word: "した", start: 146.0, duration: 2.6 },
        ],
      },
      {
        time: 148.6,
        duration: 6.4,
        text: "La la la la la",
        words: [
          { word: "La", start: 148.6, duration: 0.9 },
          { word: "la", start: 149.5, duration: 0.9 },
          { word: "la", start: 150.4, duration: 0.9 },
          { word: "la", start: 151.3, duration: 1.1 },
          { word: "la", start: 152.4, duration: 2.6 },
        ],
      },
      {
        time: 155.0,
        duration: 6.7,
        text: "La la la la",
        words: [
          { word: "La", start: 155.0, duration: 1.0 },
          { word: "la", start: 156.0, duration: 1.0 },
          { word: "la", start: 157.0, duration: 1.2 },
          { word: "la", start: 158.2, duration: 3.5 },
        ],
      },

      {
        time: 161.7,
        duration: 6.1,
        text: "きらめくBeautiful Days",
        words: [
          { word: "きらめく", start: 161.7, duration: 2.4 },
          { word: "Beautiful", start: 164.1, duration: 2.3 },
          { word: "Days", start: 166.4, duration: 1.4 },
        ],
      },
      {
        time: 167.8,
        duration: 7.7,
        text: "風にほどけて",
        words: [
          { word: "風に", start: 167.8, duration: 2.6 },
          { word: "ほどけて", start: 170.4, duration: 5.1 },
        ],
      },
      {
        time: 175.5,
        duration: 6.2,
        text: "涙の跡まで光に変わる",
        words: [
          { word: "涙の", start: 175.5, duration: 1.5 },
          { word: "跡まで", start: 177.0, duration: 1.5 },
          { word: "光に", start: 178.5, duration: 1.5 },
          { word: "変わる", start: 180.0, duration: 1.7 },
        ],
      },
      {
        time: 181.7,
        duration: 6.2,
        text: "君と笑えたなら",
        words: [
          { word: "君と", start: 181.7, duration: 1.8 },
          { word: "笑えた", start: 183.5, duration: 2.6 },
          { word: "なら", start: 186.1, duration: 1.8 },
        ],
      },
      {
        time: 187.9,
        duration: 4.9,
        text: "もう一度歩ける",
        words: [
          { word: "もう一度", start: 187.9, duration: 2.8 },
          { word: "歩ける", start: 190.7, duration: 2.1 },
        ],
      },
      {
        time: 192.8,
        duration: 3.0,
        text: "Beautiful Days",
        words: [
          { word: "Beautiful", start: 192.8, duration: 1.9 },
          { word: "Days", start: 194.7, duration: 1.1 },
        ],
      },
      {
        time: 195.8,
        duration: 6.4,
        text: "[Outro]",
      },
      {
        time: 202.2,
        duration: 3.15,
        text: "[End]",
      },
    ],
  },
  {
    id: "nobody-is-you",
    title: "Nobody Is You",
    artist: "sonican",
    album: "Country Horizon",
    duration: 142,
    src: nobodyIsYouSrc,
    colors: ["rgba(217,119,6,0.6)", "rgba(120,53,4,0.6)", "rgba(180,83,9,0.6)"],
    coverBg: "linear-gradient(135deg, #d97706 0%, #783504 50%, #b45309 100%)",
    lyrics: [
      { time: 0, duration: 14.8, text: "[Acoustic Guitar & Violin Intro]" },
      {
        time: 14.8,
        duration: 4.2,
        text: "Meet me where you met me before",
        words: [
          { word: "Meet ", start: 14.8, duration: 0.5 },
          { word: "me ", start: 15.3, duration: 0.4 },
          { word: "where ", start: 15.7, duration: 0.5 },
          { word: "you ", start: 16.2, duration: 0.3 },
          { word: "met ", start: 16.5, duration: 0.6 },
          { word: "me ", start: 17.1, duration: 0.4 },
          { word: "before", start: 17.5, duration: 1.5 },
        ],
      },
      {
        time: 19.0,
        duration: 4.1,
        text: "Running from the sands to the shore",
        words: [
          { word: "Running ", start: 19.0, duration: 0.8 },
          { word: "from ", start: 19.8, duration: 0.4 },
          { word: "the ", start: 20.2, duration: 0.3 },
          { word: "sands ", start: 20.5, duration: 0.7 },
          { word: "to ", start: 21.2, duration: 0.3 },
          { word: "the ", start: 21.5, duration: 0.3 },
          { word: "shore", start: 21.8, duration: 1.3 },
        ],
      },
      {
        time: 23.1,
        duration: 6.1,
        text: "Falling in the battlefield of time",
        words: [
          { word: "Falling ", start: 23.1, duration: 0.8 },
          { word: "in ", start: 23.9, duration: 0.3 },
          { word: "the ", start: 24.2, duration: 0.3 },
          { word: "battlefield ", start: 24.5, duration: 1.1 },
          { word: "of ", start: 25.6, duration: 0.4 },
          { word: "time", start: 26.0, duration: 3.2 },
        ],
      },
      {
        time: 29.2,
        duration: 3.9,
        text: "Waking at the end of the day",
        words: [
          { word: "Waking ", start: 29.2, duration: 0.7 },
          { word: "at ", start: 29.9, duration: 0.3 },
          { word: "the ", start: 30.2, duration: 0.3 },
          { word: "end ", start: 30.5, duration: 0.6 },
          { word: "of ", start: 31.1, duration: 0.3 },
          { word: "the ", start: 31.4, duration: 0.3 },
          { word: "day", start: 31.7, duration: 1.4 },
        ],
      },
      {
        time: 33.1,
        duration: 4.2,
        text: "Looking, do you hear what I say?",
        words: [
          { word: "Looking, ", start: 33.1, duration: 0.9 },
          { word: "do ", start: 34.0, duration: 0.4 },
          { word: "you ", start: 34.4, duration: 0.3 },
          { word: "hear ", start: 34.7, duration: 0.6 },
          { word: "what ", start: 35.3, duration: 0.4 },
          { word: "I ", start: 35.7, duration: 0.3 },
          { word: "say?", start: 36.0, duration: 1.3 },
        ],
      },
      {
        time: 37.3,
        duration: 6.5,
        text: "No one cared for her, she said goodbye",
        words: [
          { word: "No ", start: 37.3, duration: 0.5 },
          { word: "one ", start: 37.8, duration: 0.4 },
          { word: "cured ", start: 38.2, duration: 0.7 },
          { word: "for ", start: 38.9, duration: 0.4 },
          { word: "her, ", start: 39.3, duration: 0.6 },
          { word: "she ", start: 39.9, duration: 0.4 },
          { word: "said ", start: 40.3, duration: 0.6 },
          { word: "goodbye", start: 40.9, duration: 2.9 },
        ],
      },
      {
        time: 43.8,
        duration: 4.1,
        text: "Do you know how to play?",
        words: [
          { word: "Do ", start: 43.8, duration: 0.4 },
          { word: "you ", start: 44.2, duration: 0.3 },
          { word: "know ", start: 44.5, duration: 0.5 },
          { word: "how ", start: 45.0, duration: 0.4 },
          { word: "to ", start: 45.4, duration: 0.3 },
          { word: "play?", start: 45.7, duration: 2.2 },
        ],
      },
    ],
  },
];

// Return the left-to-right reveal amount for the current word.
function getWordRevealProgress(currentTime: number, word: WordTiming) {
  const elapsed = currentTime - word.start;
  return Math.max(0, Math.min(1, elapsed / word.duration));
}

// Keep whitespace outside the animated box so line wrapping stays stable.
function splitWordSpacing(word: string) {
  const text = word.trimEnd();
  return {
    space: word.slice(text.length),
    text,
  };
}

// Scale the active word group so the gray underlay and white reveal stay aligned.
function RevealedWord({
  duration,
  progress,
  word,
}: {
  duration: number;
  progress: number;
  word: string;
}) {
  const revealWidth = `${progress * 100}%`;
  const isRevealing = progress > 0;
  const visibleScale = isRevealing ? 1 : 1 / 1.1;
  const transitionDuration = `${duration * 1000}ms`;

  return (
    // text-[1.1em] to reserve space make words not overlap
    // inline-block to keep word itself from wrapping
    <span className="relative inline-block whitespace-nowrap text-[1.1em]">
      {/* take up space but does not paint */}
      <span className="invisible" aria-hidden="true">
        {word}
      </span>
      {/* gray underlay for the word */}
      <span
        className="absolute inset-y-0 left-0 z-0 whitespace-nowrap text-white/30 transition-transform ease-out"
        style={{
          transform: `scale(${visibleScale})`,
          transformOrigin: "left center",
          transitionDuration,
        }}
      >
        {word}
      </span>
      {/* white reveal for the word */}
      {isRevealing && (
        <span
          className="absolute inset-y-0 left-0 z-10 overflow-hidden whitespace-nowrap text-white drop-shadow-[0_4px_18px_rgba(255,255,255,0.16)]"
          style={{ width: revealWidth }}
          aria-hidden="true"
        >
          {word}
        </span>
      )}
    </span>
  );
}

export default function AppleMusicLyrics() {
  // --- States ---
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const track = TRACKS[currentTrackIndex];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyricsOnly, setShowLyricsOnly] = useState(false); // Mobile layout toggle

  // Sync state manually to avoid auto-scroll fighting
  const [isManualScroll, setIsManualScroll] = useState(false);

  // Audio element refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Layout refs
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const lyricLineRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasScrolledForTrackRef = useRef<number>(-1);
  const isAutoScrollingRef = useRef(true);
  const autoScrollTimeoutRef = useRef<number | null>(null);

  const stopPlaybackTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // --- Playback Controls ---
  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      setIsPlaying(false);
      console.warn("Audio playback could not start.", error);
    }
  }, [isMuted, volume]);

  const pausePlayback = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    stopPlaybackTimer();
  }, [stopPlaybackTimer]);

  const handleTrackChange = useCallback(
    (index: number) => {
      pausePlayback();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setIsManualScroll(false);
      isAutoScrollingRef.current = true;
    },
    [pausePlayback],
  );

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    handleTrackChange(nextIndex);
  }, [currentTrackIndex, handleTrackChange]);

  const prevTrack = useCallback(() => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    handleTrackChange(prevIndex);
  }, [currentTrackIndex, handleTrackChange]);

  const handleSeek = useCallback(
    (newTime: number) => {
      const clampedTime = Math.max(0, Math.min(track.duration, newTime));
      if (audioRef.current) {
        audioRef.current.currentTime = clampedTime;
      }
      setCurrentTime(clampedTime);
    },
    [track.duration],
  );

  const handleLyricClick = useCallback(
    (time: number) => {
      setIsManualScroll(false);
      isAutoScrollingRef.current = true;
      handleSeek(time);
    },
    [handleSeek],
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (isMuted) setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = val;
        audioRef.current.muted = false;
      }
    },
    [isMuted],
  );

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  }, [isMuted]);

  const activeLineIndex = track.lyrics.reduce((acc, line, idx) => {
    if (currentTime >= line.time) {
      return idx;
    }
    return acc;
  }, 0);

  // make sure the active lyric line is scroll to the center in the container
  useEffect(() => {
    if (isManualScroll || !lyricsContainerRef.current) return;

    const activeEl = lyricLineRefs.current[activeLineIndex];
    if (activeEl) {
      isAutoScrollingRef.current = true;
      if (autoScrollTimeoutRef.current) {
        window.clearTimeout(autoScrollTimeoutRef.current);
      }

      const isInitial = hasScrolledForTrackRef.current !== currentTrackIndex;
      if (isInitial) {
        hasScrolledForTrackRef.current = currentTrackIndex;
      }

      activeEl.scrollIntoView({
        behavior: isInitial ? "auto" : "smooth",
        block: "center",
      });

      autoScrollTimeoutRef.current = window.setTimeout(
        () => {
          isAutoScrollingRef.current = false;
        },
        isInitial ? 150 : 1000,
      );
    }
  }, [activeLineIndex, isManualScroll, currentTrackIndex]);

  const handleLyricsScroll = useCallback(() => {
    if (isAutoScrollingRef.current) return;
    setIsManualScroll(true);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;
  }, [isMuted, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.load();
    stopPlaybackTimer();
  }, [currentTrackIndex, stopPlaybackTimer]);

  useEffect(() => {
    if (!isPlaying) return;

    const syncPlaybackTime = () => {
      const audio = audioRef.current;
      if (!audio) return;

      setCurrentTime(audio.currentTime);
      animationFrameRef.current = requestAnimationFrame(syncPlaybackTime);
    };

    animationFrameRef.current = requestAnimationFrame(syncPlaybackTime);
    return stopPlaybackTimer;
  }, [isPlaying, stopPlaybackTimer]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (autoScrollTimeoutRef.current)
        clearTimeout(autoScrollTimeoutRef.current);
    };
  }, []);

  const formatTime = (timeSecs: number) => {
    const mins = Math.floor(timeSecs / 60);
    const secs = Math.floor(timeSecs % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className="relative flex flex-col w-full h-[80vh] md:h-[650px] overflow-hidden rounded-[24px] border border-white/10 select-none font-body shadow-2xl bg-zinc-950 text-white"
      style={
        {
          "--blob-1": track.colors[0],
          "--blob-2": track.colors[1],
          "--blob-3": track.colors[2],
        } as React.CSSProperties
      }
    >
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onEnded={() => {
          setCurrentTime(0);
          setIsPlaying(false);
          stopPlaybackTimer();
        }}
        onLoadedMetadata={(event) => {
          event.currentTarget.volume = volume;
          event.currentTarget.muted = isMuted;
        }}
        onPause={() => {
          setIsPlaying(false);
          stopPlaybackTimer();
        }}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
      />
      {/* Animated Liquid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-zinc-950/80">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] md:w-[450px] md:h-[450px] rounded-full mix-blend-screen opacity-40 blur-[100px] animate-blob-1 bg-[var(--blob-1)]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] md:w-[450px] md:h-[450px] rounded-full mix-blend-screen opacity-40 blur-[100px] animate-blob-2 bg-[var(--blob-2)]" />
        <div className="absolute top-[20%] right-[20%] w-[70vw] h-[70vw] md:w-[350px] md:h-[350px] rounded-full mix-blend-screen opacity-30 blur-[90px] animate-blob-3 bg-[var(--blob-3)]" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[60px]" />
      </div>

      <div className="relative flex flex-col md:flex-row h-full w-full z-10">
        {/* LEFT COLUMN: Cover & Player */}
        <div
          className={`flex-1 flex flex-col items-center justify-center p-6 md:p-12 border-r border-white/5 transition-all duration-500 ${
            showLyricsOnly ? "hidden md:flex" : "flex"
          }`}
        >
          {/* mobile header */}
          <div className="w-full flex items-center justify-between mb-6 md:hidden">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-white/50">
              Playing Now
            </span>
            <button
              onClick={() => setShowLyricsOnly(true)}
              className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full flex items-center gap-1 border border-white/10 text-white cursor-pointer"
            >
              <Sparkles size={12} className="inline mr-1" /> Lyrics View
            </button>
          </div>

          {/* cover art */}
          <div
            className={`w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 ease-out ${
              isPlaying
                ? "scale-100 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
                : "scale-90"
            }`}
            style={{ background: track.coverBg }}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_70%)]" />
            <Music
              size={60}
              className={`text-white drop-shadow-lg ${isPlaying ? "animate-pulse" : ""}`}
            />
            <div className="absolute inset-0 border border-white/20 rounded-2xl pointer-events-none" />
          </div>

          {/* track info */}
          <div className="mt-8 text-center max-w-full">
            <h3 className="font-display font-extrabold text-2xl tracking-tight leading-none text-white truncate max-w-[280px] md:max-w-xs">
              {track.title}
            </h3>
            <p className="mt-2 text-white/60 text-sm font-semibold truncate max-w-[280px]">
              {track.artist} &mdash; {track.album}
            </p>
          </div>

          {/* controls */}
          <div className="w-full max-w-[320px] mt-6">
            <div className="flex flex-col gap-1.5">
              <input
                type="range"
                min="0"
                max={track.duration}
                step="0.05"
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white hover:accent-pink-400 focus:outline-none transition-all"
                aria-label="Track Progress"
              />
              <div className="flex justify-between text-[11px] font-semibold tracking-wider text-white/40 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(track.duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4">
              <button
                onClick={prevTrack}
                className="p-2 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all bg-transparent border-0 cursor-pointer"
                aria-label="Previous Track"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={isPlaying ? pausePlayback : startPlayback}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all border-0 cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={24} fill="black" />
                ) : (
                  <Play size={24} fill="black" className="ml-1" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 text-white/70 hover:text-white hover:scale-110 active:scale-95 transition-all bg-transparent border-0 cursor-pointer"
                aria-label="Next Track"
              >
                <SkipForward size={24} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={toggleMute}
                className="text-white/60 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                aria-label="Volume Slider"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Lyrics Scrolling */}
        <div
          className={`flex-1 flex flex-col h-full overflow-hidden p-6 md:p-12 relative transition-all duration-500 ${
            showLyricsOnly ? "flex" : "hidden md:flex"
          }`}
        >
          <div className="w-full flex items-center justify-between pb-4 border-b border-white/5 z-20 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-[2px] text-white/50 flex items-center gap-1.5">
              <Sparkles size={12} className="text-pink-400" /> Synced Lyrics
            </span>

            <div className="flex items-center gap-2">
              <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/10 text-xs font-semibold">
                {TRACKS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => handleTrackChange(idx)}
                    className={`px-2.5 py-1 rounded-md transition-all border-0 cursor-pointer ${
                      currentTrackIndex === idx
                        ? "bg-white/15 text-white"
                        : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    Track {idx + 1}
                  </button>
                ))}
              </div>

              {/* mobile: return to cover art */}
              <button
                onClick={() => setShowLyricsOnly(false)}
                className="md:hidden text-xs px-3 py-1 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-full flex items-center gap-1 border border-white/10 text-white cursor-pointer"
              >
                Cover Art
              </button>
            </div>
          </div>

          {/* sync scroll button */}
          {isManualScroll && (
            <button
              onClick={() => {
                isAutoScrollingRef.current = true;
                setIsManualScroll(false);
              }}
              className="absolute bottom-10 right-10 z-30 px-4 py-2 text-xs font-semibold bg-white text-black hover:bg-white/90 shadow-2xl rounded-full flex items-center gap-2 border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw size={12} /> Sync to playback
            </button>
          )}

          {/* lyrics container */}
          <div
            ref={lyricsContainerRef}
            onScroll={handleLyricsScroll}
            // snap-y snap-mandatory to controls whether a scroll container should “snap” to certain child elements when scrolling. snap-y enables snapping on the vertical axis, and snap-mandatory makes the browser always settle on a snap point when scrolling stops.
            className="flex-1 overflow-y-auto mt-4 px-2 py-[220px] scrollbar-none snap-y snap-mandatory relative"
            // faded top and bottom edges to indicate more content
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)",
            }}
          >
            {track.lyrics.map((line, idx) => {
              const isActive = activeLineIndex === idx;
              return (
                <button
                  key={idx}
                  ref={(el) => {
                    lyricLineRefs.current[idx] = el;
                  }}
                  onClick={() => handleLyricClick(line.time)}
                  className={`w-full text-left font-display font-extrabold text-2xl sm:text-3xl md:text-4xl py-5 transition-all duration-500 focus:outline-none block snap-center origin-left leading-tight bg-transparent border-0 cursor-pointer ${
                    isActive
                      ? "text-white opacity-100 drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                      : "text-white/30 hover:text-white/60"
                  }`}
                  aria-label={`Jump to: ${line.text}`}
                >
                  {isActive && line.words ? (
                    <span>
                      {line.words.map((w, wIdx) => {
                        const progress = getWordRevealProgress(currentTime, w);
                        const { space, text } = splitWordSpacing(w.word);
                        return (
                          <React.Fragment key={wIdx}>
                            <RevealedWord
                              duration={w.duration}
                              progress={progress}
                              word={text}
                            />
                            {space}
                          </React.Fragment>
                        );
                      })}
                    </span>
                  ) : (
                    <span>{line.text}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
          33% { transform: translate(60px, -40px) scale(1.15) rotate(120deg); }
          66% { transform: translate(-30px, 40px) scale(0.9) rotate(240deg); }
          100% { transform: translate(0px, 0px) scale(1) rotate(360deg); }
        }
        .animate-blob-1 {
          animation: drift 20s infinite ease-in-out alternate;
        }
        .animate-blob-2 {
          animation: drift 25s infinite ease-in-out alternate-reverse;
        }
        .animate-blob-3 {
          animation: drift 18s infinite ease-in-out alternate;
        }
        
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
