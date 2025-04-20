import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, ChevronDown, Image, Link, Hash, Layout, Search, Sparkles, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Groq API configuration
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Blog templates for different categories
const blogTemplates = {
  'Game Reviews': {
    structure: [
      'Introduction',
      'Game Overview',
      'Graphics & Sound',
      'Gameplay Mechanics',
      'Story & Characters',
      'Multiplayer Experience',
      'Pros & Cons',
      'Final Verdict'
    ],
    description: 'A comprehensive review template for analyzing games'
  },
  'Strategy Guides': {
    structure: [
      'Introduction',
      'Basic Mechanics',
      'Character/Class Overview',
      'Map Knowledge',
      'Advanced Techniques',
      'Common Mistakes to Avoid',
      'Pro Tips',
      'Conclusion'
    ],
    description: 'A detailed guide template for helping players improve'
  },
  'Tournament Updates': {
    structure: [
      'Tournament Overview',
      'Participating Teams',
      'Schedule & Format',
      'Key Matches to Watch',
      'Prize Pool',
      'Predictions',
      'How to Watch',
      'Conclusion'
    ],
    description: 'A template for covering esports tournaments'
  },
  'Gaming News': {
    structure: [
      'News Summary',
      'Background Information',
      'Key Details',
      'Impact on the Industry',
      'Community Reaction',
      'Future Implications',
      'Related News',
      'Conclusion'
    ],
    description: 'A template for reporting gaming industry news'
  },
  'Esports News': {
    structure: [
      'Event Summary',
      'Team/Player Updates',
      'Meta Changes',
      'Upcoming Events',
      'Industry Developments',
      'Community Highlights',
      'Expert Analysis',
      'Conclusion'
    ],
    description: 'A template for covering esports industry news'
  },
  'Community Spotlight': {
    structure: [
      'Community Overview',
      'Featured Creators',
      'Community Events',
      'Fan Creations',
      'Community Challenges',
      'How to Get Involved',
      'Success Stories',
      'Conclusion'
    ],
    description: 'A template for highlighting gaming communities'
  },
  'Other': {
    structure: [
      'Introduction',
      'Main Topic',
      'Supporting Points',
      'Examples',
      'Analysis',
      'Counterarguments',
      'Conclusion'
    ],
    description: 'A general template for any gaming topic'
  }
};

// Gaming-themed cover images for different categories
const gamingCoverImages = {
  'Game Reviews': [
    {
      url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      label: 'Console Gaming'
    },
    {
      url: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Keyboard'
    },
    {
      url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop',
      label: 'Gaming PC'
    },
    {
      url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057&auto=format&fit=crop',
      label: 'Gaming Room'
    },
    {
      url: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Console'
    },
    {
      url: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Monitor'
    },
    {
      url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Collection'
    },
    {
      url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Accessories'
    },
    {
      url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2019&auto=format&fit=crop',
      label: 'Gaming Mouse'
    },
    {
      url: 'https://images.unsplash.com/photo-1603481546239-65e13ff5cce8?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Desk'
    },
    {
      url: 'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?q=80&w=2069&auto=format&fit=crop',
      label: 'RGB Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Laptop'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
      label: 'Code Gaming'
    },
    {
      url: 'https://images.unsplash.com/photo-1592155931584-901ac15763e3?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Desk Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1601863336742-50c539252f95?q=80&w=2067&auto=format&fit=crop',
      label: 'Gaming Atmosphere'
    },
    {
      url: 'https://images.unsplash.com/photo-1594652634010-275456c808d0?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Rig'
    },
    {
      url: 'https://images.unsplash.com/photo-1622957040873-8ea24e293885?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming PC Build'
    },
    {
      url: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=2027&auto=format&fit=crop',
      label: 'Gaming Battle Station'
    },
    {
      url: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=2070&auto=format&fit=crop',
      label: 'Pro Gaming Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Console Review'
    },
    {
      url: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Hardware'
    },
    {
      url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop',
      label: 'Gaming Workstation'
    },
    {
      url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057&auto=format&fit=crop',
      label: 'Gaming Environment'
    },
    {
      url: 'https://images.unsplash.com/photo-1587202372162-e36b20828308?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Laptop Review'
    },
    {
      url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Peripherals'
    },
    {
      url: 'https://images.unsplash.com/photo-1600861194939-adf054b4df4a?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Controller'
    },
    {
      url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Headset'
    },
    {
      url: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Monitor Review'
    }
  ],
  'Strategy Guides': [
    {
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategy Gaming'
    },
    {
      url: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Tactics'
    },
    {
      url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Strategy'
    },
    {
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
      label: 'Gaming Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategy Board'
    },
    {
      url: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Guide'
    },
    {
      url: 'https://images.unsplash.com/photo-1563050860-87d45eaec4c9?q=80&w=2069&auto=format&fit=crop',
      label: 'Strategy Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=2064&auto=format&fit=crop',
      label: 'Gaming Tutorial'
    },
    {
      url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Tips'
    },
    {
      url: 'https://images.unsplash.com/photo-1624953587687-daf255b6b80a?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategy Guide'
    },
    {
      url: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=2072&auto=format&fit=crop',
      label: 'Strategy Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Strategy'
    },
    {
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      label: 'Game Theory'
    },
    {
      url: 'https://images.unsplash.com/photo-1553484771-047a44eee27f?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategic Thinking'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Game Analysis'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Stats'
    },
    {
      url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategy Meeting'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      label: 'Game Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Discussion'
    },
    {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategic Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Strategy'
    },
    {
      url: 'https://images.unsplash.com/photo-1522165078649-823cf4dbaf46?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Tactics'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategy Analysis'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      label: 'Game Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Meeting'
    },
    {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategic Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Discussion'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategy Session'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Collaboration'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      label: 'Strategic Planning'
    }
  ],
  'Tournament Updates': [
    {
      url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Arena'
    },
    {
      url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Stage'
    },
    {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Tournament'
    },
    {
      url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2071&auto=format&fit=crop',
      label: 'Tournament Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1574492557400-77e40e6925a5?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Players'
    },
    {
      url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Crowd'
    },
    {
      url: 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1548686304-89d188a80029?q=80&w=2069&auto=format&fit=crop',
      label: 'Tournament Arena'
    },
    {
      url: 'https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Stage'
    },
    {
      url: 'https://images.unsplash.com/photo-1542396601-dca920ea2807?q=80&w=2069&auto=format&fit=crop',
      label: 'Tournament Venue'
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Stage'
    },
    {
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
      label: 'Crowd Excitement'
    },
    {
      url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop',
      label: 'Stage Performance'
    },
    {
      url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Competition'
    },
    {
      url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Lights'
    },
    {
      url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Match'
    },
    {
      url: 'https://images.unsplash.com/photo-1561489413-985b06da5bee?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Arena'
    },
    {
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
      label: 'Tournament Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop',
      label: 'Stage Design'
    },
    {
      url: 'https://images.unsplash.com/photo-1587855049254-351f4e55fe02?q=80&w=2073&auto=format&fit=crop',
      label: 'Gaming Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
      label: 'Tournament Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2071&auto=format&fit=crop',
      label: 'Tournament Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1574492557400-77e40e6925a5?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Players'
    },
    {
      url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Crowd'
    },
    {
      url: 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1548686304-89d188a80029?q=80&w=2069&auto=format&fit=crop',
      label: 'Tournament Arena'
    },
    {
      url: 'https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Stage'
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Lights'
    },
    {
      url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Excitement'
    },
    {
      url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament Performance'
    }
  ],
  'Gaming News': [
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming News'
    },
    {
      url: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Updates'
    },
    {
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Industry'
    },
    {
      url: 'https://images.unsplash.com/photo-1519326844852-704caea5679e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Tech'
    },
    {
      url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Release'
    },
    {
      url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057&auto=format&fit=crop',
      label: 'Gaming Setup News'
    },
    {
      url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop',
      label: 'Gaming Hardware'
    },
    {
      url: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=2069&auto=format&fit=crop',
      label: 'Console News'
    },
    {
      url: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Display'
    },
    {
      url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Gear'
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tech News'
    },
    {
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      label: 'Industry News'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Code'
    },
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Update'
    },
    {
      url: 'https://images.unsplash.com/photo-1587855049254-351f4e55fe02?q=80&w=2073&auto=format&fit=crop',
      label: 'Gaming Development'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Industry Meeting'
    },
    {
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      label: 'Gaming Innovation'
    },
    {
      url: 'https://images.unsplash.com/photo-1553484771-047a44eee27f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Future'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Industry Analysis'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Trends'
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tech Update'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Development'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Industry News'
    },
    {
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      label: 'Gaming Innovation'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Analysis'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Stats'
    },
    {
      url: 'https://images.unsplash.com/photo-1553484771-047a44eee27f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Research'
    },
    {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Updates'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      label: 'Industry Meeting'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Conference'
    }
  ],
  'Esports News': [
    {
      url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Competition'
    },
    {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Teams'
    },
    {
      url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2071&auto=format&fit=crop',
      label: 'Esports Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1574492557400-77e40e6925a5?q=80&w=2070&auto=format&fit=crop',
      label: 'Pro Players'
    },
    {
      url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Crowd'
    },
    {
      url: 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament News'
    },
    {
      url: 'https://images.unsplash.com/photo-1548686304-89d188a80029?q=80&w=2069&auto=format&fit=crop',
      label: 'Esports Arena'
    },
    {
      url: 'https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=2070&auto=format&fit=crop',
      label: 'Stage Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
      label: 'Event Stage'
    },
    {
      url: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Competition'
    },
    {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Teams'
    },
    {
      url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2071&auto=format&fit=crop',
      label: 'Esports Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1574492557400-77e40e6925a5?q=80&w=2070&auto=format&fit=crop',
      label: 'Pro Players'
    },
    {
      url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop',
      label: 'Esports Crowd'
    },
    {
      url: 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tournament News'
    },
    {
      url: 'https://images.unsplash.com/photo-1548686304-89d188a80029?q=80&w=2069&auto=format&fit=crop',
      label: 'Esports Arena'
    },
    {
      url: 'https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=2070&auto=format&fit=crop',
      label: 'Stage Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
      label: 'Event Stage'
    }
  ],
  'Community Spotlight': [
    {
      url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Community'
    },
    {
      url: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Gathering'
    },
    {
      url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Collection'
    },
    {
      url: 'https://images.unsplash.com/photo-1519326844852-704caea5679e?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Meet'
    },
    {
      url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Crowd'
    },
    {
      url: 'https://images.unsplash.com/photo-1527334919515-b8dee906a34b?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1548686304-89d188a80029?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Venue'
    },
    {
      url: 'https://images.unsplash.com/photo-1561489396-888724a1543d?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Stage'
    },
    {
      url: 'https://images.unsplash.com/photo-1542396601-dca920ea2807?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Space'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Meeting'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Group'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Collaboration'
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Team'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop',
      label: 'Gaming Friends'
    },
    {
      url: 'https://images.unsplash.com/photo-1522165078649-823cf4dbaf46?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Support'
    },
    {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Discussion'
    },
    {
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop',
      label: 'Community Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Meetup'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Meeting'
    },
    {
      url: 'https://images.unsplash.com/photo-1522165078649-823cf4dbaf46?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Community'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Team Event'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Discussion'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop',
      label: 'Gaming Friends'
    },
    {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Gathering'
    },
    {
      url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Meetup'
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
      label: 'Community Team'
    },
    {
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2049&auto=format&fit=crop',
      label: 'Gaming Group'
    }
  ],
  'Other': [
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming General'
    },
    {
      url: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Setup'
    },
    {
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Misc'
    },
    {
      url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2071&auto=format&fit=crop',
      label: 'Gaming Station'
    },
    {
      url: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=2057&auto=format&fit=crop',
      label: 'Gaming Corner'
    },
    {
      url: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Device'
    },
    {
      url: 'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?q=80&w=2069&auto=format&fit=crop',
      label: 'Gaming Screen'
    },
    {
      url: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Equipment'
    },
    {
      url: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=2019&auto=format&fit=crop',
      label: 'Gaming Peripheral'
    },
    {
      url: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Collection'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Research'
    },
    {
      url: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?q=80&w=2064&auto=format&fit=crop',
      label: 'Gaming Features'
    },
    {
      url: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Analysis'
    },
    {
      url: 'https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Development'
    },
    {
      url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Innovation'
    },
    {
      url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Technology'
    },
    {
      url: 'https://images.unsplash.com/photo-1580327344181-c1163234e5a0?q=80&w=2067&auto=format&fit=crop',
      label: 'Gaming Study'
    },
    {
      url: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Methods'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Research Lab'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Studies'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Development'
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tech Innovation'
    },
    {
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      label: 'Gaming Research'
    },
    {
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Future'
    },
    {
      url: 'https://images.unsplash.com/photo-1587855049254-351f4e55fe02?q=80&w=2073&auto=format&fit=crop',
      label: 'Gaming Industry'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Analysis'
    },
    {
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      label: 'Gaming Technology'
    },
    {
      url: 'https://images.unsplash.com/photo-1553484771-047a44eee27f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Study'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Methods'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Research Lab'
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Industry Research'
    },
    {
      url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop',
      label: 'Gaming Analysis'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Study'
    },
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Research'
    },
    {
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Industry'
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
      label: 'Tech Research'
    },
    {
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Development'
    },
    {
      url: 'https://images.unsplash.com/photo-1553484771-047a44eee27f?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Analytics'
    },
    {
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Research Lab'
    },
    {
      url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      label: 'Gaming Study Group'
    }
  ]
};

// Update the defaultCoverImages to use the first image from each category
const defaultCoverImages = Object.fromEntries(
  Object.entries(gamingCoverImages).map(([category, images]) => [category, images[0].url])
);

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (blogData: {
    title: string;
    content: string;
    summary: string;
    category: string;
    tags: string[];
    coverImage: string;
    status: 'draft' | 'published';
    seoKeywords?: string[];
    structure?: string[];
  }) => void;
}

type ContentLength = 'short' | 'medium' | 'long';
type ContentStyle = 'informative' | 'entertaining' | 'analytical' | 'tutorial';

const contentLengthConfig = {
  short: { words: "300-500", label: "Short" },
  medium: { words: "800-1000", label: "Medium" },
  long: { words: "1500-2000", label: "Long" }
};

const contentStyleConfig = {
  informative: { label: "Informative", description: "Factual and educational content" },
  entertaining: { label: "Entertaining", description: "Engaging and fun to read" },
  analytical: { label: "Analytical", description: "Deep analysis and insights" },
  tutorial: { label: "Tutorial", description: "Step-by-step instructions" }
};

// Add this new constant for template button styles
const templateButtonStyle = {
  default: "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
  active: "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
};

// Add these style constants at the top
const suggestionPanelStyle = {
  wrapper: "bg-gradient-to-b from-gray-800/5 to-indigo-900/10 backdrop-blur-[2px] rounded-xl p-1 shadow-lg dark:shadow-indigo-500/10",
  inner: "bg-white/90 dark:bg-gray-800/90 rounded-lg p-4 border border-gray-200/50 dark:border-gray-700/50",
  header: "flex items-center justify-between mb-3",
  title: "flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white",
  content: "text-sm text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none",
  button: "inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:hover:bg-indigo-500 transition-colors transform hover:-translate-y-0.5 duration-200"
};

const CreateBlogModal: React.FC<CreateBlogModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: '',
    tags: [] as string[],
    coverImage: '',
    status: 'draft' as 'draft' | 'published',
    seoKeywords: [] as string[],
    structure: [] as string[]
  });

  const [tagInput, setTagInput] = useState('');
  const [seoKeywordInput, setSeoKeywordInput] = useState('');
  const [suggestions, setSuggestions] = useState({
    title: '',
    summary: '',
    content: '',
    seoKeywords: [] as string[],
    coverImage: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentLength, setContentLength] = useState<ContentLength>('medium');
  const [contentStyle, setContentStyle] = useState<ContentStyle>('informative');
  const [showLengthDropdown, setShowLengthDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content');
  const [showImageDropdown, setShowImageDropdown] = useState(false);
  
  // Refs for debouncing
  const titleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const summaryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    'Gaming News',
    'Tournament Updates',
    'Game Reviews',
    'Strategy Guides',
    'Esports News',
    'Community Spotlight',
    'Other'
  ];

  const generateSuggestions = async (category: string, length: ContentLength = contentLength, style: ContentStyle = contentStyle) => {
    if (!category || category === 'Other') return;
    
    setIsGenerating(true);
    try {
      const prompt = `You are an expert gaming content writer. Based on the category "${category}", generate creative and professional suggestions for a blog post title, summary, content, and SEO keywords. The title should be catchy and appealing to gamers. For the content, generate a ${length} version (${contentLengthConfig[length].words} words) in a ${style} style (${contentStyleConfig[style].description}) that is informative, engaging, and well-structured.

Current title: ${formData.title || 'None'}
Current summary: ${formData.summary || 'None'}
Current content: ${formData.content || 'None'}

Please provide suggestions in the following format:
Title: [Your title suggestion]
Summary: [Your summary suggestion - 2-3 sentences]
Content: [Your ${length} content suggestion]
SEO Keywords: [5-7 relevant gaming keywords separated by commas]

Make the suggestions different from the current title/summary/content if they exist.`;

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an AI assistant that helps create engaging gaming blog content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama-3.3-70b-versatile',
          temperature: 0.5,
          max_tokens: 1024,
          top_p: 1,
          stream: false
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to generate suggestions:', errorText);
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      // Parse the response to extract title, summary, content, and SEO keywords
      const titleMatch = content.match(/Title: (.*?)(?:\n|$)/);
      const summaryMatch = content.match(/Summary: (.*?)(?:\n|$)/);
      const contentMatch = content.match(/Content: ([\s\S]*?)(?:\nSEO Keywords:|$)/);
      const seoKeywordsMatch = content.match(/SEO Keywords: (.*?)(?:\n\n|$)/);

      const titleSuggestion = titleMatch ? titleMatch[1].trim() : '';
      const summarySuggestion = summaryMatch ? summaryMatch[1].trim() : '';
      const contentSuggestion = contentMatch ? contentMatch[1].trim() : '';
      const seoKeywordsSuggestion = seoKeywordsMatch 
        ? seoKeywordsMatch[1].split(',').map(keyword => keyword.trim()) 
        : [];

      if (titleSuggestion || summarySuggestion || contentSuggestion || seoKeywordsSuggestion.length > 0) {
        setSuggestions({
          title: titleSuggestion || '',
          summary: summarySuggestion || '',
          content: contentSuggestion || '',
          seoKeywords: seoKeywordsSuggestion,
          coverImage: defaultCoverImages[category as keyof typeof defaultCoverImages] || defaultCoverImages['Other']
        });
      }
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      coverImage: defaultCoverImages[category] || defaultCoverImages['Other'],
      structure: blogTemplates[category as keyof typeof blogTemplates]?.structure || []
    }));
    await generateSuggestions(category);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData({ ...formData, title: newTitle });
    
    // Clear any existing timeout
    if (titleTimeoutRef.current) {
      clearTimeout(titleTimeoutRef.current);
    }
    
    // Only generate suggestions if we have a category selected and some text
    if (formData.category && formData.category !== 'Other' && newTitle.length > 2) {
      // Use a debounced version of generateSuggestions
      titleTimeoutRef.current = setTimeout(() => {
        generateSuggestions(formData.category);
      }, 1000); // Wait for 1 second after typing stops
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSummary = e.target.value;
    setFormData({ ...formData, summary: newSummary });
    
    // Clear any existing timeout
    if (summaryTimeoutRef.current) {
      clearTimeout(summaryTimeoutRef.current);
    }
    
    // Only generate suggestions if we have a category selected and some text
    if (formData.category && formData.category !== 'Other' && newSummary.length > 2) {
      // Use a debounced version of generateSuggestions
      summaryTimeoutRef.current = setTimeout(() => {
        generateSuggestions(formData.category);
      }, 1000); // Wait for 1 second after typing stops
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setFormData({ ...formData, content: newContent });
    
    // Clear any existing timeout
    if (contentTimeoutRef.current) {
      clearTimeout(contentTimeoutRef.current);
    }
    
    // Only generate suggestions if we have a category selected and some text
    if (formData.category && formData.category !== 'Other' && newContent.length > 10) {
      // Use a debounced version of generateSuggestions
      contentTimeoutRef.current = setTimeout(() => {
        generateSuggestions(formData.category);
      }, 1500); // Wait for 1.5 seconds after typing stops for content (longer text)
    }
  };

  const applySuggestion = (field: 'title' | 'summary' | 'content' | 'seoKeywords' | 'coverImage') => {
    if (field === 'seoKeywords') {
      setFormData({
        ...formData,
        seoKeywords: suggestions.seoKeywords
      });
    } else if (field === 'coverImage') {
      setFormData({
        ...formData,
        coverImage: suggestions.coverImage
      });
    } else {
      setFormData({
        ...formData,
        [field]: suggestions[field]
      });
    }
  };

  const handleLengthChange = (length: ContentLength) => {
    setContentLength(length);
    setShowLengthDropdown(false);
    if (formData.category) {
      generateSuggestions(formData.category, length, contentStyle);
    }
  };

  const handleStyleChange = (style: ContentStyle) => {
    setContentStyle(style);
    setShowStyleDropdown(false);
    if (formData.category) {
      generateSuggestions(formData.category, contentLength, style);
    }
  };

  const handleTagAdd = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput]
      });
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSeoKeywordAdd = () => {
    if (seoKeywordInput && !formData.seoKeywords.includes(seoKeywordInput)) {
      setFormData({
        ...formData,
        seoKeywords: [...formData.seoKeywords, seoKeywordInput]
      });
      setSeoKeywordInput('');
    }
  };

  const handleSeoKeywordRemove = (keywordToRemove: string) => {
    setFormData({
      ...formData,
      seoKeywords: formData.seoKeywords.filter(keyword => keyword !== keywordToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const applyTemplate = () => {
    if (formData.category && blogTemplates[formData.category as keyof typeof blogTemplates]) {
      const template = blogTemplates[formData.category as keyof typeof blogTemplates];
      setFormData({
        ...formData,
        structure: template.structure
      });
      setShowTemplateModal(false);
      toast.success('Template applied successfully!');
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
    setShowImageDropdown(false);
  };

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);
      if (summaryTimeoutRef.current) clearTimeout(summaryTimeoutRef.current);
      if (contentTimeoutRef.current) clearTimeout(contentTimeoutRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-6">
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-1 w-full max-w-5xl my-4 shadow-2xl transform transition-all duration-300 min-h-[85vh]">
        <div className="bg-white dark:bg-gray-800 rounded-xl w-full h-full flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Layout className="h-6 w-6 text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Blog Post</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex items-center justify-between">
              <nav className="flex space-x-4" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`py-2 px-3 rounded-lg transition-colors ${
                    activeTab === 'content'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Layout className="h-4 w-4" />
                    <span>Content</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('seo')}
                  className={`py-2 px-3 rounded-lg transition-colors ${
                    activeTab === 'seo'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4" />
                    <span>SEO</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('media')}
                  className={`py-2 px-3 rounded-lg transition-colors ${
                    activeTab === 'media'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Image className="h-4 w-4" />
                    <span>Media</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <form id="blog-form" onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="flex-1 overflow-y-auto bg-gray-900">
              <div className="p-6 space-y-8">
                {activeTab === 'content' && (
                  <>
                    {/* Category Selection */}
                    <div className="bg-gray-800/50 rounded-xl p-6">
                      <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-400 transition-colors"
                        required
                      >
                        <option value="" className="bg-gray-800">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category} className="bg-gray-800 text-white">{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Title Section */}
                    <div className="space-y-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                        Blog Title
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="title"
                          value={formData.title}
                          onChange={handleTitleChange}
                          className="block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                          placeholder="Enter blog title"
                        />
                      </div>
                      {suggestions.title && !isGenerating && (
                        <div className={suggestionPanelStyle.wrapper}>
                          <div className={suggestionPanelStyle.inner}>
                            <div className={suggestionPanelStyle.header}>
                              <div className={suggestionPanelStyle.title}>
                                <span>Suggested Title</span>
                                <button
                                  type="button"
                                  onClick={() => generateSuggestions(formData.category)}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  title="Generate new suggestion"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => applySuggestion('title')}
                                className={suggestionPanelStyle.button}
                              >
                                Use This
                              </button>
                            </div>
                            <div className={suggestionPanelStyle.content}>
                              {suggestions.title}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Summary Section */}
                    <div className="space-y-4">
                      <label htmlFor="summary" className="block text-sm font-medium text-gray-300">
                        Summary
                      </label>
                      <div className="relative">
                        <textarea
                          id="summary"
                          value={formData.summary}
                          onChange={handleSummaryChange}
                          rows={3}
                          className="block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                          placeholder="Enter blog summary"
                        />
                      </div>
                      {suggestions.summary && !isGenerating && (
                        <div className={suggestionPanelStyle.wrapper}>
                          <div className={suggestionPanelStyle.inner}>
                            <div className={suggestionPanelStyle.header}>
                              <div className={suggestionPanelStyle.title}>
                                <span>Suggested Summary</span>
                                <button
                                  type="button"
                                  onClick={() => generateSuggestions(formData.category)}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  title="Generate new suggestion"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => applySuggestion('summary')}
                                className={suggestionPanelStyle.button}
                              >
                                Use This
                              </button>
                            </div>
                            <div className={suggestionPanelStyle.content}>
                              {suggestions.summary}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label htmlFor="content" className="block text-sm font-medium text-white">
                          Content
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowLengthDropdown(!showLengthDropdown)}
                              className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-gray-800 border-2 border-gray-600 text-white hover:border-indigo-400 transition-colors"
                            >
                              {contentLengthConfig[contentLength].label}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                            {showLengthDropdown && (
                              <div className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  {Object.entries(contentLengthConfig).map(([key, value]) => (
                                    <button
                                      key={key}
                                      type="button"
                                      onClick={() => handleLengthChange(key as ContentLength)}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                      role="menuitem"
                                    >
                                      {value.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                              className="inline-flex items-center px-3 py-2 rounded-lg text-sm bg-gray-800 border-2 border-gray-600 text-white hover:border-indigo-400 transition-colors"
                            >
                              {contentStyleConfig[contentStyle].label}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                            {showStyleDropdown && (
                              <div className="absolute right-0 mt-1 w-40 rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1" role="menu" aria-orientation="vertical">
                                  {Object.entries(contentStyleConfig).map(([key, value]) => (
                                    <button
                                      key={key}
                                      type="button"
                                      onClick={() => handleStyleChange(key as ContentStyle)}
                                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                                      role="menuitem"
                                    >
                                      {value.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowTemplateModal(true)}
                            className={templateButtonStyle.default}
                          >
                            <Layout className="h-4 w-4" />
                            <span>Template</span>
                          </button>
                        </div>
                      </div>
                      <div className="relative">
                        <textarea
                          id="content"
                          value={formData.content}
                          onChange={handleContentChange}
                          rows={12}
                          className="block w-full rounded-lg border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          required
                          placeholder="Enter blog content"
                        />
                      </div>
                      {suggestions.content && !isGenerating && (
                        <div className={suggestionPanelStyle.wrapper}>
                          <div className={suggestionPanelStyle.inner}>
                            <div className={suggestionPanelStyle.header}>
                              <div className={suggestionPanelStyle.title}>
                                <span>Suggested Content</span>
                                <button
                                  type="button"
                                  onClick={() => generateSuggestions(formData.category)}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  title="Generate new suggestion"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => applySuggestion('content')}
                                className={suggestionPanelStyle.button}
                              >
                                Use This
                              </button>
                            </div>
                            <div className={suggestionPanelStyle.content}>
                              {suggestions.content}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Structure Display */}
                    {formData.structure && formData.structure.length > 0 && (
                      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-xl p-6">
                        <h3 className="text-sm font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-4">Content Structure</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.structure.map((section, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-4 rounded-lg bg-white dark:bg-gray-700/50 shadow-sm"
                            >
                              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                                {index + 1}
                              </span>
                              <span className="text-sm text-gray-700 dark:text-gray-300">{section}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        SEO Keywords
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.seoKeywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => handleSeoKeywordRemove(keyword)}
                              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-indigo-200 text-indigo-500 hover:bg-indigo-300 dark:bg-indigo-800 dark:text-indigo-100 dark:hover:bg-indigo-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex">
                        <input
                          type="text"
                          value={seoKeywordInput}
                          onChange={(e) => setSeoKeywordInput(e.target.value)}
                          placeholder="Add a keyword"
                          className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleSeoKeywordAdd}
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 dark:bg-gray-600 dark:border-gray-600 dark:text-white dark:hover:bg-gray-500"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {suggestions.seoKeywords && suggestions.seoKeywords.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 relative">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Suggested Keywords:
                                </p>
                                <button
                                  type="button"
                                  onClick={() => generateSuggestions(formData.category)}
                                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                  title="Generate new suggestion"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {suggestions.seoKeywords.map((keyword, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => applySuggestion('seoKeywords')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:hover:bg-indigo-500 transition-colors"
                          >
                            Use All
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cover Image
                      </label>
                      <div className="flex flex-col space-y-2">
                        {formData.coverImage && (
                          <div className="relative group">
                            <img
                              src={formData.coverImage}
                              alt="Cover"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <button
                                onClick={() => setShowImageDropdown(!showImageDropdown)}
                                className="px-4 py-2 bg-white text-gray-900 rounded-md shadow-sm hover:bg-gray-100 transition-colors"
                              >
                                Change Image
                              </button>
                            </div>
                          </div>
                        )}
                        {showImageDropdown && (
                          <div className="fixed inset-0 flex items-center justify-center z-[70]">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowImageDropdown(false)} />
                            <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-4xl p-1 mx-4 shadow-2xl">
                              <div className="bg-gray-800 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-semibold text-white">Select Cover Image</h3>
                                  <button
                                    onClick={() => setShowImageDropdown(false)}
                                    className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                                    title="Close image selection"
                                  >
                                    <X className="w-5 h-5 text-white" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
                                  {gamingCoverImages[formData.category || 'Other'].map((image, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleImageSelect(image.url)}
                                      className="relative group rounded-lg overflow-hidden aspect-video"
                                    >
                                      <img
                                        src={image.url}
                                        alt={image.label}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-lg">
                                          {image.label}
                                        </span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowImageDropdown(!showImageDropdown)}
                          className="flex items-center space-x-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          <Image className="w-4 h-4" />
                          <span>Select Cover Image</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                    className="rounded-lg border-2 border-gray-600 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 hover:border-indigo-400 transition-colors"
                    required
                    aria-label="Post status"
                  >
                    <option value="draft" className="bg-gray-800">Draft</option>
                    <option value="published" className="bg-gray-800">Published</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Create Blog Post
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTemplateModal(false)} />
          <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-2xl p-1 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full h-full overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layout className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Template</h3>
                  </div>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Close template modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {formData.category && blogTemplates[formData.category as keyof typeof blogTemplates] ? (
                  <>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-2">
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {blogTemplates[formData.category as keyof typeof blogTemplates].description}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-lg p-6">
                      <h4 className="text-sm font-medium text-indigo-500 dark:text-indigo-400 uppercase tracking-wide mb-4">
                        Content Structure
                      </h4>
                      <div className="space-y-4">
                        {blogTemplates[formData.category as keyof typeof blogTemplates].structure.map((section, index) => (
                          <div 
                            key={index}
                            className="flex items-start space-x-3 p-3 rounded-lg bg-white dark:bg-gray-700/50 shadow-sm"
                          >
                            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{section}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Layout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please select a category first to see available templates.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {formData.category && blogTemplates[formData.category as keyof typeof blogTemplates] && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={applyTemplate}
                      className={templateButtonStyle.default}
                    >
                      <span>Apply Template</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlogModal; 