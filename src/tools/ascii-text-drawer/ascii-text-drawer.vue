<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import figlet from 'figlet'
import { Copy, FileText } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useCopy } from '@/composable/copy'
import { useToolI18n } from '@/composable/useToolI18n'

const input = ref('Ascii ART');
const font = useStorage<string>('ascii-text-drawer:font', 'Standard');
const width = useStorage('ascii-text-drawer:width', 80);
const { t } = useToolI18n();
const output = ref('');
const errored = ref(false);
const processing = ref(false);

figlet.defaults({ fontPath: '/fonts/figlet' });

watchEffect(async () => {
  processing.value = true;
  try {
    const options = {
      font: font.value,
      width: width.value,
      whitespaceBreak: true,
    };
    output.value = await new Promise<string>((resolve, reject) =>
      figlet.text(input.value, options, (err, text) => {
        if (err) {
          reject(err);
          return
        }
        resolve(text ?? '');
      }),
    );
    errored.value = false;
  }
  catch {
    errored.value = true;
  }
  processing.value = false;
})

const { copy: copyOutput } = useCopy({ source: output });

const fonts = ['1Row', '3-D', '3D Diagonal', '3D-ASCII', '3x5', '4Max', '5 Line Oblique', 'AMC 3 Line', 'AMC 3 Liv1', 'AMC AAA01', 'AMC Neko', 'AMC Razor', 'AMC Razor2', 'AMC Slash', 'AMC Slider', 'AMC Thin', 'AMC Tubes', 'AMC Untitled', 'ANSI Shadow', 'ASCII New Roman', 'Acrobatic', 'Alligator', 'Alligator2', 'Alpha', 'Alphabet', 'Arrows', 'Avatar', 'B1FF', 'B1FF', 'Banner', 'Banner3-D', 'Banner3', 'Banner4', 'Barbwire', 'Basic', 'Bear', 'Bell', 'Benjamin', 'Big Chief', 'Big Money-ne', 'Big Money-nw', 'Big Money-se', 'Big Money-sw', 'Big', 'Bigfig', 'Binary', 'Block', 'Blocks', 'Bloody', 'Bolger', 'Braced', 'Bright', 'Broadway KB', 'Broadway', 'Bubble', 'Bulbhead', 'Caligraphy', 'Caligraphy2', 'Calvin S', 'Cards', 'Catwalk', 'Chiseled', 'Chunky', 'Coinstak', 'Cola', 'Colossal', 'Computer', 'Contessa', 'Contrast', 'Cosmike', 'Crawford', 'Crawford2', 'Crazy', 'Cricket', 'Cursive', 'Cyberlarge', 'Cybermedium', 'Cybersmall', 'Cygnet', 'DANC4', 'DOS Rebel', 'DWhistled', 'Dancing Font', 'Decimal', 'Def Leppard', 'Delta Corps Priest 1', 'Diamond', 'Diet Cola', 'Digital', 'Doh', 'Doom', 'Dot Matrix', 'Double Shorts', 'Double', 'Dr Pepper', 'Efti Chess', 'Efti Font', 'Efti Italic', 'Efti Piti', 'Efti Robot', 'Efti Wall', 'Efti Water', 'Electronic', 'Elite', 'Epic', 'Fender', 'Filter', 'Fire Font-k', 'Fire Font-s', 'Flipped', 'Flower Power', 'Four Tops', 'Fraktur', 'Fun Face', 'Fun Faces', 'Fuzzy', 'Georgi16', 'Georgia11', 'Ghost', 'Ghoulish', 'Glenyn', 'Goofy', 'Gothic', 'Graceful', 'Gradient', 'Graffiti', 'Greek', 'Heart Left', 'Heart Right', 'Henry 3D', 'Hex', 'Hieroglyphs', 'Hollywood', 'Horizontal Left', 'Horizontal Right', 'ICL-1900', 'Impossible', 'Invita', 'Isometric1', 'Isometric2', 'Isometric3', 'Isometric4', 'Italic', 'Ivrit', 'JS Block Letters', 'JS Bracket Letters', 'JS Capital Curves', 'JS Cursive', 'JS Stick Letters', 'Jacky', 'Jazmine', 'Jerusalem', 'Katakana', 'Kban', 'Keyboard', 'Knob', 'Konto Slant', 'Konto', 'LCD', 'Larry 3D 2', 'Larry 3D', 'Lean', 'Letters', 'Lil Devil', 'Line Blocks', 'Linux', 'Lockergnome', 'Madrid', 'Marquee', 'Maxfour', 'Merlin1', 'Merlin2', 'Mike', 'Mini', 'Mirror', 'Mnemonic', 'Modular', 'Morse', 'Morse2', 'Moscow', 'Mshebrew210', 'Muzzle', 'NScript', 'NT Greek', 'NV Script', 'Nancyj-Fancy', 'Nancyj-Improved', 'Nancyj-Underlined', 'Nancyj', 'Nipples', 'O8', 'OS2', 'Octal', 'Ogre', 'Old Banner', 'Patorjk\'s Cheese', 'Patorjk-HeX', 'Pawp', 'Peaks Slant', 'Peaks', 'Pebbles', 'Pepper', 'Poison', 'Puffy', 'Puzzle', 'Pyramid', 'Rammstein', 'Rectangles', 'Red Phoenix', 'Relief', 'Relief2', 'Reverse', 'Roman', 'Rot13', 'Rot13', 'Rotated', 'Rounded', 'Rowan Cap', 'Rozzo', 'Runic', 'Runyc', 'S Blood', 'SL Script', 'Santa Clara', 'Script', 'Serifcap', 'Shadow', 'Shimrod', 'Short', 'Slant Relief', 'Slant', 'Slide', 'Small Caps', 'Small Isometric1', 'Small Keyboard', 'Small Poison', 'Small Script', 'Small Shadow', 'Small Slant', 'Small Tengwar', 'Small', 'Soft', 'Speed', 'Spliff', 'Stacey', 'Stampate', 'Stampatello', 'Standard', 'Star Strips', 'Star Wars', 'Stellar', 'Stforek', 'Stick Letters', 'Stop', 'Straight', 'Stronger Than All', 'Sub-Zero', 'Swamp Land', 'Swan', 'Sweet', 'THIS', 'Tanja', 'Tengwar', 'Term', 'Test1', 'The Edge', 'Thick', 'Thin', 'Thorned', 'Three Point', 'Ticks Slant', 'Ticks', 'Tiles', 'Tinker-Toy', 'Tombstone', 'Train', 'Trek', 'Tsalagi', 'Tubular', 'Twisted', 'Two Point', 'USA Flag', 'Univers', 'Varsity', 'Wavy', 'Weird', 'Wet Letter', 'Whimsy', 'Wow'];
</script>

<template>
  <div class="grid w-full max-w-4xl grid-cols-1 gap-4 lg:grid-cols-2">
    <!-- Options Card -->
    <Card>
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <FileText class="h-5 w-5 text-primary" />
            {{ t('tools.ascii-text-drawer.cardOptionsTitle') }}
          </CardTitle>
          <CardDescription>{{ t('tools.ascii-text-drawer.cardOptionsDescription') }}</CardDescription>
        </div>
      </CardHeader>

      <CardContent class="space-y-6 pt-2">
        <FieldGroup>
          <Field>
            <FieldLabel for="ascii-input">
              {{ t('tools.ascii-text-drawer.yourText') }}
            </FieldLabel>
            <FieldContent>
              <Textarea
                id="ascii-input"
                v-model="input"
                :placeholder="t('tools.ascii-text-drawer.yourTextToDraw')"
                rows="4"
                class="min-h-28"
              />
            </FieldContent>
          </Field>

          <Separator />

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>{{ t('tools.ascii-text-drawer.font') }}</FieldLabel>
              <FieldContent>
                <Select
                  :model-value="font"
                  @update:model-value="value => {
                    if (typeof value === 'string') font = value;
                  }"
                >
                  <SelectTrigger>
                    <SelectValue :placeholder="t('tools.ascii-text-drawer.selectFont')" />
                  </SelectTrigger>
                  <SelectContent class="max-h-72">
                    <SelectGroup>
                      <SelectItem
                        v-for="f in fonts"
                        :key="f"
                        :value="f"
                      >
                        {{ f }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel for="ascii-width">
                {{ t('tools.ascii-text-drawer.width') }}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="ascii-width"
                  v-model.number="width"
                  type="number"
                  min="0"
                  max="10000"
                  :placeholder="t('tools.ascii-text-drawer.widthPlaceholder')"
                />
              </FieldContent>
            </Field>
          </div>

          <div v-if="processing" class="flex items-center gap-2 text-muted-foreground">
            <Spinner class="h-4 w-4" />
            <span class="text-sm">{{ t('tools.ascii-text-drawer.loadingFont') }}</span>
          </div>

          <Alert v-if="errored" variant="destructive">
            <AlertTitle>{{ t('tools.ascii-text-drawer.error') }}</AlertTitle>
            <AlertDescription>{{ t('tools.ascii-text-drawer.error') }}</AlertDescription>
          </Alert>
        </FieldGroup>
      </CardContent>
    </Card>

    <!-- Results Card -->
    <Card>
      <CardHeader class="pb-4">
        <div class="space-y-1">
          <CardTitle class="flex items-center gap-2">
            <FileText class="h-5 w-5 text-primary" />
            {{ t('tools.ascii-text-drawer.cardResultsTitle') }}
          </CardTitle>
          <CardDescription>{{ t('tools.ascii-text-drawer.cardResultsDescription') }}</CardDescription>
        </div>
      </CardHeader>

      <CardContent class="pt-2">
        <div v-if="!processing && !errored" class="space-y-2">
          <Field>
            <FieldLabel>{{ t('tools.ascii-text-drawer.asciiArtText') }}</FieldLabel>
            <FieldContent>
              <Textarea
                v-model="output"
                readonly
                class="font-mono min-h-48 max-h-120 whitespace-pre overflow-y-auto"
              />
            </FieldContent>
          </Field>

          <div class="flex justify-end">
            <Button variant="secondary" size="sm" class="gap-2" :disabled="!output" @click="copyOutput()">
              <Copy class="h-4 w-4" />
              {{ t('common.copyToClipboard') }}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
