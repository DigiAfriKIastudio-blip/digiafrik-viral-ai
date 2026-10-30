import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  SafeAreaView, ScrollView, View, Text, Pressable, TextInput,
  StyleSheet, StatusBar, Alert
} from "react-native";

const C = {
  bg: "#080D1B", panel: "#111A2D", panel2: "#17233A",
  line: "#263650", text: "#F5F7FF", muted: "#9EABC2",
  blue: "#4F8CFF", cyan: "#38D6D0"
};

const niches = ["Business", "Humour", "Beauté", "Cuisine", "Éducation", "Lifestyle"];
const templates: Record<string, { hook: string; script: string; tags: string[] }> = {
  Business: { hook: "Tu peux commencer avec ton téléphone et un petit budget. Voici comment.", script: "ACCROCHE : pose une question qui touche ton public.\nDÉVELOPPEMENT : explique une méthode en trois étapes avec un exemple concret.\nCONCLUSION : propose une action simple à tester aujourd'hui.", tags: ["#Business", "#Entrepreneuriat", "#Afrique"] },
  Humour: { hook: "Quand tu dis « j'arrive » alors que tu es encore à la maison…", script: "SCÈNE 1 : annonce que tu arrives.\nSCÈNE 2 : montre que tu es encore en train de te préparer.\nCHUTE : ton ami rappelle et tu réponds « je suis presque là ».\nFIN : invite les gens à raconter leur expérience.", tags: ["#Humour", "#PourToi", "#Afrique"] },
  Beauté: { hook: "Trois erreurs qui peuvent gâcher ta routine beauté.", script: "Présente une erreur à la fois. Explique pourquoi elle pose problème et propose une alternative simple. Termine par une question à la communauté.", tags: ["#Beauté", "#Routine", "#Conseils"] },
  Cuisine: { hook: "Un plat délicieux avec peu d'ingrédients : regarde ça.", script: "Montre les ingrédients dès la première seconde. Filme les étapes rapidement, ajoute un gros plan du résultat et demande quelle recette tester ensuite.", tags: ["#Cuisine", "#Recette", "#FoodTok"] },
  Éducation: { hook: "En 30 secondes, tu vas comprendre une idée souvent mal expliquée.", script: "Annonce le sujet en une phrase. Explique une seule idée avec un exemple concret. Résume en une phrase et invite aux questions.", tags: ["#Apprendre", "#Education", "#Astuces"] },
  Lifestyle: { hook: "Une petite habitude qui peut rendre tes journées plus efficaces.", script: "Montre la situation de départ. Présente l'habitude en trois étapes simples. Termine avec un résultat réaliste et un défi de sept jours.", tags: ["#Lifestyle", "#Habitudes", "#Motivation"] }
};

type Draft = { id: string; niche: string; topic: string; hook: string; script: string; tags: string[]; createdAt: string };

export default function HomeScreen() {
  const [tab, setTab] = useState("Accueil");
  const [niche, setNiche] = useState("Business");
  const [topic, setTopic] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loaded, setLoaded] = useState(false);
  const current = templates[niche];
  const hook = topic.trim() ? topic.trim() + " : " + current.hook : current.hook;

  useEffect(() => {
    AsyncStorage.getItem("digiafrik-viral-drafts")
      .then((raw) => { if (raw) setDrafts(JSON.parse(raw)); })
      .catch(() => Alert.alert("Information", "Impossible de charger les brouillons sauvegardés."))
      .finally(() => setLoaded(true));
  }, []);

  const saveDraft = async () => {
    const draft: Draft = {
      id: Date.now().toString(), niche, topic, hook,
      script: current.script, tags: current.tags, createdAt: new Date().toISOString()
    };
    const next = [draft, ...drafts];
    setDrafts(next);
    try {
      await AsyncStorage.setItem("digiafrik-viral-drafts", JSON.stringify(next));
      setTab("Bibliothèque");
    } catch {
      Alert.alert("Erreur", "Le brouillon n'a pas pu être sauvegardé sur cet appareil.");
    }
  };

  const removeDraft = async (id: string) => {
    const next = drafts.filter((d) => d.id !== id);
    setDrafts(next);
    await AsyncStorage.setItem("digiafrik-viral-drafts", JSON.stringify(next));
  };

  const nav = ["Accueil", "Créer", "Bibliothèque", "Stratégie"];
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View>
            <Text style={s.brand}>DigiAfriK <Text style={{ color: C.cyan }}>VIRAL AI</Text></Text>
            <Text style={s.tagline}>Imagine. Crée. Réalise.</Text>
          </View>
          <View style={s.avatar}><Text style={s.avatarText}>DA</Text></View>
        </View>

        <View style={s.hero}>
          <Text style={s.eyebrow}>TON STUDIO DE CRÉATION</Text>
          <Text style={s.heroTitle}>Transforme tes idées en contenus.</Text>
          <Text style={s.heroText}>Prépare tes vidéos courtes, organise tes idées et suis ta progression depuis un seul espace.</Text>
          <Pressable style={s.primary} onPress={() => setTab("Créer")}><Text style={s.primaryText}>＋ Créer un contenu</Text></Pressable>
        </View>

        <View style={s.sectionHead}><Text style={s.sectionTitle}>Vue d'ensemble</Text><Text style={s.smallMuted}>{loaded ? "Sauvegarde locale active" : "Chargement…"}</Text></View>
        <View style={s.stats}>
          <View style={s.stat}><Text style={s.statNum}>{drafts.length}</Text><Text style={s.statLabel}>Brouillons</Text></View>
          <View style={s.stat}><Text style={s.statNum}>7</Text><Text style={s.statLabel}>Jours de défi</Text></View>
          <View style={s.stat}><Text style={s.statNum}>0</Text><Text style={s.statLabel}>Vidéos suivies</Text></View>
        </View>

        {tab === "Créer" && <View style={s.card}>
          <Text style={s.sectionTitle}>Créer une idée vidéo</Text>
          <Text style={s.label}>Choisis ta niche</Text>
          <View style={s.chips}>{niches.map((n) => <Pressable key={n} onPress={() => setNiche(n)} style={[s.chip, niche === n && s.chipActive]}><Text style={[s.chipText, niche === n && s.chipTextActive]}>{n}</Text></Pressable>)}</View>
          <Text style={s.label}>Sujet de ta vidéo (facultatif)</Text>
          <TextInput value={topic} onChangeText={setTopic} placeholder="Ex. vendre en ligne au Sénégal" placeholderTextColor={C.muted} style={s.input} />
          <View style={s.preview}>
            <Text style={s.eyebrow}>ACCROCHE PROPOSÉE</Text><Text style={s.hook}>{hook}</Text>
            <Text style={s.label}>Structure du script</Text><Text style={s.body}>{current.script}</Text>
            <Text style={s.tags}>{current.tags.join("   ")}</Text>
          </View>
          <Pressable style={s.primary} onPress={saveDraft}><Text style={s.primaryText}>Enregistrer le brouillon</Text></Pressable>
          <Text style={s.note}>Suggestions de départ intégrées à l'application. Le moteur IA connecté viendra dans une prochaine version.</Text>
        </View>}

        {tab === "Bibliothèque" && <View style={s.card}>
          <Text style={s.sectionTitle}>Ta bibliothèque</Text>
          {drafts.length === 0 ? <Text style={s.body}>Aucun brouillon pour le moment. Crée une idée pour commencer.</Text> : drafts.map((d) => <View key={d.id} style={s.draft}>
            <Text style={s.eyebrow}>{d.niche.toUpperCase()} · {new Date(d.createdAt).toLocaleDateString("fr-FR")}</Text>
            <Text style={s.hook}>{d.hook}</Text><Text style={s.body}>{d.script}</Text><Text style={s.tags}>{d.tags.join("   ")}</Text>
            <Pressable onPress={() => removeDraft(d.id)}><Text style={s.delete}>Supprimer ce brouillon</Text></Pressable>
          </View>)}
        </View>}

        {tab === "Stratégie" && <View style={s.card}>
          <Text style={s.sectionTitle}>Défi créateur : 7 jours</Text>
          {["Jour 1 — Définir une niche et une audience", "Jour 2 — Étudier cinq vidéos de référence", "Jour 3 — Écrire trois accroches", "Jour 4 — Publier une vidéo courte", "Jour 5 — Tester un autre format", "Jour 6 — Relever les statistiques disponibles", "Jour 7 — Identifier ce qui mérite d'être amélioré"].map((item) => <Text key={item} style={s.checkItem}>○  {item}</Text>)}
          <Text style={s.note}>Les performances dépendent du contenu et de l'audience. Aucun résultat viral n'est garanti.</Text>
        </View>}

        {tab === "Accueil" && <View style={s.card}>
          <Text style={s.sectionTitle}>Ton prochain pas</Text>
          <Text style={s.body}>Choisis une niche, crée une première accroche et prépare un script simple. La régularité et l'analyse de tes résultats feront progresser ta stratégie.</Text>
          <Pressable style={s.secondary} onPress={() => setTab("Stratégie")}><Text style={s.secondaryText}>Voir le défi de 7 jours  →</Text></Pressable>
        </View>}
        <Text style={s.footer}>DigiAfriK VIRAL AI · Version 0.1.0</Text>
      </ScrollView>
      <View style={s.bottom}>{nav.map((item) => <Pressable key={item} onPress={() => setTab(item)} style={s.navItem}>
        <Text style={[s.navText, tab === item && s.navTextActive]}>{item === "Accueil" ? "⌂" : item === "Créer" ? "＋" : item === "Bibliothèque" ? "▤" : "↗"}</Text>
        <Text style={[s.navLabel, tab === item && s.navLabelActive]}>{item}</Text>
      </Pressable>)}</View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  page: { padding: 20, paddingBottom: 28, gap: 18 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  brand: { color: C.text, fontSize: 21, fontWeight: "900", letterSpacing: 0.3 },
  tagline: { color: C.muted, fontSize: 11, marginTop: 3 },
  avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: C.panel2, borderWidth: 1, borderColor: C.line, alignItems: "center", justifyContent: "center" },
  avatarText: { color: C.cyan, fontWeight: "900" },
  hero: { backgroundColor: "#14284A", borderColor: "#2C4C7D", borderWidth: 1, borderRadius: 24, padding: 20, gap: 12 },
  eyebrow: { color: C.cyan, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  heroTitle: { color: C.text, fontSize: 27, lineHeight: 33, fontWeight: "900" },
  heroText: { color: "#D1DDF1", fontSize: 13, lineHeight: 20 },
  primary: { backgroundColor: C.blue, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 14, alignItems: "center", marginTop: 4 },
  primaryText: { color: "white", fontWeight: "800", fontSize: 14 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { color: C.text, fontSize: 18, fontWeight: "800" },
  smallMuted: { color: C.muted, fontSize: 11 },
  stats: { flexDirection: "row", gap: 10 },
  stat: { flex: 1, backgroundColor: C.panel, borderRadius: 16, borderWidth: 1, borderColor: C.line, padding: 14 },
  statNum: { color: C.text, fontSize: 23, fontWeight: "900" },
  statLabel: { color: C.muted, fontSize: 10, marginTop: 4 },
  card: { backgroundColor: C.panel, borderRadius: 20, borderWidth: 1, borderColor: C.line, padding: 17, gap: 14 },
  label: { color: C.muted, fontSize: 12, fontWeight: "700", marginTop: 3 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingVertical: 9, paddingHorizontal: 12, backgroundColor: C.panel2, borderRadius: 30, borderWidth: 1, borderColor: C.line },
  chipActive: { backgroundColor: "#193C62", borderColor: C.blue },
  chipText: { color: C.muted, fontSize: 11, fontWeight: "700" },
  chipTextActive: { color: C.text },
  input: { backgroundColor: C.bg, color: C.text, borderRadius: 12, borderWidth: 1, borderColor: C.line, padding: 13, fontSize: 13 },
  preview: { backgroundColor: C.panel2, borderRadius: 15, padding: 14, gap: 11 },
  hook: { color: C.text, fontSize: 15, fontWeight: "800", lineHeight: 22 },
  body: { color: "#C1CCDE", fontSize: 12, lineHeight: 19 },
  tags: { color: C.cyan, fontSize: 11, fontWeight: "700" },
  note: { color: C.muted, fontSize: 10, lineHeight: 16 },
  draft: { borderTopWidth: 1, borderTopColor: C.line, paddingTop: 13, gap: 8 },
  delete: { color: "#FF8A8A", fontSize: 11, fontWeight: "700", paddingVertical: 7 },
  checkItem: { color: "#DCE5F5", fontSize: 12, lineHeight: 20 },
  secondary: { paddingVertical: 12 },
  secondaryText: { color: C.cyan, fontWeight: "800", fontSize: 12 },
  footer: { color: "#687891", fontSize: 10, textAlign: "center", paddingVertical: 8 },
  bottom: { flexDirection: "row", backgroundColor: "#0D1526", borderTopWidth: 1, borderTopColor: C.line, paddingTop: 9, paddingBottom: 9, justifyContent: "space-around" },
  navItem: { alignItems: "center", gap: 3, minWidth: 65 },
  navText: { color: C.muted, fontSize: 19, fontWeight: "700" },
  navTextActive: { color: C.cyan },
  navLabel: { color: C.muted, fontSize: 9 },
  navLabelActive: { color: C.text, fontWeight: "800" }
});