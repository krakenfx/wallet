
import type { SvgProps } from 'react-native-svg';
import memoize from 'lodash/memoize';

import i1 from 'kraken-wallet-cryptoicons/src/$based.svg';
import i2 from 'kraken-wallet-cryptoicons/src/$degen.svg';
import i3 from 'kraken-wallet-cryptoicons/src/$mfer.svg';
import i4 from 'kraken-wallet-cryptoicons/src/$myro.svg';
import i5 from 'kraken-wallet-cryptoicons/src/$read.svg';
import i6 from 'kraken-wallet-cryptoicons/src/$snow.svg';
import i7 from 'kraken-wallet-cryptoicons/src/$wif.svg';
import i8 from 'kraken-wallet-cryptoicons/src/00.svg';
import i9 from 'kraken-wallet-cryptoicons/src/0xbtc.svg';
import i10 from 'kraken-wallet-cryptoicons/src/1000sats.svg';
import i11 from 'kraken-wallet-cryptoicons/src/10set.svg';
import i12 from 'kraken-wallet-cryptoicons/src/1earth.svg';
import i13 from 'kraken-wallet-cryptoicons/src/1flr.svg';
import i14 from 'kraken-wallet-cryptoicons/src/1inch.svg';
import i15 from 'kraken-wallet-cryptoicons/src/1st.svg';
import i16 from 'kraken-wallet-cryptoicons/src/2crz.svg';
import i17 from 'kraken-wallet-cryptoicons/src/2give.svg';
import i18 from 'kraken-wallet-cryptoicons/src/2key.svg';
import i19 from 'kraken-wallet-cryptoicons/src/aaave.svg';
import i20 from 'kraken-wallet-cryptoicons/src/aave.svg';
import i21 from 'kraken-wallet-cryptoicons/src/abat.svg';
import i22 from 'kraken-wallet-cryptoicons/src/abbc.svg';
import i23 from 'kraken-wallet-cryptoicons/src/abt.svg';
import i24 from 'kraken-wallet-cryptoicons/src/abusd.svg';
import i25 from 'kraken-wallet-cryptoicons/src/ac3.svg';
import i26 from 'kraken-wallet-cryptoicons/src/aca.svg';
import i27 from 'kraken-wallet-cryptoicons/src/acat.svg';
import i28 from 'kraken-wallet-cryptoicons/src/ace.svg';
import i29 from 'kraken-wallet-cryptoicons/src/ach.svg';
import i30 from 'kraken-wallet-cryptoicons/src/acm.svg';
import i31 from 'kraken-wallet-cryptoicons/src/act.svg';
import i32 from 'kraken-wallet-cryptoicons/src/adai.svg';
import i33 from 'kraken-wallet-cryptoicons/src/ada.svg';
import i34 from 'kraken-wallet-cryptoicons/src/adb.svg';
import i35 from 'kraken-wallet-cryptoicons/src/adk.svg';
import i36 from 'kraken-wallet-cryptoicons/src/ads.svg';
import i37 from 'kraken-wallet-cryptoicons/src/adt.svg';
import i38 from 'kraken-wallet-cryptoicons/src/adx.svg';
import i39 from 'kraken-wallet-cryptoicons/src/aenj.svg';
import i40 from 'kraken-wallet-cryptoicons/src/aeon.svg';
import i41 from 'kraken-wallet-cryptoicons/src/aergo.svg';
import i42 from 'kraken-wallet-cryptoicons/src/aero.svg';
import i43 from 'kraken-wallet-cryptoicons/src/ae.svg';
import i44 from 'kraken-wallet-cryptoicons/src/aethreth.svg';
import i45 from 'kraken-wallet-cryptoicons/src/aeth.svg';
import i46 from 'kraken-wallet-cryptoicons/src/aethweth.svg';
import i47 from 'kraken-wallet-cryptoicons/src/ageur.svg';
import i48 from 'kraken-wallet-cryptoicons/src/agi.svg';
import i49 from 'kraken-wallet-cryptoicons/src/agix.svg';
import i50 from 'kraken-wallet-cryptoicons/src/agld.svg';
import i51 from 'kraken-wallet-cryptoicons/src/agrs.svg';
import i52 from 'kraken-wallet-cryptoicons/src/aidoge.svg';
import i53 from 'kraken-wallet-cryptoicons/src/aid.svg';
import i54 from 'kraken-wallet-cryptoicons/src/aion.svg';
import i55 from 'kraken-wallet-cryptoicons/src/aioz.svg';
import i56 from 'kraken-wallet-cryptoicons/src/air.svg';
import i57 from 'kraken-wallet-cryptoicons/src/ai.svg';
import i58 from 'kraken-wallet-cryptoicons/src/ait.svg';
import i59 from 'kraken-wallet-cryptoicons/src/aknc.svg';
import i60 from 'kraken-wallet-cryptoicons/src/akro.svg';
import i61 from 'kraken-wallet-cryptoicons/src/akt.svg';
import i62 from 'kraken-wallet-cryptoicons/src/albt.svg';
import i63 from 'kraken-wallet-cryptoicons/src/alcx.svg';
import i64 from 'kraken-wallet-cryptoicons/src/alend.svg';
import i65 from 'kraken-wallet-cryptoicons/src/aleph.svg';
import i66 from 'kraken-wallet-cryptoicons/src/aleth.svg';
import i67 from 'kraken-wallet-cryptoicons/src/algo.svg';
import i68 from 'kraken-wallet-cryptoicons/src/alice.svg';
import i69 from 'kraken-wallet-cryptoicons/src/alink.svg';
import i70 from 'kraken-wallet-cryptoicons/src/alis.svg';
import i71 from 'kraken-wallet-cryptoicons/src/ali.svg';
import i72 from 'kraken-wallet-cryptoicons/src/alpaca.svg';
import i73 from 'kraken-wallet-cryptoicons/src/alpha.svg';
import i74 from 'kraken-wallet-cryptoicons/src/alpine.svg';
import i75 from 'kraken-wallet-cryptoicons/src/alt.svg';
import i76 from 'kraken-wallet-cryptoicons/src/alusd.svg';
import i77 from 'kraken-wallet-cryptoicons/src/alx.svg';
import i78 from 'kraken-wallet-cryptoicons/src/amana.svg';
import i79 from 'kraken-wallet-cryptoicons/src/amb.svg';
import i80 from 'kraken-wallet-cryptoicons/src/amino.svg';
import i81 from 'kraken-wallet-cryptoicons/src/amkr.svg';
import i82 from 'kraken-wallet-cryptoicons/src/amkt.svg';
import i83 from 'kraken-wallet-cryptoicons/src/amlt.svg';
import i84 from 'kraken-wallet-cryptoicons/src/ampl.svg';
import i85 from 'kraken-wallet-cryptoicons/src/amp.svg';
import i86 from 'kraken-wallet-cryptoicons/src/anc.svg';
import i87 from 'kraken-wallet-cryptoicons/src/anj.svg';
import i88 from 'kraken-wallet-cryptoicons/src/ankr.svg';
import i89 from 'kraken-wallet-cryptoicons/src/ant.svg';
import i90 from 'kraken-wallet-cryptoicons/src/aoa.svg';
import i91 from 'kraken-wallet-cryptoicons/src/apein.svg';
import i92 from 'kraken-wallet-cryptoicons/src/ape.svg';
import i93 from 'kraken-wallet-cryptoicons/src/aph.svg';
import i94 from 'kraken-wallet-cryptoicons/src/api3.svg';
import i95 from 'kraken-wallet-cryptoicons/src/apl.svg';
import i96 from 'kraken-wallet-cryptoicons/src/appc.svg';
import i97 from 'kraken-wallet-cryptoicons/src/apt.svg';
import i98 from 'kraken-wallet-cryptoicons/src/apw.svg';
import i99 from 'kraken-wallet-cryptoicons/src/apx.svg';
import i100 from 'kraken-wallet-cryptoicons/src/apy.svg';
import i101 from 'kraken-wallet-cryptoicons/src/arb.svg';
import i102 from 'kraken-wallet-cryptoicons/src/ardr.svg';
import i103 from 'kraken-wallet-cryptoicons/src/aren.svg';
import i104 from 'kraken-wallet-cryptoicons/src/arep.svg';
import i105 from 'kraken-wallet-cryptoicons/src/arix.svg';
import i106 from 'kraken-wallet-cryptoicons/src/arker.svg';
import i107 from 'kraken-wallet-cryptoicons/src/arkm.svg';
import i108 from 'kraken-wallet-cryptoicons/src/ark.svg';
import i109 from 'kraken-wallet-cryptoicons/src/armor.svg';
import i110 from 'kraken-wallet-cryptoicons/src/arn.svg';
import i111 from 'kraken-wallet-cryptoicons/src/arnx.svg';
import i112 from 'kraken-wallet-cryptoicons/src/aro.svg';
import i113 from 'kraken-wallet-cryptoicons/src/arpa.svg';
import i114 from 'kraken-wallet-cryptoicons/src/arrr.svg';
import i115 from 'kraken-wallet-cryptoicons/src/ar.svg';
import i116 from 'kraken-wallet-cryptoicons/src/arx.svg';
import i117 from 'kraken-wallet-cryptoicons/src/asafe.svg';
import i118 from 'kraken-wallet-cryptoicons/src/asd.svg';
import i119 from 'kraken-wallet-cryptoicons/src/ash.svg';
import i120 from 'kraken-wallet-cryptoicons/src/asm.svg';
import i121 from 'kraken-wallet-cryptoicons/src/asnx.svg';
import i122 from 'kraken-wallet-cryptoicons/src/asr.svg';
import i123 from 'kraken-wallet-cryptoicons/src/asta.svg';
import i124 from 'kraken-wallet-cryptoicons/src/astro.svg';
import i125 from 'kraken-wallet-cryptoicons/src/astr.svg';
import i126 from 'kraken-wallet-cryptoicons/src/ast.svg';
import i127 from 'kraken-wallet-cryptoicons/src/asusd.svg';
import i128 from 'kraken-wallet-cryptoicons/src/atlas.svg';
import i129 from 'kraken-wallet-cryptoicons/src/atmi.svg';
import i130 from 'kraken-wallet-cryptoicons/src/atm.svg';
import i131 from 'kraken-wallet-cryptoicons/src/atom.svg';
import i132 from 'kraken-wallet-cryptoicons/src/atri.svg';
import i133 from 'kraken-wallet-cryptoicons/src/atusd.svg';
import i134 from 'kraken-wallet-cryptoicons/src/auc.svg';
import i135 from 'kraken-wallet-cryptoicons/src/auction.svg';
import i136 from 'kraken-wallet-cryptoicons/src/audio.svg';
import i137 from 'kraken-wallet-cryptoicons/src/aunidaieth.svg';
import i138 from 'kraken-wallet-cryptoicons/src/aunilendeth.svg';
import i139 from 'kraken-wallet-cryptoicons/src/aunilinketh.svg';
import i140 from 'kraken-wallet-cryptoicons/src/aunimkreth.svg';
import i141 from 'kraken-wallet-cryptoicons/src/aunisetheth.svg';
import i142 from 'kraken-wallet-cryptoicons/src/auni.svg';
import i143 from 'kraken-wallet-cryptoicons/src/auniusdceth.svg';
import i144 from 'kraken-wallet-cryptoicons/src/aura.svg';
import i145 from 'kraken-wallet-cryptoicons/src/aurora.svg';
import i146 from 'kraken-wallet-cryptoicons/src/aur.svg';
import i147 from 'kraken-wallet-cryptoicons/src/aury.svg';
import i148 from 'kraken-wallet-cryptoicons/src/ausdc.svg';
import i149 from 'kraken-wallet-cryptoicons/src/ausdt.svg';
import i150 from 'kraken-wallet-cryptoicons/src/auto.svg';
import i151 from 'kraken-wallet-cryptoicons/src/ava.svg';
import i152 from 'kraken-wallet-cryptoicons/src/avax.svg';
import i153 from 'kraken-wallet-cryptoicons/src/avt.svg';
import i154 from 'kraken-wallet-cryptoicons/src/awbtc.svg';
import i155 from 'kraken-wallet-cryptoicons/src/awc.svg';
import i156 from 'kraken-wallet-cryptoicons/src/aweth.svg';
import i157 from 'kraken-wallet-cryptoicons/src/axc.svg';
import i158 from 'kraken-wallet-cryptoicons/src/axel.svg';
import i159 from 'kraken-wallet-cryptoicons/src/axl.svg';
import i160 from 'kraken-wallet-cryptoicons/src/axpr.svg';
import i161 from 'kraken-wallet-cryptoicons/src/axp.svg';
import i162 from 'kraken-wallet-cryptoicons/src/axs.svg';
import i163 from 'kraken-wallet-cryptoicons/src/ayfi.svg';
import i164 from 'kraken-wallet-cryptoicons/src/azero.svg';
import i165 from 'kraken-wallet-cryptoicons/src/azrx.svg';
import i166 from 'kraken-wallet-cryptoicons/src/babydoge.svg';
import i167 from 'kraken-wallet-cryptoicons/src/bac.svg';
import i168 from 'kraken-wallet-cryptoicons/src/badger.svg';
import i169 from 'kraken-wallet-cryptoicons/src/bake.svg';
import i170 from 'kraken-wallet-cryptoicons/src/bal.svg';
import i171 from 'kraken-wallet-cryptoicons/src/bam.svg';
import i172 from 'kraken-wallet-cryptoicons/src/band.svg';
import i173 from 'kraken-wallet-cryptoicons/src/bao.svg';
import i174 from 'kraken-wallet-cryptoicons/src/bar.svg';
import i175 from 'kraken-wallet-cryptoicons/src/basic.svg';
import i176 from 'kraken-wallet-cryptoicons/src/bat.svg';
import i177 from 'kraken-wallet-cryptoicons/src/baxa.svg';
import i178 from 'kraken-wallet-cryptoicons/src/bax.svg';
import i179 from 'kraken-wallet-cryptoicons/src/bay.svg';
import i180 from 'kraken-wallet-cryptoicons/src/bbk.svg';
import i181 from 'kraken-wallet-cryptoicons/src/bbr.svg';
import i182 from 'kraken-wallet-cryptoicons/src/bcc.svg';
import i183 from 'kraken-wallet-cryptoicons/src/bcd.svg';
import i184 from 'kraken-wallet-cryptoicons/src/bchabc.svg';
import i185 from 'kraken-wallet-cryptoicons/src/bcha.svg';
import i186 from 'kraken-wallet-cryptoicons/src/bch.svg';
import i187 from 'kraken-wallet-cryptoicons/src/bchsv.svg';
import i188 from 'kraken-wallet-cryptoicons/src/bcn.svg';
import i189 from 'kraken-wallet-cryptoicons/src/bco.svg';
import i190 from 'kraken-wallet-cryptoicons/src/bcpt.svg';
import i191 from 'kraken-wallet-cryptoicons/src/bcy.svg';
import i192 from 'kraken-wallet-cryptoicons/src/beam.svg';
import i193 from 'kraken-wallet-cryptoicons/src/bela.svg';
import i194 from 'kraken-wallet-cryptoicons/src/bel.svg';
import i195 from 'kraken-wallet-cryptoicons/src/belt.svg';
import i196 from 'kraken-wallet-cryptoicons/src/bepro.svg';
import i197 from 'kraken-wallet-cryptoicons/src/best.svg';
import i198 from 'kraken-wallet-cryptoicons/src/beta.svg';
import i199 from 'kraken-wallet-cryptoicons/src/beth.svg';
import i200 from 'kraken-wallet-cryptoicons/src/bfc.svg';
import i201 from 'kraken-wallet-cryptoicons/src/bf.svg';
import i202 from 'kraken-wallet-cryptoicons/src/bgb.svg';
import i203 from 'kraken-wallet-cryptoicons/src/bico.svg';
import i204 from 'kraken-wallet-cryptoicons/src/bifi.svg';
import i205 from 'kraken-wallet-cryptoicons/src/bit-2.svg';
import i206 from 'kraken-wallet-cryptoicons/src/bitb.svg';
import i207 from 'kraken-wallet-cryptoicons/src/bitcny.svg';
import i208 from 'kraken-wallet-cryptoicons/src/bitcoin.svg';
import i209 from 'kraken-wallet-cryptoicons/src/bits.svg';
import i210 from 'kraken-wallet-cryptoicons/src/bit.svg';
import i211 from 'kraken-wallet-cryptoicons/src/bix.svg';
import i212 from 'kraken-wallet-cryptoicons/src/bkx.svg';
import i213 from 'kraken-wallet-cryptoicons/src/blank.svg';
import i214 from 'kraken-wallet-cryptoicons/src/blast.svg';
import i215 from 'kraken-wallet-cryptoicons/src/bld.svg';
import i216 from 'kraken-wallet-cryptoicons/src/blitz.svg';
import i217 from 'kraken-wallet-cryptoicons/src/blk.svg';
import i218 from 'kraken-wallet-cryptoicons/src/block.svg';
import i219 from 'kraken-wallet-cryptoicons/src/bloc.svg';
import i220 from 'kraken-wallet-cryptoicons/src/blok.svg';
import i221 from 'kraken-wallet-cryptoicons/src/blt.svg';
import i222 from 'kraken-wallet-cryptoicons/src/blue.svg';
import i223 from 'kraken-wallet-cryptoicons/src/blur.svg';
import i224 from 'kraken-wallet-cryptoicons/src/blz.svg';
import i225 from 'kraken-wallet-cryptoicons/src/bmc.svg';
import i226 from 'kraken-wallet-cryptoicons/src/bmda.svg';
import i227 from 'kraken-wallet-cryptoicons/src/bmon.svg';
import i228 from 'kraken-wallet-cryptoicons/src/bmx.svg';
import i229 from 'kraken-wallet-cryptoicons/src/bnana.svg';
import i230 from 'kraken-wallet-cryptoicons/src/bnb.svg';
import i231 from 'kraken-wallet-cryptoicons/src/bnc.svg';
import i232 from 'kraken-wallet-cryptoicons/src/bnk.svg';
import i233 from 'kraken-wallet-cryptoicons/src/bns.svg';
import i234 from 'kraken-wallet-cryptoicons/src/bnt.svg';
import i235 from 'kraken-wallet-cryptoicons/src/bnty.svg';
import i236 from 'kraken-wallet-cryptoicons/src/bnx.svg';
import i237 from 'kraken-wallet-cryptoicons/src/boa.svg';
import i238 from 'kraken-wallet-cryptoicons/src/bobo.svg';
import i239 from 'kraken-wallet-cryptoicons/src/bob.svg';
import i240 from 'kraken-wallet-cryptoicons/src/boden.svg';
import i241 from 'kraken-wallet-cryptoicons/src/bolt.svg';
import i242 from 'kraken-wallet-cryptoicons/src/bome.svg';
import i243 from 'kraken-wallet-cryptoicons/src/bond-2.svg';
import i244 from 'kraken-wallet-cryptoicons/src/bondly.svg';
import i245 from 'kraken-wallet-cryptoicons/src/bond.svg';
import i246 from 'kraken-wallet-cryptoicons/src/bone.svg';
import i247 from 'kraken-wallet-cryptoicons/src/bonk.svg';
import i248 from 'kraken-wallet-cryptoicons/src/boo.svg';
import i249 from 'kraken-wallet-cryptoicons/src/bora.svg';
import i250 from 'kraken-wallet-cryptoicons/src/boson.svg';
import i251 from 'kraken-wallet-cryptoicons/src/bos.svg';
import i252 from 'kraken-wallet-cryptoicons/src/bot.svg';
import i253 from 'kraken-wallet-cryptoicons/src/botto.svg';
import i254 from 'kraken-wallet-cryptoicons/src/botx.svg';
import i255 from 'kraken-wallet-cryptoicons/src/box.svg';
import i256 from 'kraken-wallet-cryptoicons/src/bpt.svg';
import i257 from 'kraken-wallet-cryptoicons/src/bqx.svg';
import i258 from 'kraken-wallet-cryptoicons/src/brd.svg';
import i259 from 'kraken-wallet-cryptoicons/src/brett.svg';
import i260 from 'kraken-wallet-cryptoicons/src/brg.svg';
import i261 from 'kraken-wallet-cryptoicons/src/brise.svg';
import i262 from 'kraken-wallet-cryptoicons/src/briun.svg';
import i263 from 'kraken-wallet-cryptoicons/src/brk.svg';
import i264 from 'kraken-wallet-cryptoicons/src/brx.svg';
import i265 from 'kraken-wallet-cryptoicons/src/brz.svg';
import i266 from 'kraken-wallet-cryptoicons/src/bsd.svg';
import i267 from 'kraken-wallet-cryptoicons/src/bst.svg';
import i268 from 'kraken-wallet-cryptoicons/src/bsv.svg';
import i269 from 'kraken-wallet-cryptoicons/src/bsw.svg';
import i270 from 'kraken-wallet-cryptoicons/src/btcb.svg';
import i271 from 'kraken-wallet-cryptoicons/src/btcd.svg';
import i272 from 'kraken-wallet-cryptoicons/src/btcp.svg';
import i273 from 'kraken-wallet-cryptoicons/src/btcst.svg';
import i274 from 'kraken-wallet-cryptoicons/src/btc++.svg';
import i275 from 'kraken-wallet-cryptoicons/src/btc.svg';
import i276 from 'kraken-wallet-cryptoicons/src/btcz.svg';
import i277 from 'kraken-wallet-cryptoicons/src/btdx.svg';
import i278 from 'kraken-wallet-cryptoicons/src/btg.svg';
import i279 from 'kraken-wallet-cryptoicons/src/btm.svg';
import i280 from 'kraken-wallet-cryptoicons/src/btmx.svg';
import i281 from 'kraken-wallet-cryptoicons/src/bto.svg';
import i282 from 'kraken-wallet-cryptoicons/src/btrst.svg';
import i283 from 'kraken-wallet-cryptoicons/src/btr.svg';
import i284 from 'kraken-wallet-cryptoicons/src/bts.svg';
import i285 from 'kraken-wallet-cryptoicons/src/btt.svg';
import i286 from 'kraken-wallet-cryptoicons/src/btu.svg';
import i287 from 'kraken-wallet-cryptoicons/src/btx.svg';
import i288 from 'kraken-wallet-cryptoicons/src/bunny.svg';
import i289 from 'kraken-wallet-cryptoicons/src/burger.svg';
import i290 from 'kraken-wallet-cryptoicons/src/burp.svg';
import i291 from 'kraken-wallet-cryptoicons/src/burst.svg';
import i292 from 'kraken-wallet-cryptoicons/src/busd.svg';
import i293 from 'kraken-wallet-cryptoicons/src/bu.svg';
import i294 from 'kraken-wallet-cryptoicons/src/bux.svg';
import i295 from 'kraken-wallet-cryptoicons/src/buy.svg';
import i296 from 'kraken-wallet-cryptoicons/src/bwt.svg';
import i297 from 'kraken-wallet-cryptoicons/src/byc.svg';
import i298 from 'kraken-wallet-cryptoicons/src/bznt.svg';
import i299 from 'kraken-wallet-cryptoicons/src/bzrx.svg';
import i300 from 'kraken-wallet-cryptoicons/src/bz.svg';
import i301 from 'kraken-wallet-cryptoicons/src/c20.svg';
import i302 from 'kraken-wallet-cryptoicons/src/c98.svg';
import i303 from 'kraken-wallet-cryptoicons/src/cag.svg';
import i304 from 'kraken-wallet-cryptoicons/src/cake.svg';
import i305 from 'kraken-wallet-cryptoicons/src/canto.svg';
import i306 from 'kraken-wallet-cryptoicons/src/capp.svg';
import i307 from 'kraken-wallet-cryptoicons/src/cap.svg';
import i308 from 'kraken-wallet-cryptoicons/src/card.svg';
import i309 from 'kraken-wallet-cryptoicons/src/carr.svg';
import i310 from 'kraken-wallet-cryptoicons/src/car.svg';
import i311 from 'kraken-wallet-cryptoicons/src/cas.svg';
import i312 from 'kraken-wallet-cryptoicons/src/cbat.svg';
import i313 from 'kraken-wallet-cryptoicons/src/cbc.svg';
import i314 from 'kraken-wallet-cryptoicons/src/cbeth.svg';
import i315 from 'kraken-wallet-cryptoicons/src/cbt.svg';
import i316 from 'kraken-wallet-cryptoicons/src/cccx.svg';
import i317 from 'kraken-wallet-cryptoicons/src/cce.svg';
import i318 from 'kraken-wallet-cryptoicons/src/ccxx.svg';
import i319 from 'kraken-wallet-cryptoicons/src/cdai.svg';
import i320 from 'kraken-wallet-cryptoicons/src/cdt.svg';
import i321 from 'kraken-wallet-cryptoicons/src/celo.svg';
import i322 from 'kraken-wallet-cryptoicons/src/celr.svg';
import i323 from 'kraken-wallet-cryptoicons/src/cel.svg';
import i324 from 'kraken-wallet-cryptoicons/src/cennz.svg';
import i325 from 'kraken-wallet-cryptoicons/src/cere.svg';
import i326 from 'kraken-wallet-cryptoicons/src/ceth.svg';
import i327 from 'kraken-wallet-cryptoicons/src/cet.svg';
import i328 from 'kraken-wallet-cryptoicons/src/cfg.svg';
import i329 from 'kraken-wallet-cryptoicons/src/cfi.svg';
import i330 from 'kraken-wallet-cryptoicons/src/cfx.svg';
import i331 from 'kraken-wallet-cryptoicons/src/cgg.svg';
import i332 from 'kraken-wallet-cryptoicons/src/chain.svg';
import i333 from 'kraken-wallet-cryptoicons/src/chai.svg';
import i334 from 'kraken-wallet-cryptoicons/src/chat.svg';
import i335 from 'kraken-wallet-cryptoicons/src/chcb.svg';
import i336 from 'kraken-wallet-cryptoicons/src/chess.svg';
import i337 from 'kraken-wallet-cryptoicons/src/chi.svg';
import i338 from 'kraken-wallet-cryptoicons/src/chmb.svg';
import i339 from 'kraken-wallet-cryptoicons/src/cho.svg';
import i340 from 'kraken-wallet-cryptoicons/src/chp.svg';
import i341 from 'kraken-wallet-cryptoicons/src/chr.svg';
import i342 from 'kraken-wallet-cryptoicons/src/chsb.svg';
import i343 from 'kraken-wallet-cryptoicons/src/chz.svg';
import i344 from 'kraken-wallet-cryptoicons/src/cirus.svg';
import i345 from 'kraken-wallet-cryptoicons/src/city.svg';
import i346 from 'kraken-wallet-cryptoicons/src/cix100.svg';
import i347 from 'kraken-wallet-cryptoicons/src/ckb.svg';
import i348 from 'kraken-wallet-cryptoicons/src/clam.svg';
import i349 from 'kraken-wallet-cryptoicons/src/clh.svg';
import i350 from 'kraken-wallet-cryptoicons/src/cloak.svg';
import i351 from 'kraken-wallet-cryptoicons/src/clo.svg';
import i352 from 'kraken-wallet-cryptoicons/src/clout.svg';
import i353 from 'kraken-wallet-cryptoicons/src/club.svg';
import i354 from 'kraken-wallet-cryptoicons/src/clv.svg';
import i355 from 'kraken-wallet-cryptoicons/src/cmct.svg';
import i356 from 'kraken-wallet-cryptoicons/src/cmm.svg';
import i357 from 'kraken-wallet-cryptoicons/src/cmt.svg';
import i358 from 'kraken-wallet-cryptoicons/src/cnc.svg';
import i359 from 'kraken-wallet-cryptoicons/src/cnd.svg';
import i360 from 'kraken-wallet-cryptoicons/src/cnx.svg';
import i361 from 'kraken-wallet-cryptoicons/src/cob.svg';
import i362 from 'kraken-wallet-cryptoicons/src/cocn.svg';
import i363 from 'kraken-wallet-cryptoicons/src/cocos.svg';
import i364 from 'kraken-wallet-cryptoicons/src/coc.svg';
import i365 from 'kraken-wallet-cryptoicons/src/cofi.svg';
import i366 from 'kraken-wallet-cryptoicons/src/coinye.svg';
import i367 from 'kraken-wallet-cryptoicons/src/colx.svg';
import i368 from 'kraken-wallet-cryptoicons/src/combo.svg';
import i369 from 'kraken-wallet-cryptoicons/src/comb.svg';
import i370 from 'kraken-wallet-cryptoicons/src/comp.svg';
import i371 from 'kraken-wallet-cryptoicons/src/cone.svg';
import i372 from 'kraken-wallet-cryptoicons/src/coni.svg';
import i373 from 'kraken-wallet-cryptoicons/src/core.svg';
import i374 from 'kraken-wallet-cryptoicons/src/corgiai.svg';
import i375 from 'kraken-wallet-cryptoicons/src/cosm.svg';
import i376 from 'kraken-wallet-cryptoicons/src/cos.svg';
import i377 from 'kraken-wallet-cryptoicons/src/cost.svg';
import i378 from 'kraken-wallet-cryptoicons/src/coti.svg';
import i379 from 'kraken-wallet-cryptoicons/src/coval.svg';
import i380 from 'kraken-wallet-cryptoicons/src/cova.svg';
import i381 from 'kraken-wallet-cryptoicons/src/cover.svg';
import i382 from 'kraken-wallet-cryptoicons/src/cov.svg';
import i383 from 'kraken-wallet-cryptoicons/src/cpc.svg';
import i384 from 'kraken-wallet-cryptoicons/src/cpool.svg';
import i385 from 'kraken-wallet-cryptoicons/src/cpx.svg';
import i386 from 'kraken-wallet-cryptoicons/src/cqt.svg';
import i387 from 'kraken-wallet-cryptoicons/src/cra.svg';
import i388 from 'kraken-wallet-cryptoicons/src/crb.svg';
import i389 from 'kraken-wallet-cryptoicons/src/crd.svg';
import i390 from 'kraken-wallet-cryptoicons/src/cream.svg';
import i391 from 'kraken-wallet-cryptoicons/src/credi.svg';
import i392 from 'kraken-wallet-cryptoicons/src/cred.svg';
import i393 from 'kraken-wallet-cryptoicons/src/crep.svg';
import i394 from 'kraken-wallet-cryptoicons/src/cre.svg';
import i395 from 'kraken-wallet-cryptoicons/src/cro.svg';
import i396 from 'kraken-wallet-cryptoicons/src/crpt.svg';
import i397 from 'kraken-wallet-cryptoicons/src/crts.svg';
import i398 from 'kraken-wallet-cryptoicons/src/crunch.svg';
import i399 from 'kraken-wallet-cryptoicons/src/cru.svg';
import i400 from 'kraken-wallet-cryptoicons/src/crv.svg';
import i401 from 'kraken-wallet-cryptoicons/src/crw.svg';
import i402 from 'kraken-wallet-cryptoicons/src/csai.svg';
import i403 from 'kraken-wallet-cryptoicons/src/csc.svg';
import i404 from 'kraken-wallet-cryptoicons/src/cspr.svg';
import i405 from 'kraken-wallet-cryptoicons/src/csp.svg';
import i406 from 'kraken-wallet-cryptoicons/src/cs.svg';
import i407 from 'kraken-wallet-cryptoicons/src/ctc.svg';
import i408 from 'kraken-wallet-cryptoicons/src/cti.svg';
import i409 from 'kraken-wallet-cryptoicons/src/ctk.svg';
import i410 from 'kraken-wallet-cryptoicons/src/ctsi.svg';
import i411 from 'kraken-wallet-cryptoicons/src/ctxc.svg';
import i412 from 'kraken-wallet-cryptoicons/src/ctx.svg';
import i413 from 'kraken-wallet-cryptoicons/src/cube.svg';
import i414 from 'kraken-wallet-cryptoicons/src/cudos.svg';
import i415 from 'kraken-wallet-cryptoicons/src/cult.svg';
import i416 from 'kraken-wallet-cryptoicons/src/cusdc.svg';
import i417 from 'kraken-wallet-cryptoicons/src/cusd.svg';
import i418 from 'kraken-wallet-cryptoicons/src/cusdt-1.svg';
import i419 from 'kraken-wallet-cryptoicons/src/cusdt.svg';
import i420 from 'kraken-wallet-cryptoicons/src/cvc.svg';
import i421 from 'kraken-wallet-cryptoicons/src/cvp.svg';
import i422 from 'kraken-wallet-cryptoicons/src/cv.svg';
import i423 from 'kraken-wallet-cryptoicons/src/cvt.svg';
import i424 from 'kraken-wallet-cryptoicons/src/cvx.svg';
import i425 from 'kraken-wallet-cryptoicons/src/cwar.svg';
import i426 from 'kraken-wallet-cryptoicons/src/cwbtc.svg';
import i427 from 'kraken-wallet-cryptoicons/src/cweb.svg';
import i428 from 'kraken-wallet-cryptoicons/src/cws.svg';
import i429 from 'kraken-wallet-cryptoicons/src/cxo.svg';
import i430 from 'kraken-wallet-cryptoicons/src/cyber.svg';
import i431 from 'kraken-wallet-cryptoicons/src/czrx.svg';
import i432 from 'kraken-wallet-cryptoicons/src/dacc.svg';
import i433 from 'kraken-wallet-cryptoicons/src/dadi.svg';
import i434 from 'kraken-wallet-cryptoicons/src/dafi.svg';
import i435 from 'kraken-wallet-cryptoicons/src/dag.svg';
import i436 from 'kraken-wallet-cryptoicons/src/dai.svg';
import i437 from 'kraken-wallet-cryptoicons/src/dao.svg';
import i438 from 'kraken-wallet-cryptoicons/src/dappt.svg';
import i439 from 'kraken-wallet-cryptoicons/src/dappx.svg';
import i440 from 'kraken-wallet-cryptoicons/src/dar.svg';
import i441 from 'kraken-wallet-cryptoicons/src/dasc.svg';
import i442 from 'kraken-wallet-cryptoicons/src/dash.svg';
import i443 from 'kraken-wallet-cryptoicons/src/data.svg';
import i444 from 'kraken-wallet-cryptoicons/src/dat.svg';
import i445 from 'kraken-wallet-cryptoicons/src/datx.svg';
import i446 from 'kraken-wallet-cryptoicons/src/dawn.svg';
import i447 from 'kraken-wallet-cryptoicons/src/dbc.svg';
import i448 from 'kraken-wallet-cryptoicons/src/dcc.svg';
import i449 from 'kraken-wallet-cryptoicons/src/dcn.svg';
import i450 from 'kraken-wallet-cryptoicons/src/dcr.svg';
import i451 from 'kraken-wallet-cryptoicons/src/dct.svg';
import i452 from 'kraken-wallet-cryptoicons/src/ddd.svg';
import i453 from 'kraken-wallet-cryptoicons/src/ddj.svg';
import i454 from 'kraken-wallet-cryptoicons/src/ddx.svg';
import i455 from 'kraken-wallet-cryptoicons/src/defi.svg';
import i456 from 'kraken-wallet-cryptoicons/src/degen.svg';
import i457 from 'kraken-wallet-cryptoicons/src/dego.svg';
import i458 from 'kraken-wallet-cryptoicons/src/dent.svg';
import i459 from 'kraken-wallet-cryptoicons/src/dep.svg';
import i460 from 'kraken-wallet-cryptoicons/src/derc.svg';
import i461 from 'kraken-wallet-cryptoicons/src/deri.svg';
import i462 from 'kraken-wallet-cryptoicons/src/dero.svg';
import i463 from 'kraken-wallet-cryptoicons/src/deso.svg';
import i464 from 'kraken-wallet-cryptoicons/src/dexe.svg';
import i465 from 'kraken-wallet-cryptoicons/src/dfi.svg';
import i466 from 'kraken-wallet-cryptoicons/src/df.svg';
import i467 from 'kraken-wallet-cryptoicons/src/dft.svg';
import i468 from 'kraken-wallet-cryptoicons/src/dfyn.svg';
import i469 from 'kraken-wallet-cryptoicons/src/dgb.svg';
import i470 from 'kraken-wallet-cryptoicons/src/dgd.svg';
import i471 from 'kraken-wallet-cryptoicons/src/dgtx.svg';
import i472 from 'kraken-wallet-cryptoicons/src/dht.svg';
import i473 from 'kraken-wallet-cryptoicons/src/dia.svg';
import i474 from 'kraken-wallet-cryptoicons/src/dinero.svg';
import i475 from 'kraken-wallet-cryptoicons/src/dino.svg';
import i476 from 'kraken-wallet-cryptoicons/src/divi.svg';
import i477 from 'kraken-wallet-cryptoicons/src/dlt.svg';
import i478 from 'kraken-wallet-cryptoicons/src/dmd.svg';
import i479 from 'kraken-wallet-cryptoicons/src/dmg.svg';
import i480 from 'kraken-wallet-cryptoicons/src/dmtr.svg';
import i481 from 'kraken-wallet-cryptoicons/src/dmt.svg';
import i482 from 'kraken-wallet-cryptoicons/src/dnt.svg';
import i483 from 'kraken-wallet-cryptoicons/src/dock.svg';
import i484 from 'kraken-wallet-cryptoicons/src/dodo.svg';
import i485 from 'kraken-wallet-cryptoicons/src/doge.svg';
import i486 from 'kraken-wallet-cryptoicons/src/doginme.svg';
import i487 from 'kraken-wallet-cryptoicons/src/dog.svg';
import i488 from 'kraken-wallet-cryptoicons/src/dojo.svg';
import i489 from 'kraken-wallet-cryptoicons/src/dola.svg';
import i490 from 'kraken-wallet-cryptoicons/src/dome.svg';
import i491 from 'kraken-wallet-cryptoicons/src/dora.svg';
import i492 from 'kraken-wallet-cryptoicons/src/dorkl.svg';
import i493 from 'kraken-wallet-cryptoicons/src/dor.svg';
import i494 from 'kraken-wallet-cryptoicons/src/dot.svg';
import i495 from 'kraken-wallet-cryptoicons/src/dpi.svg';
import i496 from 'kraken-wallet-cryptoicons/src/dpr.svg';
import i497 from 'kraken-wallet-cryptoicons/src/dpx.svg';
import i498 from 'kraken-wallet-cryptoicons/src/drc.svg';
import i499 from 'kraken-wallet-cryptoicons/src/dreams.svg';
import i500 from 'kraken-wallet-cryptoicons/src/drep.svg';
import i501 from 'kraken-wallet-cryptoicons/src/drgn.svg';
import i502 from 'kraken-wallet-cryptoicons/src/drg.svg';
import i503 from 'kraken-wallet-cryptoicons/src/drop.svg';
import i504 from 'kraken-wallet-cryptoicons/src/drs.svg';
import i505 from 'kraken-wallet-cryptoicons/src/drt.svg';
import i506 from 'kraken-wallet-cryptoicons/src/dsla.svg';
import i507 from 'kraken-wallet-cryptoicons/src/dta.svg';
import i508 from 'kraken-wallet-cryptoicons/src/dth.svg';
import i509 from 'kraken-wallet-cryptoicons/src/dtr.svg';
import i510 from 'kraken-wallet-cryptoicons/src/dtx.svg';
import i511 from 'kraken-wallet-cryptoicons/src/dusk.svg';
import i512 from 'kraken-wallet-cryptoicons/src/dvf.svg';
import i513 from 'kraken-wallet-cryptoicons/src/dvi.svg';
import i514 from 'kraken-wallet-cryptoicons/src/dvpn.svg';
import i515 from 'kraken-wallet-cryptoicons/src/dxd.svg';
import i516 from 'kraken-wallet-cryptoicons/src/dx.svg';
import i517 from 'kraken-wallet-cryptoicons/src/dxt.svg';
import i518 from 'kraken-wallet-cryptoicons/src/dydx.svg';
import i519 from 'kraken-wallet-cryptoicons/src/dym.svg';
import i520 from 'kraken-wallet-cryptoicons/src/dyn.svg';
import i521 from 'kraken-wallet-cryptoicons/src/dypc.svg';
import i522 from 'kraken-wallet-cryptoicons/src/easy.svg';
import i523 from 'kraken-wallet-cryptoicons/src/ebst.svg';
import i524 from 'kraken-wallet-cryptoicons/src/eca.svg';
import i525 from 'kraken-wallet-cryptoicons/src/eco.svg';
import i526 from 'kraken-wallet-cryptoicons/src/edge.svg';
import i527 from 'kraken-wallet-cryptoicons/src/edg.svg';
import i528 from 'kraken-wallet-cryptoicons/src/edn.svg';
import i529 from 'kraken-wallet-cryptoicons/src/edo.svg';
import i530 from 'kraken-wallet-cryptoicons/src/edu.svg';
import i531 from 'kraken-wallet-cryptoicons/src/efi.svg';
import i532 from 'kraken-wallet-cryptoicons/src/efl.svg';
import i533 from 'kraken-wallet-cryptoicons/src/efx.svg';
import i534 from 'kraken-wallet-cryptoicons/src/egc.svg';
import i535 from 'kraken-wallet-cryptoicons/src/egld.svg';
import i536 from 'kraken-wallet-cryptoicons/src/egr.svg';
import i537 from 'kraken-wallet-cryptoicons/src/egt.svg';
import i538 from 'kraken-wallet-cryptoicons/src/ekg.svg';
import i539 from 'kraken-wallet-cryptoicons/src/ekt.svg';
import i540 from 'kraken-wallet-cryptoicons/src/elan.svg';
import i541 from 'kraken-wallet-cryptoicons/src/ela.svg';
import i542 from 'kraken-wallet-cryptoicons/src/elec.svg';
import i543 from 'kraken-wallet-cryptoicons/src/elf.svg';
import i544 from 'kraken-wallet-cryptoicons/src/elg.svg';
import i545 from 'kraken-wallet-cryptoicons/src/ella.svg';
import i546 from 'kraken-wallet-cryptoicons/src/elon.svg';
import i547 from 'kraken-wallet-cryptoicons/src/emc2.svg';
import i548 from 'kraken-wallet-cryptoicons/src/emc.svg';
import i549 from 'kraken-wallet-cryptoicons/src/eng.svg';
import i550 from 'kraken-wallet-cryptoicons/src/enj.svg';
import i551 from 'kraken-wallet-cryptoicons/src/enq.svg';
import i552 from 'kraken-wallet-cryptoicons/src/enrg.svg';
import i553 from 'kraken-wallet-cryptoicons/src/ens.svg';
import i554 from 'kraken-wallet-cryptoicons/src/eosc.svg';
import i555 from 'kraken-wallet-cryptoicons/src/eosdac.svg';
import i556 from 'kraken-wallet-cryptoicons/src/eos.svg';
import i557 from 'kraken-wallet-cryptoicons/src/epic.svg';
import i558 from 'kraken-wallet-cryptoicons/src/epik.svg';
import i559 from 'kraken-wallet-cryptoicons/src/epx.svg';
import i560 from 'kraken-wallet-cryptoicons/src/eqb.svg';
import i561 from 'kraken-wallet-cryptoicons/src/eqx.svg';
import i562 from 'kraken-wallet-cryptoicons/src/eqz.svg';
import i563 from 'kraken-wallet-cryptoicons/src/erc.svg';
import i564 from 'kraken-wallet-cryptoicons/src/erg.svg';
import i565 from 'kraken-wallet-cryptoicons/src/ern.svg';
import i566 from 'kraken-wallet-cryptoicons/src/ersdl.svg';
import i567 from 'kraken-wallet-cryptoicons/src/ertha.svg';
import i568 from 'kraken-wallet-cryptoicons/src/esbc.svg';
import i569 from 'kraken-wallet-cryptoicons/src/esd.svg';
import i570 from 'kraken-wallet-cryptoicons/src/esp.svg';
import i571 from 'kraken-wallet-cryptoicons/src/ess.svg';
import i572 from 'kraken-wallet-cryptoicons/src/etc.svg';
import i573 from 'kraken-wallet-cryptoicons/src/eth2.svg';
import i574 from 'kraken-wallet-cryptoicons/src/eth2 v2.svg';
import i575 from 'kraken-wallet-cryptoicons/src/etha.svg';
import i576 from 'kraken-wallet-cryptoicons/src/ethdydx.svg';
import i577 from 'kraken-wallet-cryptoicons/src/etho.svg';
import i578 from 'kraken-wallet-cryptoicons/src/eth.svg';
import i579 from 'kraken-wallet-cryptoicons/src/ethw.svg';
import i580 from 'kraken-wallet-cryptoicons/src/etn.svg';
import i581 from 'kraken-wallet-cryptoicons/src/etp.svg';
import i582 from 'kraken-wallet-cryptoicons/src/etz.svg';
import i583 from 'kraken-wallet-cryptoicons/src/eum.svg';
import i584 from 'kraken-wallet-cryptoicons/src/euroc.svg';
import i585 from 'kraken-wallet-cryptoicons/src/eurs.svg';
import i586 from 'kraken-wallet-cryptoicons/src/eur.svg';
import i587 from 'kraken-wallet-cryptoicons/src/eurt.svg';
import i588 from 'kraken-wallet-cryptoicons/src/evmos.svg';
import i589 from 'kraken-wallet-cryptoicons/src/evx.svg';
import i590 from 'kraken-wallet-cryptoicons/src/ewt.svg';
import i591 from 'kraken-wallet-cryptoicons/src/excl.svg';
import i592 from 'kraken-wallet-cryptoicons/src/exp.svg';
import i593 from 'kraken-wallet-cryptoicons/src/exrd.svg';
import i594 from 'kraken-wallet-cryptoicons/src/exrn.svg';
import i595 from 'kraken-wallet-cryptoicons/src/exy.svg';
import i596 from 'kraken-wallet-cryptoicons/src/ezy.svg';
import i597 from 'kraken-wallet-cryptoicons/src/fab.svg';
import i598 from 'kraken-wallet-cryptoicons/src/face.svg';
import i599 from 'kraken-wallet-cryptoicons/src/falcon.svg';
import i600 from 'kraken-wallet-cryptoicons/src/farm.svg';
import i601 from 'kraken-wallet-cryptoicons/src/fcon.svg';
import i602 from 'kraken-wallet-cryptoicons/src/fct.svg';
import i603 from 'kraken-wallet-cryptoicons/src/fdusd.svg';
import i604 from 'kraken-wallet-cryptoicons/src/fear.svg';
import i605 from 'kraken-wallet-cryptoicons/src/feed.svg';
import i606 from 'kraken-wallet-cryptoicons/src/fei.svg';
import i607 from 'kraken-wallet-cryptoicons/src/fet.svg';
import i608 from 'kraken-wallet-cryptoicons/src/fft.svg';
import i609 from 'kraken-wallet-cryptoicons/src/fida.svg';
import i610 from 'kraken-wallet-cryptoicons/src/filda.svg';
import i611 from 'kraken-wallet-cryptoicons/src/fil.svg';
import i612 from 'kraken-wallet-cryptoicons/src/fio.svg';
import i613 from 'kraken-wallet-cryptoicons/src/firo.svg';
import i614 from 'kraken-wallet-cryptoicons/src/fis.svg';
import i615 from 'kraken-wallet-cryptoicons/src/fitfi.svg';
import i616 from 'kraken-wallet-cryptoicons/src/fjc.svg';
import i617 from 'kraken-wallet-cryptoicons/src/fkx.svg';
import i618 from 'kraken-wallet-cryptoicons/src/flame.svg';
import i619 from 'kraken-wallet-cryptoicons/src/flash.svg';
import i620 from 'kraken-wallet-cryptoicons/src/flc.svg';
import i621 from 'kraken-wallet-cryptoicons/src/fldc.svg';
import i622 from 'kraken-wallet-cryptoicons/src/flex.svg';
import i623 from 'kraken-wallet-cryptoicons/src/flm.svg';
import i624 from 'kraken-wallet-cryptoicons/src/floki.svg';
import i625 from 'kraken-wallet-cryptoicons/src/flo.svg';
import i626 from 'kraken-wallet-cryptoicons/src/flow.svg';
import i627 from 'kraken-wallet-cryptoicons/src/flr.svg';
import i628 from 'kraken-wallet-cryptoicons/src/flux.svg';
import i629 from 'kraken-wallet-cryptoicons/src/fly.svg';
import i630 from 'kraken-wallet-cryptoicons/src/foam.svg';
import i631 from 'kraken-wallet-cryptoicons/src/fold.svg';
import i632 from 'kraken-wallet-cryptoicons/src/forestplus.svg';
import i633 from 'kraken-wallet-cryptoicons/src/form.svg';
import i634 from 'kraken-wallet-cryptoicons/src/for.svg';
import i635 from 'kraken-wallet-cryptoicons/src/forta.svg';
import i636 from 'kraken-wallet-cryptoicons/src/forth.svg';
import i637 from 'kraken-wallet-cryptoicons/src/fota.svg';
import i638 from 'kraken-wallet-cryptoicons/src/fox.svg';
import i639 from 'kraken-wallet-cryptoicons/src/fpis.svg';
import i640 from 'kraken-wallet-cryptoicons/src/fpi.svg';
import i641 from 'kraken-wallet-cryptoicons/src/frame.svg';
import i642 from 'kraken-wallet-cryptoicons/src/frax.svg';
import i643 from 'kraken-wallet-cryptoicons/src/fren.svg';
import i644 from 'kraken-wallet-cryptoicons/src/frm.svg';
import i645 from 'kraken-wallet-cryptoicons/src/front.svg';
import i646 from 'kraken-wallet-cryptoicons/src/frr.svg';
import i647 from 'kraken-wallet-cryptoicons/src/frxeth.svg';
import i648 from 'kraken-wallet-cryptoicons/src/fsn.svg';
import i649 from 'kraken-wallet-cryptoicons/src/fst.svg';
import i650 from 'kraken-wallet-cryptoicons/src/ftc.svg';
import i651 from 'kraken-wallet-cryptoicons/src/ftg.svg';
import i652 from 'kraken-wallet-cryptoicons/src/ftm.svg';
import i653 from 'kraken-wallet-cryptoicons/src/ft.svg';
import i654 from 'kraken-wallet-cryptoicons/src/ftt.svg';
import i655 from 'kraken-wallet-cryptoicons/src/fuel.svg';
import i656 from 'kraken-wallet-cryptoicons/src/fun.svg';
import i657 from 'kraken-wallet-cryptoicons/src/fuse.svg';
import i658 from 'kraken-wallet-cryptoicons/src/fxc.svg';
import i659 from 'kraken-wallet-cryptoicons/src/fxs.svg';
import i660 from 'kraken-wallet-cryptoicons/src/fx.svg';
import i661 from 'kraken-wallet-cryptoicons/src/fxt.svg';
import i662 from 'kraken-wallet-cryptoicons/src/gafi.svg';
import i663 from 'kraken-wallet-cryptoicons/src/gala.svg';
import i664 from 'kraken-wallet-cryptoicons/src/gal.svg';
import i665 from 'kraken-wallet-cryptoicons/src/gamb.svg';
import i666 from 'kraken-wallet-cryptoicons/src/gamee.svg';
import i667 from 'kraken-wallet-cryptoicons/src/game.svg';
import i668 from 'kraken-wallet-cryptoicons/src/gam.svg';
import i669 from 'kraken-wallet-cryptoicons/src/gari.svg';
import i670 from 'kraken-wallet-cryptoicons/src/gas.svg';
import i671 from 'kraken-wallet-cryptoicons/src/gbg.svg';
import i672 from 'kraken-wallet-cryptoicons/src/gbp.svg';
import i673 from 'kraken-wallet-cryptoicons/src/gbx.svg';
import i674 from 'kraken-wallet-cryptoicons/src/gbyte.svg';
import i675 from 'kraken-wallet-cryptoicons/src/gcr.svg';
import i676 from 'kraken-wallet-cryptoicons/src/gdc.svg';
import i677 from 'kraken-wallet-cryptoicons/src/gear.svg';
import i678 from 'kraken-wallet-cryptoicons/src/geeq.svg';
import i679 from 'kraken-wallet-cryptoicons/src/geist.svg';
import i680 from 'kraken-wallet-cryptoicons/src/gem.svg';
import i681 from 'kraken-wallet-cryptoicons/src/gens.svg';
import i682 from 'kraken-wallet-cryptoicons/src/gen.svg';
import i683 from 'kraken-wallet-cryptoicons/src/geo.svg';
import i684 from 'kraken-wallet-cryptoicons/src/gfi.svg';
import i685 from 'kraken-wallet-cryptoicons/src/gf.svg';
import i686 from 'kraken-wallet-cryptoicons/src/ggc.svg';
import i687 from 'kraken-wallet-cryptoicons/src/ggg.svg';
import i688 from 'kraken-wallet-cryptoicons/src/gho.svg';
import i689 from 'kraken-wallet-cryptoicons/src/ghst.svg';
import i690 from 'kraken-wallet-cryptoicons/src/ghx.svg';
import i691 from 'kraken-wallet-cryptoicons/src/gin.svg';
import i692 from 'kraken-wallet-cryptoicons/src/giv.svg';
import i693 from 'kraken-wallet-cryptoicons/src/glch.svg';
import i694 from 'kraken-wallet-cryptoicons/src/gld.svg';
import i695 from 'kraken-wallet-cryptoicons/src/glmr.svg';
import i696 from 'kraken-wallet-cryptoicons/src/glm.svg';
import i697 from 'kraken-wallet-cryptoicons/src/glq.svg';
import i698 from 'kraken-wallet-cryptoicons/src/gls.svg';
import i699 from 'kraken-wallet-cryptoicons/src/gmee.svg';
import i700 from 'kraken-wallet-cryptoicons/src/gmt.svg';
import i701 from 'kraken-wallet-cryptoicons/src/gmx.svg';
import i702 from 'kraken-wallet-cryptoicons/src/gno.svg';
import i703 from 'kraken-wallet-cryptoicons/src/gns.svg';
import i704 from 'kraken-wallet-cryptoicons/src/gnt.svg';
import i705 from 'kraken-wallet-cryptoicons/src/gnx.svg';
import i706 from 'kraken-wallet-cryptoicons/src/goc.svg';
import i707 from 'kraken-wallet-cryptoicons/src/gom2.svg';
import i708 from 'kraken-wallet-cryptoicons/src/go.svg';
import i709 from 'kraken-wallet-cryptoicons/src/got.svg';
import i710 from 'kraken-wallet-cryptoicons/src/govi.svg';
import i711 from 'kraken-wallet-cryptoicons/src/grail.svg';
import i712 from 'kraken-wallet-cryptoicons/src/grc.svg';
import i713 from 'kraken-wallet-cryptoicons/src/grg.svg';
import i714 from 'kraken-wallet-cryptoicons/src/grin.svg';
import i715 from 'kraken-wallet-cryptoicons/src/grow.svg';
import i716 from 'kraken-wallet-cryptoicons/src/grs.svg';
import i717 from 'kraken-wallet-cryptoicons/src/grt.svg';
import i718 from 'kraken-wallet-cryptoicons/src/gsc.svg';
import i719 from 'kraken-wallet-cryptoicons/src/gspi.svg';
import i720 from 'kraken-wallet-cryptoicons/src/gst.svg';
import i721 from 'kraken-wallet-cryptoicons/src/gswap.svg';
import i722 from 'kraken-wallet-cryptoicons/src/gtc.svg';
import i723 from 'kraken-wallet-cryptoicons/src/gto.svg';
import i724 from 'kraken-wallet-cryptoicons/src/gt.svg';
import i725 from 'kraken-wallet-cryptoicons/src/guild.svg';
import i726 from 'kraken-wallet-cryptoicons/src/gup.svg';
import i727 from 'kraken-wallet-cryptoicons/src/gusd.svg';
import i728 from 'kraken-wallet-cryptoicons/src/gvt.svg';
import i729 from 'kraken-wallet-cryptoicons/src/gxc.svg';
import i730 from 'kraken-wallet-cryptoicons/src/gxs.svg';
import i731 from 'kraken-wallet-cryptoicons/src/gyen.svg';
import i732 from 'kraken-wallet-cryptoicons/src/h3ro3s.svg';
import i733 from 'kraken-wallet-cryptoicons/src/hair.svg';
import i734 from 'kraken-wallet-cryptoicons/src/hai.svg';
import i735 from 'kraken-wallet-cryptoicons/src/haka.svg';
import i736 from 'kraken-wallet-cryptoicons/src/hakka.svg';
import i737 from 'kraken-wallet-cryptoicons/src/hanep.svg';
import i738 from 'kraken-wallet-cryptoicons/src/han.svg';
import i739 from 'kraken-wallet-cryptoicons/src/hapi.svg';
import i740 from 'kraken-wallet-cryptoicons/src/harambe.svg';
import i741 from 'kraken-wallet-cryptoicons/src/hard.svg';
import i742 from 'kraken-wallet-cryptoicons/src/hash.svg';
import i743 from 'kraken-wallet-cryptoicons/src/hav.svg';
import i744 from 'kraken-wallet-cryptoicons/src/hbar.svg';
import i745 from 'kraken-wallet-cryptoicons/src/hbb.svg';
import i746 from 'kraken-wallet-cryptoicons/src/hbtc.svg';
import i747 from 'kraken-wallet-cryptoicons/src/hc.svg';
import i748 from 'kraken-wallet-cryptoicons/src/heart.svg';
import i749 from 'kraken-wallet-cryptoicons/src/hedg.svg';
import i750 from 'kraken-wallet-cryptoicons/src/hegic.svg';
import i751 from 'kraken-wallet-cryptoicons/src/hero.svg';
import i752 from 'kraken-wallet-cryptoicons/src/her.svg';
import i753 from 'kraken-wallet-cryptoicons/src/hex.svg';
import i754 from 'kraken-wallet-cryptoicons/src/hft.svg';
import i755 from 'kraken-wallet-cryptoicons/src/hifi.svg';
import i756 from 'kraken-wallet-cryptoicons/src/high.svg';
import i757 from 'kraken-wallet-cryptoicons/src/hive.svg';
import i758 from 'kraken-wallet-cryptoicons/src/hmq.svg';
import i759 from 'kraken-wallet-cryptoicons/src/hmt.svg';
import i760 from 'kraken-wallet-cryptoicons/src/hns.svg';
import i761 from 'kraken-wallet-cryptoicons/src/hnt.svg';
import i762 from 'kraken-wallet-cryptoicons/src/hobbes.svg';
import i763 from 'kraken-wallet-cryptoicons/src/hod.svg';
import i764 from 'kraken-wallet-cryptoicons/src/hoge.svg';
import i765 from 'kraken-wallet-cryptoicons/src/hook.svg';
import i766 from 'kraken-wallet-cryptoicons/src/hop.svg';
import i767 from 'kraken-wallet-cryptoicons/src/hord.svg';
import i768 from 'kraken-wallet-cryptoicons/src/hotcross.svg';
import i769 from 'kraken-wallet-cryptoicons/src/hot.svg';
import i770 from 'kraken-wallet-cryptoicons/src/hot-x.svg';
import i771 from 'kraken-wallet-cryptoicons/src/hpb.svg';
import i772 from 'kraken-wallet-cryptoicons/src/hpo.svg';
import i773 from 'kraken-wallet-cryptoicons/src/hpp.svg';
import i774 from 'kraken-wallet-cryptoicons/src/hsr.svg';
import i775 from 'kraken-wallet-cryptoicons/src/html.svg';
import i776 from 'kraken-wallet-cryptoicons/src/htr.svg';
import i777 from 'kraken-wallet-cryptoicons/src/ht.svg';
import i778 from 'kraken-wallet-cryptoicons/src/hum.svg';
import i779 from 'kraken-wallet-cryptoicons/src/hunt.svg';
import i780 from 'kraken-wallet-cryptoicons/src/husd.svg';
import i781 from 'kraken-wallet-cryptoicons/src/hush.svg';
import i782 from 'kraken-wallet-cryptoicons/src/hvn.svg';
import i783 from 'kraken-wallet-cryptoicons/src/hxro.svg';
import i784 from 'kraken-wallet-cryptoicons/src/hydro.svg';
import i785 from 'kraken-wallet-cryptoicons/src/hyn.svg';
import i786 from 'kraken-wallet-cryptoicons/src/hyve.svg';
import i787 from 'kraken-wallet-cryptoicons/src/hzn.svg';
import i788 from 'kraken-wallet-cryptoicons/src/ibat.svg';
import i789 from 'kraken-wallet-cryptoicons/src/ice.svg';
import i790 from 'kraken-wallet-cryptoicons/src/icn.svg';
import i791 from 'kraken-wallet-cryptoicons/src/icp.svg';
import i792 from 'kraken-wallet-cryptoicons/src/icx.svg';
import i793 from 'kraken-wallet-cryptoicons/src/idai.svg';
import i794 from 'kraken-wallet-cryptoicons/src/idea.svg';
import i795 from 'kraken-wallet-cryptoicons/src/idex.svg';
import i796 from 'kraken-wallet-cryptoicons/src/id.svg';
import i797 from 'kraken-wallet-cryptoicons/src/ieth.svg';
import i798 from 'kraken-wallet-cryptoicons/src/ifarm.svg';
import i799 from 'kraken-wallet-cryptoicons/src/ignis.svg';
import i800 from 'kraken-wallet-cryptoicons/src/ihf.svg';
import i801 from 'kraken-wallet-cryptoicons/src/iknc.svg';
import i802 from 'kraken-wallet-cryptoicons/src/ila.svg';
import i803 from 'kraken-wallet-cryptoicons/src/ilink.svg';
import i804 from 'kraken-wallet-cryptoicons/src/ilv.svg';
import i805 from 'kraken-wallet-cryptoicons/src/imx.svg';
import i806 from 'kraken-wallet-cryptoicons/src/inb.svg';
import i807 from 'kraken-wallet-cryptoicons/src/incnt.svg';
import i808 from 'kraken-wallet-cryptoicons/src/index.svg';
import i809 from 'kraken-wallet-cryptoicons/src/infx.svg';
import i810 from 'kraken-wallet-cryptoicons/src/inj.svg';
import i811 from 'kraken-wallet-cryptoicons/src/ink.svg';
import i812 from 'kraken-wallet-cryptoicons/src/ino.svg';
import i813 from 'kraken-wallet-cryptoicons/src/ins.svg';
import i814 from 'kraken-wallet-cryptoicons/src/instar.svg';
import i815 from 'kraken-wallet-cryptoicons/src/insure.svg';
import i816 from 'kraken-wallet-cryptoicons/src/inv.svg';
import i817 from 'kraken-wallet-cryptoicons/src/ioc.svg';
import i818 from 'kraken-wallet-cryptoicons/src/ioi.svg';
import i819 from 'kraken-wallet-cryptoicons/src/ion.svg';
import i820 from 'kraken-wallet-cryptoicons/src/iop.svg';
import i821 from 'kraken-wallet-cryptoicons/src/iost.svg';
import i822 from 'kraken-wallet-cryptoicons/src/iota.svg';
import i823 from 'kraken-wallet-cryptoicons/src/iot.svg';
import i824 from 'kraken-wallet-cryptoicons/src/iotx.svg';
import i825 from 'kraken-wallet-cryptoicons/src/iq-2.svg';
import i826 from 'kraken-wallet-cryptoicons/src/iq50.svg';
import i827 from 'kraken-wallet-cryptoicons/src/iqn.svg';
import i828 from 'kraken-wallet-cryptoicons/src/iq.svg';
import i829 from 'kraken-wallet-cryptoicons/src/irep.svg';
import i830 from 'kraken-wallet-cryptoicons/src/iris.svg';
import i831 from 'kraken-wallet-cryptoicons/src/isp.svg';
import i832 from 'kraken-wallet-cryptoicons/src/ist.svg';
import i833 from 'kraken-wallet-cryptoicons/src/isusd.svg';
import i834 from 'kraken-wallet-cryptoicons/src/itc.svg';
import i835 from 'kraken-wallet-cryptoicons/src/iusdc.svg';
import i836 from 'kraken-wallet-cryptoicons/src/iwbtc.svg';
import i837 from 'kraken-wallet-cryptoicons/src/ixs.svg';
import i838 from 'kraken-wallet-cryptoicons/src/ixt.svg';
import i839 from 'kraken-wallet-cryptoicons/src/izrx.svg';
import i840 from 'kraken-wallet-cryptoicons/src/jar.svg';
import i841 from 'kraken-wallet-cryptoicons/src/jasmy.svg';
import i842 from 'kraken-wallet-cryptoicons/src/jeur.svg';
import i843 from 'kraken-wallet-cryptoicons/src/jitosol.svg';
import i844 from 'kraken-wallet-cryptoicons/src/jlp.svg';
import i845 from 'kraken-wallet-cryptoicons/src/jnt.svg';
import i846 from 'kraken-wallet-cryptoicons/src/joe.svg';
import i847 from 'kraken-wallet-cryptoicons/src/jrt.svg';
import i848 from 'kraken-wallet-cryptoicons/src/jst.svg';
import i849 from 'kraken-wallet-cryptoicons/src/jto.svg';
import i850 from 'kraken-wallet-cryptoicons/src/juno.svg';
import i851 from 'kraken-wallet-cryptoicons/src/jup.svg';
import i852 from 'kraken-wallet-cryptoicons/src/juv.svg';
import i853 from 'kraken-wallet-cryptoicons/src/kai.svg';
import i854 from 'kraken-wallet-cryptoicons/src/karma.svg';
import i855 from 'kraken-wallet-cryptoicons/src/kar.svg';
import i856 from 'kraken-wallet-cryptoicons/src/kas.svg';
import i857 from 'kraken-wallet-cryptoicons/src/kat.svg';
import i858 from 'kraken-wallet-cryptoicons/src/kava.svg';
import i859 from 'kraken-wallet-cryptoicons/src/kbc.svg';
import i860 from 'kraken-wallet-cryptoicons/src/kbtc.svg';
import i861 from 'kraken-wallet-cryptoicons/src/kcs.svg';
import i862 from 'kraken-wallet-cryptoicons/src/kda.svg';
import i863 from 'kraken-wallet-cryptoicons/src/kdon.svg';
import i864 from 'kraken-wallet-cryptoicons/src/keep.svg';
import i865 from 'kraken-wallet-cryptoicons/src/keycat.svg';
import i866 from 'kraken-wallet-cryptoicons/src/key.svg';
import i867 from 'kraken-wallet-cryptoicons/src/kick.svg';
import i868 from 'kraken-wallet-cryptoicons/src/kilt.svg';
import i869 from 'kraken-wallet-cryptoicons/src/kin.svg';
import i870 from 'kraken-wallet-cryptoicons/src/kint.svg';
import i871 from 'kraken-wallet-cryptoicons/src/kira.svg';
import i872 from 'kraken-wallet-cryptoicons/src/kiro.svg';
import i873 from 'kraken-wallet-cryptoicons/src/klay.svg';
import i874 from 'kraken-wallet-cryptoicons/src/klv.svg';
import i875 from 'kraken-wallet-cryptoicons/src/kma.svg';
import i876 from 'kraken-wallet-cryptoicons/src/kmd.svg';
import i877 from 'kraken-wallet-cryptoicons/src/knc.svg';
import i878 from 'kraken-wallet-cryptoicons/src/kndc.svg';
import i879 from 'kraken-wallet-cryptoicons/src/kok.svg';
import i880 from 'kraken-wallet-cryptoicons/src/kol.svg';
import i881 from 'kraken-wallet-cryptoicons/src/kono.svg';
import i882 from 'kraken-wallet-cryptoicons/src/kore.svg';
import i883 from 'kraken-wallet-cryptoicons/src/kp3r.svg';
import i884 from 'kraken-wallet-cryptoicons/src/krb.svg';
import i885 from 'kraken-wallet-cryptoicons/src/krl.svg';
import i886 from 'kraken-wallet-cryptoicons/src/krw.svg';
import i887 from 'kraken-wallet-cryptoicons/src/ksm.svg';
import i888 from 'kraken-wallet-cryptoicons/src/ksp.svg';
import i889 from 'kraken-wallet-cryptoicons/src/ktn.svg';
import i890 from 'kraken-wallet-cryptoicons/src/kub.svg';
import i891 from 'kraken-wallet-cryptoicons/src/kyl.svg';
import i892 from 'kraken-wallet-cryptoicons/src/lab.svg';
import i893 from 'kraken-wallet-cryptoicons/src/lace.svg';
import i894 from 'kraken-wallet-cryptoicons/src/ladys.svg';
import i895 from 'kraken-wallet-cryptoicons/src/lamb.svg';
import i896 from 'kraken-wallet-cryptoicons/src/land.svg';
import i897 from 'kraken-wallet-cryptoicons/src/la.svg';
import i898 from 'kraken-wallet-cryptoicons/src/layer.svg';
import i899 from 'kraken-wallet-cryptoicons/src/lazio.svg';
import i900 from 'kraken-wallet-cryptoicons/src/lba.svg';
import i901 from 'kraken-wallet-cryptoicons/src/lbc.svg';
import i902 from 'kraken-wallet-cryptoicons/src/lcc.svg';
import i903 from 'kraken-wallet-cryptoicons/src/lcdot.svg';
import i904 from 'kraken-wallet-cryptoicons/src/lcx.svg';
import i905 from 'kraken-wallet-cryptoicons/src/ldo.svg';
import i906 from 'kraken-wallet-cryptoicons/src/lend.svg';
import i907 from 'kraken-wallet-cryptoicons/src/leo.svg';
import i908 from 'kraken-wallet-cryptoicons/src/lever.svg';
import i909 from 'kraken-wallet-cryptoicons/src/lien.svg';
import i910 from 'kraken-wallet-cryptoicons/src/like.svg';
import i911 from 'kraken-wallet-cryptoicons/src/lina.svg';
import i912 from 'kraken-wallet-cryptoicons/src/linea.svg';
import i913 from 'kraken-wallet-cryptoicons/src/link.svg';
import i914 from 'kraken-wallet-cryptoicons/src/lith.svg';
import i915 from 'kraken-wallet-cryptoicons/src/lit.svg';
import i916 from 'kraken-wallet-cryptoicons/src/lkk.svg';
import i917 from 'kraken-wallet-cryptoicons/src/lky.svg';
import i918 from 'kraken-wallet-cryptoicons/src/lmc.svg';
import i919 from 'kraken-wallet-cryptoicons/src/lnchx.svg';
import i920 from 'kraken-wallet-cryptoicons/src/ln.svg';
import i921 from 'kraken-wallet-cryptoicons/src/locg.svg';
import i922 from 'kraken-wallet-cryptoicons/src/loc.svg';
import i923 from 'kraken-wallet-cryptoicons/src/lode.svg';
import i924 from 'kraken-wallet-cryptoicons/src/loka.svg';
import i925 from 'kraken-wallet-cryptoicons/src/loki.svg';
import i926 from 'kraken-wallet-cryptoicons/src/lon.svg';
import i927 from 'kraken-wallet-cryptoicons/src/looks.svg';
import i928 from 'kraken-wallet-cryptoicons/src/loom.svg';
import i929 from 'kraken-wallet-cryptoicons/src/love.svg';
import i930 from 'kraken-wallet-cryptoicons/src/lpf.svg';
import i931 from 'kraken-wallet-cryptoicons/src/lpool.svg';
import i932 from 'kraken-wallet-cryptoicons/src/lpt.svg';
import i933 from 'kraken-wallet-cryptoicons/src/lqd.svg';
import i934 from 'kraken-wallet-cryptoicons/src/lqty.svg';
import i935 from 'kraken-wallet-cryptoicons/src/lrc.svg';
import i936 from 'kraken-wallet-cryptoicons/src/lrg.svg';
import i937 from 'kraken-wallet-cryptoicons/src/lsk.svg';
import i938 from 'kraken-wallet-cryptoicons/src/lss.svg';
import i939 from 'kraken-wallet-cryptoicons/src/ltc.svg';
import i940 from 'kraken-wallet-cryptoicons/src/lto.svg';
import i941 from 'kraken-wallet-cryptoicons/src/ltx.svg';
import i942 from 'kraken-wallet-cryptoicons/src/luca.svg';
import i943 from 'kraken-wallet-cryptoicons/src/luna.svg';
import i944 from 'kraken-wallet-cryptoicons/src/lunc.svg';
import i945 from 'kraken-wallet-cryptoicons/src/lun.svg';
import i946 from 'kraken-wallet-cryptoicons/src/lusd.svg';
import i947 from 'kraken-wallet-cryptoicons/src/lxt.svg';
import i948 from 'kraken-wallet-cryptoicons/src/lym.svg';
import i949 from 'kraken-wallet-cryptoicons/src/lyxe.svg';
import i950 from 'kraken-wallet-cryptoicons/src/maapl.svg';
import i951 from 'kraken-wallet-cryptoicons/src/maga.svg';
import i952 from 'kraken-wallet-cryptoicons/src/magic.svg';
import i953 from 'kraken-wallet-cryptoicons/src/maha.svg';
import i954 from 'kraken-wallet-cryptoicons/src/maid.svg';
import i955 from 'kraken-wallet-cryptoicons/src/mai.svg';
import i956 from 'kraken-wallet-cryptoicons/src/maki.svg';
import i957 from 'kraken-wallet-cryptoicons/src/mana.svg';
import i958 from 'kraken-wallet-cryptoicons/src/man.svg';
import i959 from 'kraken-wallet-cryptoicons/src/manta.svg';
import i960 from 'kraken-wallet-cryptoicons/src/maps.svg';
import i961 from 'kraken-wallet-cryptoicons/src/map.svg';
import i962 from 'kraken-wallet-cryptoicons/src/marsh.svg';
import i963 from 'kraken-wallet-cryptoicons/src/mask.svg';
import i964 from 'kraken-wallet-cryptoicons/src/mass.svg';
import i965 from 'kraken-wallet-cryptoicons/src/math.svg';
import i966 from 'kraken-wallet-cryptoicons/src/matic.svg';
import i967 from 'kraken-wallet-cryptoicons/src/maticx.svg';
import i968 from 'kraken-wallet-cryptoicons/src/matter.svg';
import i969 from 'kraken-wallet-cryptoicons/src/mbc.svg';
import i970 from 'kraken-wallet-cryptoicons/src/mbl.svg';
import i971 from 'kraken-wallet-cryptoicons/src/mbox.svg';
import i972 from 'kraken-wallet-cryptoicons/src/mb.svg';
import i973 from 'kraken-wallet-cryptoicons/src/mcb.svg';
import i974 from 'kraken-wallet-cryptoicons/src/mco2.svg';
import i975 from 'kraken-wallet-cryptoicons/src/mco.svg';
import i976 from 'kraken-wallet-cryptoicons/src/mc.svg';
import i977 from 'kraken-wallet-cryptoicons/src/mcx.svg';
import i978 from 'kraken-wallet-cryptoicons/src/mdao.svg';
import i979 from 'kraken-wallet-cryptoicons/src/mda.svg';
import i980 from 'kraken-wallet-cryptoicons/src/mds.svg';
import i981 from 'kraken-wallet-cryptoicons/src/mdt.svg';
import i982 from 'kraken-wallet-cryptoicons/src/mdx.svg';
import i983 from 'kraken-wallet-cryptoicons/src/med.svg';
import i984 from 'kraken-wallet-cryptoicons/src/medx.svg';
import i985 from 'kraken-wallet-cryptoicons/src/meetone.svg';
import i986 from 'kraken-wallet-cryptoicons/src/meme.svg';
import i987 from 'kraken-wallet-cryptoicons/src/mem.svg';
import i988 from 'kraken-wallet-cryptoicons/src/mer.svg';
import i989 from 'kraken-wallet-cryptoicons/src/metano.svg';
import i990 from 'kraken-wallet-cryptoicons/src/meta.svg';
import i991 from 'kraken-wallet-cryptoicons/src/metis.svg';
import i992 from 'kraken-wallet-cryptoicons/src/met.svg';
import i993 from 'kraken-wallet-cryptoicons/src/mew.svg';
import i994 from 'kraken-wallet-cryptoicons/src/mex.svg';
import i995 from 'kraken-wallet-cryptoicons/src/mfg.svg';
import i996 from 'kraken-wallet-cryptoicons/src/mft.svg';
import i997 from 'kraken-wallet-cryptoicons/src/mhc.svg';
import i998 from 'kraken-wallet-cryptoicons/src/mimatic.svg';
import i999 from 'kraken-wallet-cryptoicons/src/mim.svg';
import i1000 from 'kraken-wallet-cryptoicons/src/mina.svg';
import i1001 from 'kraken-wallet-cryptoicons/src/miota.svg';
import i1002 from 'kraken-wallet-cryptoicons/src/mir.svg';
import i1003 from 'kraken-wallet-cryptoicons/src/mith.svg';
import i1004 from 'kraken-wallet-cryptoicons/src/mitx.svg';
import i1005 from 'kraken-wallet-cryptoicons/src/mjt.svg';
import i1006 from 'kraken-wallet-cryptoicons/src/mkr.svg';
import i1007 from 'kraken-wallet-cryptoicons/src/mlb.svg';
import i1008 from 'kraken-wallet-cryptoicons/src/mlk.svg';
import i1009 from 'kraken-wallet-cryptoicons/src/mln.svg';
import i1010 from 'kraken-wallet-cryptoicons/src/mmt.svg';
import i1011 from 'kraken-wallet-cryptoicons/src/mmxn.svg';
import i1012 from 'kraken-wallet-cryptoicons/src/mnde.svg';
import i1013 from 'kraken-wallet-cryptoicons/src/mnet.svg';
import i1014 from 'kraken-wallet-cryptoicons/src/mngo.svg';
import i1015 from 'kraken-wallet-cryptoicons/src/mns.svg';
import i1016 from 'kraken-wallet-cryptoicons/src/mnst.svg';
import i1017 from 'kraken-wallet-cryptoicons/src/mntl.svg';
import i1018 from 'kraken-wallet-cryptoicons/src/mnt.svg';
import i1019 from 'kraken-wallet-cryptoicons/src/mnw.svg';
import i1020 from 'kraken-wallet-cryptoicons/src/moac.svg';
import i1021 from 'kraken-wallet-cryptoicons/src/mob.svg';
import i1022 from 'kraken-wallet-cryptoicons/src/mochi.svg';
import i1023 from 'kraken-wallet-cryptoicons/src/modefi.svg';
import i1024 from 'kraken-wallet-cryptoicons/src/mod.svg';
import i1025 from 'kraken-wallet-cryptoicons/src/mof.svg';
import i1026 from 'kraken-wallet-cryptoicons/src/mog.svg';
import i1027 from 'kraken-wallet-cryptoicons/src/mom.svg';
import i1028 from 'kraken-wallet-cryptoicons/src/mona.svg';
import i1029 from 'kraken-wallet-cryptoicons/src/moni.svg';
import i1030 from 'kraken-wallet-cryptoicons/src/moon.svg';
import i1031 from 'kraken-wallet-cryptoicons/src/mot.svg';
import i1032 from 'kraken-wallet-cryptoicons/src/movez.svg';
import i1033 from 'kraken-wallet-cryptoicons/src/movr.svg';
import i1034 from 'kraken-wallet-cryptoicons/src/mph.svg';
import i1035 from 'kraken-wallet-cryptoicons/src/mpl.svg';
import i1036 from 'kraken-wallet-cryptoicons/src/msol.svg';
import i1037 from 'kraken-wallet-cryptoicons/src/msr.svg';
import i1038 from 'kraken-wallet-cryptoicons/src/mswap.svg';
import i1039 from 'kraken-wallet-cryptoicons/src/mta.svg';
import i1040 from 'kraken-wallet-cryptoicons/src/mtc.svg';
import i1041 from 'kraken-wallet-cryptoicons/src/mth.svg';
import i1042 from 'kraken-wallet-cryptoicons/src/mtl.svg';
import i1043 from 'kraken-wallet-cryptoicons/src/mtn.svg';
import i1044 from 'kraken-wallet-cryptoicons/src/mtrg.svg';
import i1045 from 'kraken-wallet-cryptoicons/src/mts.svg';
import i1046 from 'kraken-wallet-cryptoicons/src/mtv.svg';
import i1047 from 'kraken-wallet-cryptoicons/src/mue.svg';
import i1048 from 'kraken-wallet-cryptoicons/src/multi.svg';
import i1049 from 'kraken-wallet-cryptoicons/src/musd.svg';
import i1050 from 'kraken-wallet-cryptoicons/src/music.svg';
import i1051 from 'kraken-wallet-cryptoicons/src/mvc.svg';
import i1052 from 'kraken-wallet-cryptoicons/src/mvl.svg';
import i1053 from 'kraken-wallet-cryptoicons/src/mvp.svg';
import i1054 from 'kraken-wallet-cryptoicons/src/mwat.svg';
import i1055 from 'kraken-wallet-cryptoicons/src/mwc.svg';
import i1056 from 'kraken-wallet-cryptoicons/src/mxc.svg';
import i1057 from 'kraken-wallet-cryptoicons/src/mxm.svg';
import i1058 from 'kraken-wallet-cryptoicons/src/mx.svg';
import i1059 from 'kraken-wallet-cryptoicons/src/mxw.svg';
import i1060 from 'kraken-wallet-cryptoicons/src/myb.svg';
import i1061 from 'kraken-wallet-cryptoicons/src/myro.svg';
import i1062 from 'kraken-wallet-cryptoicons/src/myst.svg';
import i1063 from 'kraken-wallet-cryptoicons/src/naka.svg';
import i1064 from 'kraken-wallet-cryptoicons/src/nano.svg';
import i1065 from 'kraken-wallet-cryptoicons/src/nas.svg';
import i1066 from 'kraken-wallet-cryptoicons/src/nav.svg';
import i1067 from 'kraken-wallet-cryptoicons/src/nbs.svg';
import i1068 from 'kraken-wallet-cryptoicons/src/nbt.svg';
import i1069 from 'kraken-wallet-cryptoicons/src/ncash.svg';
import i1070 from 'kraken-wallet-cryptoicons/src/nct.svg';
import i1071 from 'kraken-wallet-cryptoicons/src/ndau.svg';
import i1072 from 'kraken-wallet-cryptoicons/src/near.svg';
import i1073 from 'kraken-wallet-cryptoicons/src/nebl.svg';
import i1074 from 'kraken-wallet-cryptoicons/src/nec.svg';
import i1075 from 'kraken-wallet-cryptoicons/src/nem.svg';
import i1076 from 'kraken-wallet-cryptoicons/src/neon.svg';
import i1077 from 'kraken-wallet-cryptoicons/src/neos.svg';
import i1078 from 'kraken-wallet-cryptoicons/src/neo.svg';
import i1079 from 'kraken-wallet-cryptoicons/src/neox.svg';
import i1080 from 'kraken-wallet-cryptoicons/src/nest.svg';
import i1081 from 'kraken-wallet-cryptoicons/src/neu.svg';
import i1082 from 'kraken-wallet-cryptoicons/src/new.svg';
import i1083 from 'kraken-wallet-cryptoicons/src/nexo.svg';
import i1084 from 'kraken-wallet-cryptoicons/src/nex.svg';
import i1085 from 'kraken-wallet-cryptoicons/src/nexxo.svg';
import i1086 from 'kraken-wallet-cryptoicons/src/nftb.svg';
import i1087 from 'kraken-wallet-cryptoicons/src/nft.svg';
import i1088 from 'kraken-wallet-cryptoicons/src/nftx.svg';
import i1089 from 'kraken-wallet-cryptoicons/src/ngc.svg';
import i1090 from 'kraken-wallet-cryptoicons/src/ngm.svg';
import i1091 from 'kraken-wallet-cryptoicons/src/nif.svg';
import i1092 from 'kraken-wallet-cryptoicons/src/nim.svg';
import i1093 from 'kraken-wallet-cryptoicons/src/niox.svg';
import i1094 from 'kraken-wallet-cryptoicons/src/nix.svg';
import i1095 from 'kraken-wallet-cryptoicons/src/nkn.svg';
import i1096 from 'kraken-wallet-cryptoicons/src/nlc2.svg';
import i1097 from 'kraken-wallet-cryptoicons/src/nlg.svg';
import i1098 from 'kraken-wallet-cryptoicons/src/nmc.svg';
import i1099 from 'kraken-wallet-cryptoicons/src/nmr.svg';
import i1100 from 'kraken-wallet-cryptoicons/src/noia.svg';
import i1101 from 'kraken-wallet-cryptoicons/src/nord.svg';
import i1102 from 'kraken-wallet-cryptoicons/src/normie.svg';
import i1103 from 'kraken-wallet-cryptoicons/src/normilio.svg';
import i1104 from 'kraken-wallet-cryptoicons/src/nox.svg';
import i1105 from 'kraken-wallet-cryptoicons/src/nper.svg';
import i1106 from 'kraken-wallet-cryptoicons/src/npxs.svg';
import i1107 from 'kraken-wallet-cryptoicons/src/nrg.svg';
import i1108 from 'kraken-wallet-cryptoicons/src/nrve.svg';
import i1109 from 'kraken-wallet-cryptoicons/src/nrv.svg';
import i1110 from 'kraken-wallet-cryptoicons/src/ntic.svg';
import i1111 from 'kraken-wallet-cryptoicons/src/ntrn.svg';
import i1112 from 'kraken-wallet-cryptoicons/src/ntvrk.svg';
import i1113 from 'kraken-wallet-cryptoicons/src/nuls.svg';
import i1114 from 'kraken-wallet-cryptoicons/src/num.svg';
import i1115 from 'kraken-wallet-cryptoicons/src/nusd.svg';
import i1116 from 'kraken-wallet-cryptoicons/src/nu.svg';
import i1117 from 'kraken-wallet-cryptoicons/src/nwc.svg';
import i1118 from 'kraken-wallet-cryptoicons/src/nxm.svg';
import i1119 from 'kraken-wallet-cryptoicons/src/nxs.svg';
import i1120 from 'kraken-wallet-cryptoicons/src/nxt.svg';
import i1121 from 'kraken-wallet-cryptoicons/src/nye.svg';
import i1122 from 'kraken-wallet-cryptoicons/src/nym.svg';
import i1123 from 'kraken-wallet-cryptoicons/src/oag.svg';
import i1124 from 'kraken-wallet-cryptoicons/src/oak.svg';
import i1125 from 'kraken-wallet-cryptoicons/src/oax.svg';
import i1126 from 'kraken-wallet-cryptoicons/src/ocean.svg';
import i1127 from 'kraken-wallet-cryptoicons/src/ocn.svg';
import i1128 from 'kraken-wallet-cryptoicons/src/oddz.svg';
import i1129 from 'kraken-wallet-cryptoicons/src/ode.svg';
import i1130 from 'kraken-wallet-cryptoicons/src/ogn.svg';
import i1131 from 'kraken-wallet-cryptoicons/src/ogo.svg';
import i1132 from 'kraken-wallet-cryptoicons/src/og.svg';
import i1133 from 'kraken-wallet-cryptoicons/src/ohm.svg';
import i1134 from 'kraken-wallet-cryptoicons/src/oil.svg';
import i1135 from 'kraken-wallet-cryptoicons/src/okb.svg';
import i1136 from 'kraken-wallet-cryptoicons/src/oks.svg';
import i1137 from 'kraken-wallet-cryptoicons/src/ok.svg';
import i1138 from 'kraken-wallet-cryptoicons/src/olt.svg';
import i1139 from 'kraken-wallet-cryptoicons/src/omg.svg';
import i1140 from 'kraken-wallet-cryptoicons/src/omni.svg';
import i1141 from 'kraken-wallet-cryptoicons/src/om.svg';
import i1142 from 'kraken-wallet-cryptoicons/src/ondo.svg';
import i1143 from 'kraken-wallet-cryptoicons/src/one.svg';
import i1144 from 'kraken-wallet-cryptoicons/src/ong.svg';
import i1145 from 'kraken-wallet-cryptoicons/src/onion.svg';
import i1146 from 'kraken-wallet-cryptoicons/src/onston.svg';
import i1147 from 'kraken-wallet-cryptoicons/src/ont.svg';
import i1148 from 'kraken-wallet-cryptoicons/src/ooe.svg';
import i1149 from 'kraken-wallet-cryptoicons/src/ooki.svg';
import i1150 from 'kraken-wallet-cryptoicons/src/oot.svg';
import i1151 from 'kraken-wallet-cryptoicons/src/open.svg';
import i1152 from 'kraken-wallet-cryptoicons/src/opium.svg';
import i1153 from 'kraken-wallet-cryptoicons/src/opq.svg';
import i1154 from 'kraken-wallet-cryptoicons/src/opsec.svg';
import i1155 from 'kraken-wallet-cryptoicons/src/ops.svg';
import i1156 from 'kraken-wallet-cryptoicons/src/op.svg';
import i1157 from 'kraken-wallet-cryptoicons/src/opul.svg';
import i1158 from 'kraken-wallet-cryptoicons/src/opx.svg';
import i1159 from 'kraken-wallet-cryptoicons/src/orai.svg';
import i1160 from 'kraken-wallet-cryptoicons/src/orbs.svg';
import i1161 from 'kraken-wallet-cryptoicons/src/orca.svg';
import i1162 from 'kraken-wallet-cryptoicons/src/orcat.svg';
import i1163 from 'kraken-wallet-cryptoicons/src/orc.svg';
import i1164 from 'kraken-wallet-cryptoicons/src/ordi.svg';
import i1165 from 'kraken-wallet-cryptoicons/src/orn.svg';
import i1166 from 'kraken-wallet-cryptoicons/src/osmo.svg';
import i1167 from 'kraken-wallet-cryptoicons/src/ost.svg';
import i1168 from 'kraken-wallet-cryptoicons/src/ouro.svg';
import i1169 from 'kraken-wallet-cryptoicons/src/ousd.svg';
import i1170 from 'kraken-wallet-cryptoicons/src/ovc.svg';
import i1171 from 'kraken-wallet-cryptoicons/src/oxen.svg';
import i1172 from 'kraken-wallet-cryptoicons/src/oxt.svg';
import i1173 from 'kraken-wallet-cryptoicons/src/oxy.svg';
import i1174 from 'kraken-wallet-cryptoicons/src/pac.svg';
import i1175 from 'kraken-wallet-cryptoicons/src/paint.svg';
import i1176 from 'kraken-wallet-cryptoicons/src/pai.svg';
import i1177 from 'kraken-wallet-cryptoicons/src/palm.svg';
import i1178 from 'kraken-wallet-cryptoicons/src/pal.svg';
import i1179 from 'kraken-wallet-cryptoicons/src/paper.svg';
import i1180 from 'kraken-wallet-cryptoicons/src/par.svg';
import i1181 from 'kraken-wallet-cryptoicons/src/part.svg';
import i1182 from 'kraken-wallet-cryptoicons/src/pasc.svg';
import i1183 from 'kraken-wallet-cryptoicons/src/paxg.svg';
import i1184 from 'kraken-wallet-cryptoicons/src/pax.svg';
import i1185 from 'kraken-wallet-cryptoicons/src/pay.svg';
import i1186 from 'kraken-wallet-cryptoicons/src/payx.svg';
import i1187 from 'kraken-wallet-cryptoicons/src/pazzi.svg';
import i1188 from 'kraken-wallet-cryptoicons/src/pbirb.svg';
import i1189 from 'kraken-wallet-cryptoicons/src/pbr.svg';
import i1190 from 'kraken-wallet-cryptoicons/src/pbtc.svg';
import i1191 from 'kraken-wallet-cryptoicons/src/pbx.svg';
import i1192 from 'kraken-wallet-cryptoicons/src/pchu.svg';
import i1193 from 'kraken-wallet-cryptoicons/src/pcx.svg';
import i1194 from 'kraken-wallet-cryptoicons/src/pdex.svg';
import i1195 from 'kraken-wallet-cryptoicons/src/pearl.svg';
import i1196 from 'kraken-wallet-cryptoicons/src/peas.svg';
import i1197 from 'kraken-wallet-cryptoicons/src/pel.svg';
import i1198 from 'kraken-wallet-cryptoicons/src/pendle.svg';
import i1199 from 'kraken-wallet-cryptoicons/src/pepe.svg';
import i1200 from 'kraken-wallet-cryptoicons/src/perl.svg';
import i1201 from 'kraken-wallet-cryptoicons/src/perp.svg';
import i1202 from 'kraken-wallet-cryptoicons/src/pha.svg';
import i1203 from 'kraken-wallet-cryptoicons/src/phb.svg';
import i1204 from 'kraken-wallet-cryptoicons/src/phnx.svg';
import i1205 from 'kraken-wallet-cryptoicons/src/phtk.svg';
import i1206 from 'kraken-wallet-cryptoicons/src/phx.svg';
import i1207 from 'kraken-wallet-cryptoicons/src/pickle.svg';
import i1208 from 'kraken-wallet-cryptoicons/src/pink.svg';
import i1209 from 'kraken-wallet-cryptoicons/src/pip.svg';
import i1210 from 'kraken-wallet-cryptoicons/src/pirl.svg';
import i1211 from 'kraken-wallet-cryptoicons/src/pivx.svg';
import i1212 from 'kraken-wallet-cryptoicons/src/pkb.svg';
import i1213 from 'kraken-wallet-cryptoicons/src/pla.svg';
import i1214 from 'kraken-wallet-cryptoicons/src/play.svg';
import i1215 from 'kraken-wallet-cryptoicons/src/plbt.svg';
import i1216 from 'kraken-wallet-cryptoicons/src/plc.svg';
import i1217 from 'kraken-wallet-cryptoicons/src/pldai.svg';
import i1218 from 'kraken-wallet-cryptoicons/src/plgr.svg';
import i1219 from 'kraken-wallet-cryptoicons/src/plr.svg';
import i1220 from 'kraken-wallet-cryptoicons/src/pltc.svg';
import i1221 from 'kraken-wallet-cryptoicons/src/plt.svg';
import i1222 from 'kraken-wallet-cryptoicons/src/plusdc.svg';
import i1223 from 'kraken-wallet-cryptoicons/src/plu.svg';
import i1224 from 'kraken-wallet-cryptoicons/src/pma.svg';
import i1225 from 'kraken-wallet-cryptoicons/src/pmgt.svg';
import i1226 from 'kraken-wallet-cryptoicons/src/pmon.svg';
import i1227 from 'kraken-wallet-cryptoicons/src/png.svg';
import i1228 from 'kraken-wallet-cryptoicons/src/pnk.svg';
import i1229 from 'kraken-wallet-cryptoicons/src/pnt.svg';
import i1230 from 'kraken-wallet-cryptoicons/src/poa.svg';
import i1231 from 'kraken-wallet-cryptoicons/src/poe.svg';
import i1232 from 'kraken-wallet-cryptoicons/src/pokt.svg';
import i1233 from 'kraken-wallet-cryptoicons/src/polc.svg';
import i1234 from 'kraken-wallet-cryptoicons/src/polis.svg';
import i1235 from 'kraken-wallet-cryptoicons/src/polk.svg';
import i1236 from 'kraken-wallet-cryptoicons/src/pols.svg';
import i1237 from 'kraken-wallet-cryptoicons/src/pol.svg';
import i1238 from 'kraken-wallet-cryptoicons/src/polx.svg';
import i1239 from 'kraken-wallet-cryptoicons/src/poly-2.svg';
import i1240 from 'kraken-wallet-cryptoicons/src/poly.svg';
import i1241 from 'kraken-wallet-cryptoicons/src/polyx.svg';
import i1242 from 'kraken-wallet-cryptoicons/src/pom.svg';
import i1243 from 'kraken-wallet-cryptoicons/src/pond.svg';
import i1244 from 'kraken-wallet-cryptoicons/src/ponke.svg';
import i1245 from 'kraken-wallet-cryptoicons/src/pont.svg';
import i1246 from 'kraken-wallet-cryptoicons/src/pool.svg';
import i1247 from 'kraken-wallet-cryptoicons/src/popcat.svg';
import i1248 from 'kraken-wallet-cryptoicons/src/pop.svg';
import i1249 from 'kraken-wallet-cryptoicons/src/pork.svg';
import i1250 from 'kraken-wallet-cryptoicons/src/porto.svg';
import i1251 from 'kraken-wallet-cryptoicons/src/potnoy.svg';
import i1252 from 'kraken-wallet-cryptoicons/src/pot.svg';
import i1253 from 'kraken-wallet-cryptoicons/src/power.svg';
import i1254 from 'kraken-wallet-cryptoicons/src/powr.svg';
import i1255 from 'kraken-wallet-cryptoicons/src/ppay.svg';
import i1256 from 'kraken-wallet-cryptoicons/src/ppc.svg';
import i1257 from 'kraken-wallet-cryptoicons/src/ppp.svg';
import i1258 from 'kraken-wallet-cryptoicons/src/ppt.svg';
import i1259 from 'kraken-wallet-cryptoicons/src/premia.svg';
import i1260 from 'kraken-wallet-cryptoicons/src/pre.svg';
import i1261 from 'kraken-wallet-cryptoicons/src/prime.svg';
import i1262 from 'kraken-wallet-cryptoicons/src/prl.svg';
import i1263 from 'kraken-wallet-cryptoicons/src/prom.svg';
import i1264 from 'kraken-wallet-cryptoicons/src/props.svg';
import i1265 from 'kraken-wallet-cryptoicons/src/pros.svg';
import i1266 from 'kraken-wallet-cryptoicons/src/pro.svg';
import i1267 from 'kraken-wallet-cryptoicons/src/prq.svg';
import i1268 from 'kraken-wallet-cryptoicons/src/psg.svg';
import i1269 from 'kraken-wallet-cryptoicons/src/psp.svg';
import i1270 from 'kraken-wallet-cryptoicons/src/pstake.svg';
import i1271 from 'kraken-wallet-cryptoicons/src/pst.svg';
import i1272 from 'kraken-wallet-cryptoicons/src/ptc.svg';
import i1273 from 'kraken-wallet-cryptoicons/src/ptoy.svg';
import i1274 from 'kraken-wallet-cryptoicons/src/pundix.svg';
import i1275 from 'kraken-wallet-cryptoicons/src/pups.svg';
import i1276 from 'kraken-wallet-cryptoicons/src/pyr.svg';
import i1277 from 'kraken-wallet-cryptoicons/src/pyth.svg';
import i1278 from 'kraken-wallet-cryptoicons/src/pyusd.svg';
import i1279 from 'kraken-wallet-cryptoicons/src/qash.svg';
import i1280 from 'kraken-wallet-cryptoicons/src/qbit.svg';
import i1281 from 'kraken-wallet-cryptoicons/src/qi.svg';
import i1282 from 'kraken-wallet-cryptoicons/src/qkc.svg';
import i1283 from 'kraken-wallet-cryptoicons/src/qlc.svg';
import i1284 from 'kraken-wallet-cryptoicons/src/qnt.svg';
import i1285 from 'kraken-wallet-cryptoicons/src/qqq.svg';
import i1286 from 'kraken-wallet-cryptoicons/src/qrdo.svg';
import i1287 from 'kraken-wallet-cryptoicons/src/qrl.svg';
import i1288 from 'kraken-wallet-cryptoicons/src/qsp.svg';
import i1289 from 'kraken-wallet-cryptoicons/src/qtum.svg';
import i1290 from 'kraken-wallet-cryptoicons/src/quick.svg';
import i1291 from 'kraken-wallet-cryptoicons/src/qun.svg';
import i1292 from 'kraken-wallet-cryptoicons/src/qwark.svg';
import i1293 from 'kraken-wallet-cryptoicons/src/raca.svg';
import i1294 from 'kraken-wallet-cryptoicons/src/radar.svg';
import i1295 from 'kraken-wallet-cryptoicons/src/rads.svg';
import i1296 from 'kraken-wallet-cryptoicons/src/rad.svg';
import i1297 from 'kraken-wallet-cryptoicons/src/rae.svg';
import i1298 from 'kraken-wallet-cryptoicons/src/rai.svg';
import i1299 from 'kraken-wallet-cryptoicons/src/ramp.svg';
import i1300 from 'kraken-wallet-cryptoicons/src/ranker.svg';
import i1301 from 'kraken-wallet-cryptoicons/src/rare.svg';
import i1302 from 'kraken-wallet-cryptoicons/src/rari.svg';
import i1303 from 'kraken-wallet-cryptoicons/src/ray.svg';
import i1304 from 'kraken-wallet-cryptoicons/src/rbc.svg';
import i1305 from 'kraken-wallet-cryptoicons/src/rbn.svg';
import i1306 from 'kraken-wallet-cryptoicons/src/rbtc.svg';
import i1307 from 'kraken-wallet-cryptoicons/src/rby.svg';
import i1308 from 'kraken-wallet-cryptoicons/src/rcn.svg';
import i1309 from 'kraken-wallet-cryptoicons/src/rdd.svg';
import i1310 from 'kraken-wallet-cryptoicons/src/rdn.svg';
import i1311 from 'kraken-wallet-cryptoicons/src/rdnt.svg';
import i1312 from 'kraken-wallet-cryptoicons/src/reap.svg';
import i1313 from 'kraken-wallet-cryptoicons/src/reef.svg';
import i1314 from 'kraken-wallet-cryptoicons/src/rei.svg';
import i1315 from 'kraken-wallet-cryptoicons/src/renbtc.svg';
import i1316 from 'kraken-wallet-cryptoicons/src/render.svg';
import i1317 from 'kraken-wallet-cryptoicons/src/renfil.svg';
import i1318 from 'kraken-wallet-cryptoicons/src/ren.svg';
import i1319 from 'kraken-wallet-cryptoicons/src/rep.svg';
import i1320 from 'kraken-wallet-cryptoicons/src/req.svg';
import i1321 from 'kraken-wallet-cryptoicons/src/reth.svg';
import i1322 from 'kraken-wallet-cryptoicons/src/revo.svg';
import i1323 from 'kraken-wallet-cryptoicons/src/rev.svg';
import i1324 from 'kraken-wallet-cryptoicons/src/revu.svg';
import i1325 from 'kraken-wallet-cryptoicons/src/revv.svg';
import i1326 from 'kraken-wallet-cryptoicons/src/rfox.svg';
import i1327 from 'kraken-wallet-cryptoicons/src/rfr.svg';
import i1328 from 'kraken-wallet-cryptoicons/src/rfuel.svg';
import i1329 from 'kraken-wallet-cryptoicons/src/rfwsteth.svg';
import i1330 from 'kraken-wallet-cryptoicons/src/rgt.svg';
import i1331 from 'kraken-wallet-cryptoicons/src/rhoc.svg';
import i1332 from 'kraken-wallet-cryptoicons/src/rif.svg';
import i1333 from 'kraken-wallet-cryptoicons/src/rise.svg';
import i1334 from 'kraken-wallet-cryptoicons/src/rlc.svg';
import i1335 from 'kraken-wallet-cryptoicons/src/rly.svg';
import i1336 from 'kraken-wallet-cryptoicons/src/rmark.svg';
import i1337 from 'kraken-wallet-cryptoicons/src/rndr.svg';
import i1338 from 'kraken-wallet-cryptoicons/src/road.svg';
import i1339 from 'kraken-wallet-cryptoicons/src/roar.svg';
import i1340 from 'kraken-wallet-cryptoicons/src/ron.svg';
import i1341 from 'kraken-wallet-cryptoicons/src/roobee.svg';
import i1342 from 'kraken-wallet-cryptoicons/src/rook.svg';
import i1343 from 'kraken-wallet-cryptoicons/src/rose.svg';
import i1344 from 'kraken-wallet-cryptoicons/src/rosn.svg';
import i1345 from 'kraken-wallet-cryptoicons/src/route.svg';
import i1346 from 'kraken-wallet-cryptoicons/src/rpl.svg';
import i1347 from 'kraken-wallet-cryptoicons/src/rpx.svg';
import i1348 from 'kraken-wallet-cryptoicons/src/rsr.svg';
import i1349 from 'kraken-wallet-cryptoicons/src/r.svg';
import i1350 from 'kraken-wallet-cryptoicons/src/rsv.svg';
import i1351 from 'kraken-wallet-cryptoicons/src/ruff.svg';
import i1352 from 'kraken-wallet-cryptoicons/src/rune.svg';
import i1353 from 'kraken-wallet-cryptoicons/src/rvn.svg';
import i1354 from 'kraken-wallet-cryptoicons/src/rvr.svg';
import i1355 from 'kraken-wallet-cryptoicons/src/ryo.svg';
import i1356 from 'kraken-wallet-cryptoicons/src/safemoon.svg';
import i1357 from 'kraken-wallet-cryptoicons/src/sai.svg';
import i1358 from 'kraken-wallet-cryptoicons/src/saito.svg';
import i1359 from 'kraken-wallet-cryptoicons/src/salt.svg';
import i1360 from 'kraken-wallet-cryptoicons/src/samo.svg';
import i1361 from 'kraken-wallet-cryptoicons/src/sand.svg';
import i1362 from 'kraken-wallet-cryptoicons/src/san.svg';
import i1363 from 'kraken-wallet-cryptoicons/src/santos.svg';
import i1364 from 'kraken-wallet-cryptoicons/src/sapp.svg';
import i1365 from 'kraken-wallet-cryptoicons/src/sar.svg';
import i1366 from 'kraken-wallet-cryptoicons/src/savax.svg';
import i1367 from 'kraken-wallet-cryptoicons/src/sbd.svg';
import i1368 from 'kraken-wallet-cryptoicons/src/sbr.svg';
import i1369 from 'kraken-wallet-cryptoicons/src/sbtc.svg';
import i1370 from 'kraken-wallet-cryptoicons/src/sclp.svg';
import i1371 from 'kraken-wallet-cryptoicons/src/scrl.svg';
import i1372 from 'kraken-wallet-cryptoicons/src/scrt.svg';
import i1373 from 'kraken-wallet-cryptoicons/src/sc.svg';
import i1374 from 'kraken-wallet-cryptoicons/src/sdao.svg';
import i1375 from 'kraken-wallet-cryptoicons/src/sdl.svg';
import i1376 from 'kraken-wallet-cryptoicons/src/sdn.svg';
import i1377 from 'kraken-wallet-cryptoicons/src/sd.svg';
import i1378 from 'kraken-wallet-cryptoicons/src/sdt.svg';
import i1379 from 'kraken-wallet-cryptoicons/src/seele.svg';
import i1380 from 'kraken-wallet-cryptoicons/src/sefi.svg';
import i1381 from 'kraken-wallet-cryptoicons/src/sei.svg';
import i1382 from 'kraken-wallet-cryptoicons/src/sem.svg';
import i1383 from 'kraken-wallet-cryptoicons/src/senso.svg';
import i1384 from 'kraken-wallet-cryptoicons/src/seq.svg';
import i1385 from 'kraken-wallet-cryptoicons/src/sero.svg';
import i1386 from 'kraken-wallet-cryptoicons/src/seth2.svg';
import i1387 from 'kraken-wallet-cryptoicons/src/seth.svg';
import i1388 from 'kraken-wallet-cryptoicons/src/sfi.svg';
import i1389 from 'kraken-wallet-cryptoicons/src/sfm.svg';
import i1390 from 'kraken-wallet-cryptoicons/src/sfp-2.svg';
import i1391 from 'kraken-wallet-cryptoicons/src/sfp.svg';
import i1392 from 'kraken-wallet-cryptoicons/src/sfrxeth.svg';
import i1393 from 'kraken-wallet-cryptoicons/src/sfund.svg';
import i1394 from 'kraken-wallet-cryptoicons/src/sgb.svg';
import i1395 from 'kraken-wallet-cryptoicons/src/sha.svg';
import i1396 from 'kraken-wallet-cryptoicons/src/shdw.svg';
import i1397 from 'kraken-wallet-cryptoicons/src/shft.svg';
import i1398 from 'kraken-wallet-cryptoicons/src/shib.svg';
import i1399 from 'kraken-wallet-cryptoicons/src/shift.svg';
import i1400 from 'kraken-wallet-cryptoicons/src/shill.svg';
import i1401 from 'kraken-wallet-cryptoicons/src/ship.svg';
import i1402 from 'kraken-wallet-cryptoicons/src/shping.svg';
import i1403 from 'kraken-wallet-cryptoicons/src/shroom.svg';
import i1404 from 'kraken-wallet-cryptoicons/src/shr.svg';
import i1405 from 'kraken-wallet-cryptoicons/src/shx.svg';
import i1406 from 'kraken-wallet-cryptoicons/src/sia.svg';
import i1407 from 'kraken-wallet-cryptoicons/src/sib.svg';
import i1408 from 'kraken-wallet-cryptoicons/src/silo.svg';
import i1409 from 'kraken-wallet-cryptoicons/src/si.svg';
import i1410 from 'kraken-wallet-cryptoicons/src/skey.svg';
import i1411 from 'kraken-wallet-cryptoicons/src/skl.svg';
import i1412 from 'kraken-wallet-cryptoicons/src/sku.svg';
import i1413 from 'kraken-wallet-cryptoicons/src/sky.svg';
import i1414 from 'kraken-wallet-cryptoicons/src/sld.svg';
import i1415 from 'kraken-wallet-cryptoicons/src/slerf.svg';
import i1416 from 'kraken-wallet-cryptoicons/src/slim.svg';
import i1417 from 'kraken-wallet-cryptoicons/src/slink.svg';
import i1418 from 'kraken-wallet-cryptoicons/src/slp.svg';
import i1419 from 'kraken-wallet-cryptoicons/src/slr.svg';
import i1420 from 'kraken-wallet-cryptoicons/src/sls.svg';
import i1421 from 'kraken-wallet-cryptoicons/src/slt.svg';
import i1422 from 'kraken-wallet-cryptoicons/src/smart.svg';
import i1423 from 'kraken-wallet-cryptoicons/src/smog.svg';
import i1424 from 'kraken-wallet-cryptoicons/src/smurfcat.svg';
import i1425 from 'kraken-wallet-cryptoicons/src/snail.svg';
import i1426 from 'kraken-wallet-cryptoicons/src/snc.svg';
import i1427 from 'kraken-wallet-cryptoicons/src/sngls.svg';
import i1428 from 'kraken-wallet-cryptoicons/src/snm.svg';
import i1429 from 'kraken-wallet-cryptoicons/src/snow.svg';
import i1430 from 'kraken-wallet-cryptoicons/src/snt.svg';
import i1431 from 'kraken-wallet-cryptoicons/src/sntv.svg';
import i1432 from 'kraken-wallet-cryptoicons/src/snx.svg';
import i1433 from 'kraken-wallet-cryptoicons/src/sny.svg';
import i1434 from 'kraken-wallet-cryptoicons/src/soc.svg';
import i1435 from 'kraken-wallet-cryptoicons/src/solama.svg';
import i1436 from 'kraken-wallet-cryptoicons/src/solid.svg';
import i1437 from 'kraken-wallet-cryptoicons/src/solo.svg';
import i1438 from 'kraken-wallet-cryptoicons/src/solr.svg';
import i1439 from 'kraken-wallet-cryptoicons/src/sol.svg';
import i1440 from 'kraken-wallet-cryptoicons/src/solve.svg';
import i1441 from 'kraken-wallet-cryptoicons/src/sos.svg';
import i1442 from 'kraken-wallet-cryptoicons/src/soul.svg';
import i1443 from 'kraken-wallet-cryptoicons/src/sov.svg';
import i1444 from 'kraken-wallet-cryptoicons/src/spank.svg';
import i1445 from 'kraken-wallet-cryptoicons/src/sparta.svg';
import i1446 from 'kraken-wallet-cryptoicons/src/spell.svg';
import i1447 from 'kraken-wallet-cryptoicons/src/sphr.svg';
import i1448 from 'kraken-wallet-cryptoicons/src/sphtx.svg';
import i1449 from 'kraken-wallet-cryptoicons/src/spike.svg';
import i1450 from 'kraken-wallet-cryptoicons/src/spi.svg';
import i1451 from 'kraken-wallet-cryptoicons/src/spk.svg';
import i1452 from 'kraken-wallet-cryptoicons/src/spnd.svg';
import i1453 from 'kraken-wallet-cryptoicons/src/spn.svg';
import i1454 from 'kraken-wallet-cryptoicons/src/spr.svg';
import i1455 from 'kraken-wallet-cryptoicons/src/srm.svg';
import i1456 from 'kraken-wallet-cryptoicons/src/srn.svg';
import i1457 from 'kraken-wallet-cryptoicons/src/s.svg';
import i1458 from 'kraken-wallet-cryptoicons/src/ssv.svg';
import i1459 from 'kraken-wallet-cryptoicons/src/stake.svg';
import i1460 from 'kraken-wallet-cryptoicons/src/stak.svg';
import i1461 from 'kraken-wallet-cryptoicons/src/stan.svg';
import i1462 from 'kraken-wallet-cryptoicons/src/starly.svg';
import i1463 from 'kraken-wallet-cryptoicons/src/start.svg';
import i1464 from 'kraken-wallet-cryptoicons/src/stc.svg';
import i1465 from 'kraken-wallet-cryptoicons/src/steem.svg';
import i1466 from 'kraken-wallet-cryptoicons/src/step.svg';
import i1467 from 'kraken-wallet-cryptoicons/src/steth-1.svg';
import i1468 from 'kraken-wallet-cryptoicons/src/steth.svg';
import i1469 from 'kraken-wallet-cryptoicons/src/stg.svg';
import i1470 from 'kraken-wallet-cryptoicons/src/stkaave.svg';
import i1471 from 'kraken-wallet-cryptoicons/src/stklyra.svg';
import i1472 from 'kraken-wallet-cryptoicons/src/stmatic.svg';
import i1473 from 'kraken-wallet-cryptoicons/src/stmx.svg';
import i1474 from 'kraken-wallet-cryptoicons/src/stnd.svg';
import i1475 from 'kraken-wallet-cryptoicons/src/storj.svg';
import i1476 from 'kraken-wallet-cryptoicons/src/storm.svg';
import i1477 from 'kraken-wallet-cryptoicons/src/stpt.svg';
import i1478 from 'kraken-wallet-cryptoicons/src/stq.svg';
import i1479 from 'kraken-wallet-cryptoicons/src/strat.svg';
import i1480 from 'kraken-wallet-cryptoicons/src/strax.svg';
import i1481 from 'kraken-wallet-cryptoicons/src/strk.svg';
import i1482 from 'kraken-wallet-cryptoicons/src/strong.svg';
import i1483 from 'kraken-wallet-cryptoicons/src/stx.svg';
import i1484 from 'kraken-wallet-cryptoicons/src/stz.svg';
import i1485 from 'kraken-wallet-cryptoicons/src/sub.svg';
import i1486 from 'kraken-wallet-cryptoicons/src/sui.svg';
import i1487 from 'kraken-wallet-cryptoicons/src/suku.svg';
import i1488 from 'kraken-wallet-cryptoicons/src/sumo.svg';
import i1489 from 'kraken-wallet-cryptoicons/src/sun.svg';
import i1490 from 'kraken-wallet-cryptoicons/src/super.svg';
import i1491 from 'kraken-wallet-cryptoicons/src/suqa.svg';
import i1492 from 'kraken-wallet-cryptoicons/src/sure.svg';
import i1493 from 'kraken-wallet-cryptoicons/src/surv.svg';
import i1494 from 'kraken-wallet-cryptoicons/src/susd.svg';
import i1495 from 'kraken-wallet-cryptoicons/src/sushi.svg';
import i1496 from 'kraken-wallet-cryptoicons/src/suter.svg';
import i1497 from 'kraken-wallet-cryptoicons/src/swap.svg';
import i1498 from 'kraken-wallet-cryptoicons/src/swash.svg';
import i1499 from 'kraken-wallet-cryptoicons/src/sweat.svg';
import i1500 from 'kraken-wallet-cryptoicons/src/swingby.svg';
import i1501 from 'kraken-wallet-cryptoicons/src/swp.svg';
import i1502 from 'kraken-wallet-cryptoicons/src/swrv.svg';
import i1503 from 'kraken-wallet-cryptoicons/src/swth.svg';
import i1504 from 'kraken-wallet-cryptoicons/src/swt.svg';
import i1505 from 'kraken-wallet-cryptoicons/src/sxdt.svg';
import i1506 from 'kraken-wallet-cryptoicons/src/sxp.svg';
import i1507 from 'kraken-wallet-cryptoicons/src/sylo.svg';
import i1508 from 'kraken-wallet-cryptoicons/src/syn.svg';
import i1509 from 'kraken-wallet-cryptoicons/src/synth.svg';
import i1510 from 'kraken-wallet-cryptoicons/src/synx.svg';
import i1511 from 'kraken-wallet-cryptoicons/src/sys.svg';
import i1512 from 'kraken-wallet-cryptoicons/src/taas.svg';
import i1513 from 'kraken-wallet-cryptoicons/src/tara.svg';
import i1514 from 'kraken-wallet-cryptoicons/src/tau.svg';
import i1515 from 'kraken-wallet-cryptoicons/src/tbtc.svg';
import i1516 from 'kraken-wallet-cryptoicons/src/tbx.svg';
import i1517 from 'kraken-wallet-cryptoicons/src/tch.svg';
import i1518 from 'kraken-wallet-cryptoicons/src/tcp.svg';
import i1519 from 'kraken-wallet-cryptoicons/src/tct.svg';
import i1520 from 'kraken-wallet-cryptoicons/src/tel.svg';
import i1521 from 'kraken-wallet-cryptoicons/src/ten.svg';
import i1522 from 'kraken-wallet-cryptoicons/src/tera.svg';
import i1523 from 'kraken-wallet-cryptoicons/src/tern.svg';
import i1524 from 'kraken-wallet-cryptoicons/src/tfl.svg';
import i1525 from 'kraken-wallet-cryptoicons/src/tfuel.svg';
import i1526 from 'kraken-wallet-cryptoicons/src/thales.svg';
import i1527 from 'kraken-wallet-cryptoicons/src/thc.svg';
import i1528 from 'kraken-wallet-cryptoicons/src/thedao.svg';
import i1529 from 'kraken-wallet-cryptoicons/src/theta.svg';
import i1530 from 'kraken-wallet-cryptoicons/src/thr.svg';
import i1531 from 'kraken-wallet-cryptoicons/src/tia.svg';
import i1532 from 'kraken-wallet-cryptoicons/src/tidal.svg';
import i1533 from 'kraken-wallet-cryptoicons/src/time.svg';
import i1534 from 'kraken-wallet-cryptoicons/src/tio.svg';
import i1535 from 'kraken-wallet-cryptoicons/src/titan.svg';
import i1536 from 'kraken-wallet-cryptoicons/src/tix.svg';
import i1537 from 'kraken-wallet-cryptoicons/src/tkn.svg';
import i1538 from 'kraken-wallet-cryptoicons/src/tko.svg';
import i1539 from 'kraken-wallet-cryptoicons/src/tks.svg';
import i1540 from 'kraken-wallet-cryptoicons/src/tky.svg';
import i1541 from 'kraken-wallet-cryptoicons/src/tlm.svg';
import i1542 from 'kraken-wallet-cryptoicons/src/tlos.svg';
import i1543 from 'kraken-wallet-cryptoicons/src/tnb.svg';
import i1544 from 'kraken-wallet-cryptoicons/src/tnc.svg';
import i1545 from 'kraken-wallet-cryptoicons/src/tnd.svg';
import i1546 from 'kraken-wallet-cryptoicons/src/tnt.svg';
import i1547 from 'kraken-wallet-cryptoicons/src/toby.svg';
import i1548 from 'kraken-wallet-cryptoicons/src/toke.svg';
import i1549 from 'kraken-wallet-cryptoicons/src/toko.svg';
import i1550 from 'kraken-wallet-cryptoicons/src/tomb.svg';
import i1551 from 'kraken-wallet-cryptoicons/src/tomi.svg';
import i1552 from 'kraken-wallet-cryptoicons/src/tomo.svg';
import i1553 from 'kraken-wallet-cryptoicons/src/tonic.svg';
import i1554 from 'kraken-wallet-cryptoicons/src/ton.svg';
import i1555 from 'kraken-wallet-cryptoicons/src/torn.svg';
import i1556 from 'kraken-wallet-cryptoicons/src/tor.svg';
import i1557 from 'kraken-wallet-cryptoicons/src/toshi.svg';
import i1558 from 'kraken-wallet-cryptoicons/src/tower.svg';
import i1559 from 'kraken-wallet-cryptoicons/src/tox.svg';
import i1560 from 'kraken-wallet-cryptoicons/src/tpay.svg';
import i1561 from 'kraken-wallet-cryptoicons/src/trac.svg';
import i1562 from 'kraken-wallet-cryptoicons/src/trade.svg';
import i1563 from 'kraken-wallet-cryptoicons/src/tra.svg';
import i1564 from 'kraken-wallet-cryptoicons/src/trb.svg';
import i1565 from 'kraken-wallet-cryptoicons/src/tremp.svg';
import i1566 from 'kraken-wallet-cryptoicons/src/trias.svg';
import i1567 from 'kraken-wallet-cryptoicons/src/tribe.svg';
import i1568 from 'kraken-wallet-cryptoicons/src/trig.svg';
import i1569 from 'kraken-wallet-cryptoicons/src/troy.svg';
import i1570 from 'kraken-wallet-cryptoicons/src/trst.svg';
import i1571 from 'kraken-wallet-cryptoicons/src/trtl.svg';
import i1572 from 'kraken-wallet-cryptoicons/src/trump.svg';
import i1573 from 'kraken-wallet-cryptoicons/src/tru.svg';
import i1574 from 'kraken-wallet-cryptoicons/src/trvl.svg';
import i1575 from 'kraken-wallet-cryptoicons/src/trx.svg';
import i1576 from 'kraken-wallet-cryptoicons/src/tryb.svg';
import i1577 from 'kraken-wallet-cryptoicons/src/try.svg';
import i1578 from 'kraken-wallet-cryptoicons/src/t.svg';
import i1579 from 'kraken-wallet-cryptoicons/src/ttc.svg';
import i1580 from 'kraken-wallet-cryptoicons/src/tt.svg';
import i1581 from 'kraken-wallet-cryptoicons/src/ttt.svg';
import i1582 from 'kraken-wallet-cryptoicons/src/tube.svg';
import i1583 from 'kraken-wallet-cryptoicons/src/tur.svg';
import i1584 from 'kraken-wallet-cryptoicons/src/tusd.svg';
import i1585 from 'kraken-wallet-cryptoicons/src/tvk.svg';
import i1586 from 'kraken-wallet-cryptoicons/src/twt.svg';
import i1587 from 'kraken-wallet-cryptoicons/src/txa.svg';
import i1588 from 'kraken-wallet-cryptoicons/src/tybg.svg';
import i1589 from 'kraken-wallet-cryptoicons/src/tyzen.svg';
import i1590 from 'kraken-wallet-cryptoicons/src/tzc.svg';
import i1591 from 'kraken-wallet-cryptoicons/src/ubi.svg';
import i1592 from 'kraken-wallet-cryptoicons/src/ubq.svg';
import i1593 from 'kraken-wallet-cryptoicons/src/ubsn.svg';
import i1594 from 'kraken-wallet-cryptoicons/src/ubt.svg';
import i1595 from 'kraken-wallet-cryptoicons/src/ubx.svg';
import i1596 from 'kraken-wallet-cryptoicons/src/ubxt.svg';
import i1597 from 'kraken-wallet-cryptoicons/src/udoo.svg';
import i1598 from 'kraken-wallet-cryptoicons/src/ufo.svg';
import i1599 from 'kraken-wallet-cryptoicons/src/uft.svg';
import i1600 from 'kraken-wallet-cryptoicons/src/ukg.svg';
import i1601 from 'kraken-wallet-cryptoicons/src/ult.svg';
import i1602 from 'kraken-wallet-cryptoicons/src/uma.svg';
import i1603 from 'kraken-wallet-cryptoicons/src/umb.svg';
import i1604 from 'kraken-wallet-cryptoicons/src/umee.svg';
import i1605 from 'kraken-wallet-cryptoicons/src/unb.svg';
import i1606 from 'kraken-wallet-cryptoicons/src/uncx.svg';
import i1607 from 'kraken-wallet-cryptoicons/src/unfi.svg';
import i1608 from 'kraken-wallet-cryptoicons/src/unic.svg';
import i1609 from 'kraken-wallet-cryptoicons/src/unidaieth.svg';
import i1610 from 'kraken-wallet-cryptoicons/src/unilendeth.svg';
import i1611 from 'kraken-wallet-cryptoicons/src/unilinketh.svg';
import i1612 from 'kraken-wallet-cryptoicons/src/unimkreth.svg';
import i1613 from 'kraken-wallet-cryptoicons/src/uniqo.svg';
import i1614 from 'kraken-wallet-cryptoicons/src/unisetheth.svg';
import i1615 from 'kraken-wallet-cryptoicons/src/uni.svg';
import i1616 from 'kraken-wallet-cryptoicons/src/uniusdceth.svg';
import i1617 from 'kraken-wallet-cryptoicons/src/unn.svg';
import i1618 from 'kraken-wallet-cryptoicons/src/uno.svg';
import i1619 from 'kraken-wallet-cryptoicons/src/uos.svg';
import i1620 from 'kraken-wallet-cryptoicons/src/upi.svg';
import i1621 from 'kraken-wallet-cryptoicons/src/upp.svg';
import i1622 from 'kraken-wallet-cryptoicons/src/up.svg';
import i1623 from 'kraken-wallet-cryptoicons/src/uqc.svg';
import i1624 from 'kraken-wallet-cryptoicons/src/usdce.svg';
import i1625 from 'kraken-wallet-cryptoicons/src/usdc.svg';
import i1626 from 'kraken-wallet-cryptoicons/src/usdd.svg';
import i1627 from 'kraken-wallet-cryptoicons/src/usdj.svg';
import i1628 from 'kraken-wallet-cryptoicons/src/usdn.svg';
import i1629 from 'kraken-wallet-cryptoicons/src/usdp.svg';
import i1630 from 'kraken-wallet-cryptoicons/src/usds.svg';
import i1631 from 'kraken-wallet-cryptoicons/src/usd+.svg';
import i1632 from 'kraken-wallet-cryptoicons/src/usd.svg';
import i1633 from 'kraken-wallet-cryptoicons/src/usdt.svg';
import i1634 from 'kraken-wallet-cryptoicons/src/ustc.svg';
import i1635 from 'kraken-wallet-cryptoicons/src/ust.svg';
import i1636 from 'kraken-wallet-cryptoicons/src/usx.svg';
import i1637 from 'kraken-wallet-cryptoicons/src/utk.svg';
import i1638 from 'kraken-wallet-cryptoicons/src/ut.svg';
import i1639 from 'kraken-wallet-cryptoicons/src/uuu.svg';
import i1640 from 'kraken-wallet-cryptoicons/src/vader.svg';
import i1641 from 'kraken-wallet-cryptoicons/src/vai.svg';
import i1642 from 'kraken-wallet-cryptoicons/src/value.svg';
import i1643 from 'kraken-wallet-cryptoicons/src/veed.svg';
import i1644 from 'kraken-wallet-cryptoicons/src/vee.svg';
import i1645 from 'kraken-wallet-cryptoicons/src/vega.svg';
import i1646 from 'kraken-wallet-cryptoicons/src/veil.svg';
import i1647 from 'kraken-wallet-cryptoicons/src/vekwenta.svg';
import i1648 from 'kraken-wallet-cryptoicons/src/vela.svg';
import i1649 from 'kraken-wallet-cryptoicons/src/velo.svg';
import i1650 from 'kraken-wallet-cryptoicons/src/vemp.svg';
import i1651 from 'kraken-wallet-cryptoicons/src/ven.svg';
import i1652 from 'kraken-wallet-cryptoicons/src/veri.svg';
import i1653 from 'kraken-wallet-cryptoicons/src/vest.svg';
import i1654 from 'kraken-wallet-cryptoicons/src/vet.svg';
import i1655 from 'kraken-wallet-cryptoicons/src/vgx.svg';
import i1656 from 'kraken-wallet-cryptoicons/src/via.svg';
import i1657 from 'kraken-wallet-cryptoicons/src/vibe.svg';
import i1658 from 'kraken-wallet-cryptoicons/src/vib.svg';
import i1659 from 'kraken-wallet-cryptoicons/src/vid.svg';
import i1660 from 'kraken-wallet-cryptoicons/src/vidt.svg';
import i1661 from 'kraken-wallet-cryptoicons/src/vikky.svg';
import i1662 from 'kraken-wallet-cryptoicons/src/vina.svg';
import i1663 from 'kraken-wallet-cryptoicons/src/vin.svg';
import i1664 from 'kraken-wallet-cryptoicons/src/vita.svg';
import i1665 from 'kraken-wallet-cryptoicons/src/vite.svg';
import i1666 from 'kraken-wallet-cryptoicons/src/viu.svg';
import i1667 from 'kraken-wallet-cryptoicons/src/vix.svg';
import i1668 from 'kraken-wallet-cryptoicons/src/vlx.svg';
import i1669 from 'kraken-wallet-cryptoicons/src/vnx.svg';
import i1670 from 'kraken-wallet-cryptoicons/src/vol.svg';
import i1671 from 'kraken-wallet-cryptoicons/src/voxel.svg';
import i1672 from 'kraken-wallet-cryptoicons/src/vra.svg';
import i1673 from 'kraken-wallet-cryptoicons/src/vrc.svg';
import i1674 from 'kraken-wallet-cryptoicons/src/vrm.svg';
import i1675 from 'kraken-wallet-cryptoicons/src/vrsc.svg';
import i1676 from 'kraken-wallet-cryptoicons/src/vrs.svg';
import i1677 from 'kraken-wallet-cryptoicons/src/vr.svg';
import i1678 from 'kraken-wallet-cryptoicons/src/vrt.svg';
import i1679 from 'kraken-wallet-cryptoicons/src/vsp.svg';
import i1680 from 'kraken-wallet-cryptoicons/src/vsys.svg';
import i1681 from 'kraken-wallet-cryptoicons/src/vtc.svg';
import i1682 from 'kraken-wallet-cryptoicons/src/vtho.svg';
import i1683 from 'kraken-wallet-cryptoicons/src/vtr.svg';
import i1684 from 'kraken-wallet-cryptoicons/src/vvs.svg';
import i1685 from 'kraken-wallet-cryptoicons/src/vxv.svg';
import i1686 from 'kraken-wallet-cryptoicons/src/wabi.svg';
import i1687 from 'kraken-wallet-cryptoicons/src/wan.svg';
import i1688 from 'kraken-wallet-cryptoicons/src/warp.svg';
import i1689 from 'kraken-wallet-cryptoicons/src/wassie.svg';
import i1690 from 'kraken-wallet-cryptoicons/src/wavax.svg';
import i1691 from 'kraken-wallet-cryptoicons/src/waves.svg';
import i1692 from 'kraken-wallet-cryptoicons/src/waxp.svg';
import i1693 from 'kraken-wallet-cryptoicons/src/wax.svg';
import i1694 from 'kraken-wallet-cryptoicons/src/wbnb.svg';
import i1695 from 'kraken-wallet-cryptoicons/src/wbtc.svg';
import i1696 from 'kraken-wallet-cryptoicons/src/wct.svg';
import i1697 from 'kraken-wallet-cryptoicons/src/web.svg';
import i1698 from 'kraken-wallet-cryptoicons/src/wemix.svg';
import i1699 from 'kraken-wallet-cryptoicons/src/wen.svg';
import i1700 from 'kraken-wallet-cryptoicons/src/west.svg';
import i1701 from 'kraken-wallet-cryptoicons/src/weth.svg';
import i1702 from 'kraken-wallet-cryptoicons/src/wexpoly.svg';
import i1703 from 'kraken-wallet-cryptoicons/src/wftm.svg';
import i1704 from 'kraken-wallet-cryptoicons/src/wgro.svg';
import i1705 from 'kraken-wallet-cryptoicons/src/wgr.svg';
import i1706 from 'kraken-wallet-cryptoicons/src/whale.svg';
import i1707 from 'kraken-wallet-cryptoicons/src/whoren.svg';
import i1708 from 'kraken-wallet-cryptoicons/src/wib.svg';
import i1709 from 'kraken-wallet-cryptoicons/src/wicc.svg';
import i1710 from 'kraken-wallet-cryptoicons/src/wif-1.svg';
import i1711 from 'kraken-wallet-cryptoicons/src/wild.svg';
import i1712 from 'kraken-wallet-cryptoicons/src/wings.svg';
import i1713 from 'kraken-wallet-cryptoicons/src/wing.svg';
import i1714 from 'kraken-wallet-cryptoicons/src/win.svg';
import i1715 from 'kraken-wallet-cryptoicons/src/wis.svg';
import i1716 from 'kraken-wallet-cryptoicons/src/wld.svg';
import i1717 from 'kraken-wallet-cryptoicons/src/wmatic.svg';
import i1718 from 'kraken-wallet-cryptoicons/src/wmp.svg';
import i1719 from 'kraken-wallet-cryptoicons/src/wmt.svg';
import i1720 from 'kraken-wallet-cryptoicons/src/wndr.svg';
import i1721 from 'kraken-wallet-cryptoicons/src/wnxm.svg';
import i1722 from 'kraken-wallet-cryptoicons/src/wom.svg';
import i1723 from 'kraken-wallet-cryptoicons/src/wone.svg';
import i1724 from 'kraken-wallet-cryptoicons/src/woo.svg';
import i1725 from 'kraken-wallet-cryptoicons/src/wopenx.svg';
import i1726 from 'kraken-wallet-cryptoicons/src/wowow.svg';
import i1727 from 'kraken-wallet-cryptoicons/src/wozx.svg';
import i1728 from 'kraken-wallet-cryptoicons/src/wpr.svg';
import i1729 from 'kraken-wallet-cryptoicons/src/wrx.svg';
import i1730 from 'kraken-wallet-cryptoicons/src/wsienna.svg';
import i1731 from 'kraken-wallet-cryptoicons/src/wsteth.svg';
import i1732 from 'kraken-wallet-cryptoicons/src/wtbt.svg';
import i1733 from 'kraken-wallet-cryptoicons/src/wtc.svg';
import i1734 from 'kraken-wallet-cryptoicons/src/wxt.svg';
import i1735 from 'kraken-wallet-cryptoicons/src/x2y2.svg';
import i1736 from 'kraken-wallet-cryptoicons/src/xai.svg';
import i1737 from 'kraken-wallet-cryptoicons/src/xas.svg';
import i1738 from 'kraken-wallet-cryptoicons/src/xaut.svg';
import i1739 from 'kraken-wallet-cryptoicons/src/xava.svg';
import i1740 from 'kraken-wallet-cryptoicons/src/xbc.svg';
import i1741 from 'kraken-wallet-cryptoicons/src/xby.svg';
import i1742 from 'kraken-wallet-cryptoicons/src/xcad.svg';
import i1743 from 'kraken-wallet-cryptoicons/src/xchf.svg';
import i1744 from 'kraken-wallet-cryptoicons/src/xch.svg';
import i1745 from 'kraken-wallet-cryptoicons/src/xcm.svg';
import i1746 from 'kraken-wallet-cryptoicons/src/xcn.svg';
import i1747 from 'kraken-wallet-cryptoicons/src/xcp.svg';
import i1748 from 'kraken-wallet-cryptoicons/src/xcur.svg';
import i1749 from 'kraken-wallet-cryptoicons/src/xdata.svg';
import i1750 from 'kraken-wallet-cryptoicons/src/xdb.svg';
import i1751 from 'kraken-wallet-cryptoicons/src/xdc.svg';
import i1752 from 'kraken-wallet-cryptoicons/src/xdfi.svg';
import i1753 from 'kraken-wallet-cryptoicons/src/xdn.svg';
import i1754 from 'kraken-wallet-cryptoicons/src/xec.svg';
import i1755 from 'kraken-wallet-cryptoicons/src/xed.svg';
import i1756 from 'kraken-wallet-cryptoicons/src/xel.svg';
import i1757 from 'kraken-wallet-cryptoicons/src/xem.svg';
import i1758 from 'kraken-wallet-cryptoicons/src/xft.svg';
import i1759 from 'kraken-wallet-cryptoicons/src/xhv.svg';
import i1760 from 'kraken-wallet-cryptoicons/src/xido.svg';
import i1761 from 'kraken-wallet-cryptoicons/src/xin.svg';
import i1762 from 'kraken-wallet-cryptoicons/src/xlm.svg';
import i1763 from 'kraken-wallet-cryptoicons/src/xln.svg';
import i1764 from 'kraken-wallet-cryptoicons/src/xlq.svg';
import i1765 from 'kraken-wallet-cryptoicons/src/xmark.svg';
import i1766 from 'kraken-wallet-cryptoicons/src/xmg.svg';
import i1767 from 'kraken-wallet-cryptoicons/src/xmr.svg';
import i1768 from 'kraken-wallet-cryptoicons/src/xmt.svg';
import i1769 from 'kraken-wallet-cryptoicons/src/xmx.svg';
import i1770 from 'kraken-wallet-cryptoicons/src/xmy.svg';
import i1771 from 'kraken-wallet-cryptoicons/src/xnc.svg';
import i1772 from 'kraken-wallet-cryptoicons/src/xnk.svg';
import i1773 from 'kraken-wallet-cryptoicons/src/xnl.svg';
import i1774 from 'kraken-wallet-cryptoicons/src/xno.svg';
import i1775 from 'kraken-wallet-cryptoicons/src/xns.svg';
import i1776 from 'kraken-wallet-cryptoicons/src/xor.svg';
import i1777 from 'kraken-wallet-cryptoicons/src/xpa.svg';
import i1778 from 'kraken-wallet-cryptoicons/src/xpm.svg';
import i1779 from 'kraken-wallet-cryptoicons/src/xpr.svg';
import i1780 from 'kraken-wallet-cryptoicons/src/xprt.svg';
import i1781 from 'kraken-wallet-cryptoicons/src/xp.svg';
import i1782 from 'kraken-wallet-cryptoicons/src/xrd.svg';
import i1783 from 'kraken-wallet-cryptoicons/src/xrp.svg';
import i1784 from 'kraken-wallet-cryptoicons/src/xrt.svg';
import i1785 from 'kraken-wallet-cryptoicons/src/xsg.svg';
import i1786 from 'kraken-wallet-cryptoicons/src/xsn.svg';
import i1787 from 'kraken-wallet-cryptoicons/src/xsr.svg';
import i1788 from 'kraken-wallet-cryptoicons/src/xst.svg';
import i1789 from 'kraken-wallet-cryptoicons/src/xsushi.svg';
import i1790 from 'kraken-wallet-cryptoicons/src/xtag.svg';
import i1791 from 'kraken-wallet-cryptoicons/src/xtm.svg';
import i1792 from 'kraken-wallet-cryptoicons/src/xtp.svg';
import i1793 from 'kraken-wallet-cryptoicons/src/xt.svg';
import i1794 from 'kraken-wallet-cryptoicons/src/xtz.svg';
import i1795 from 'kraken-wallet-cryptoicons/src/xuc.svg';
import i1796 from 'kraken-wallet-cryptoicons/src/xvc.svg';
import i1797 from 'kraken-wallet-cryptoicons/src/xvg.svg';
import i1798 from 'kraken-wallet-cryptoicons/src/xvs.svg';
import i1799 from 'kraken-wallet-cryptoicons/src/xwc.svg';
import i1800 from 'kraken-wallet-cryptoicons/src/xym.svg';
import i1801 from 'kraken-wallet-cryptoicons/src/xyo.svg';
import i1802 from 'kraken-wallet-cryptoicons/src/xyz.svg';
import i1803 from 'kraken-wallet-cryptoicons/src/xzc.svg';
import i1804 from 'kraken-wallet-cryptoicons/src/yfdai.svg';
import i1805 from 'kraken-wallet-cryptoicons/src/yfii.svg';
import i1806 from 'kraken-wallet-cryptoicons/src/yfi.svg';
import i1807 from 'kraken-wallet-cryptoicons/src/ygg.svg';
import i1808 from 'kraken-wallet-cryptoicons/src/yld.svg';
import i1809 from 'kraken-wallet-cryptoicons/src/yop.svg';
import i1810 from 'kraken-wallet-cryptoicons/src/youc.svg';
import i1811 from 'kraken-wallet-cryptoicons/src/yoyo.svg';
import i1812 from 'kraken-wallet-cryptoicons/src/yoyow.svg';
import i1813 from 'kraken-wallet-cryptoicons/src/zai.svg';
import i1814 from 'kraken-wallet-cryptoicons/src/zar.svg';
import i1815 from 'kraken-wallet-cryptoicons/src/zb.svg';
import i1816 from 'kraken-wallet-cryptoicons/src/zcl.svg';
import i1817 from 'kraken-wallet-cryptoicons/src/zco.svg';
import i1818 from 'kraken-wallet-cryptoicons/src/zcx.svg';
import i1819 from 'kraken-wallet-cryptoicons/src/zec.svg';
import i1820 from 'kraken-wallet-cryptoicons/src/zee.svg';
import i1821 from 'kraken-wallet-cryptoicons/src/zel.svg';
import i1822 from 'kraken-wallet-cryptoicons/src/zen.svg';
import i1823 from 'kraken-wallet-cryptoicons/src/zeon.svg';
import i1824 from 'kraken-wallet-cryptoicons/src/zeta.svg';
import i1825 from 'kraken-wallet-cryptoicons/src/zil.svg';
import i1826 from 'kraken-wallet-cryptoicons/src/zip.svg';
import i1827 from 'kraken-wallet-cryptoicons/src/zks.svg';
import i1828 from 'kraken-wallet-cryptoicons/src/zkt.svg';
import i1829 from 'kraken-wallet-cryptoicons/src/zlw.svg';
import i1830 from 'kraken-wallet-cryptoicons/src/znn.svg';
import i1831 from 'kraken-wallet-cryptoicons/src/zort.svg';
import i1832 from 'kraken-wallet-cryptoicons/src/zpay.svg';
import i1833 from 'kraken-wallet-cryptoicons/src/zrx.svg';
import i1834 from 'kraken-wallet-cryptoicons/src/zusd.svg';

export const icons = {
  '$based': i1,
  '$degen': i2,
  '$mfer': i3,
  '$myro': i4,
  '$read': i5,
  '$snow': i6,
  '$wif': i7,
  '00': i8,
  '0xbtc': i9,
  '1000sats': i10,
  '10set': i11,
  '1earth': i12,
  '1flr': i13,
  '1inch': i14,
  '1st': i15,
  '2crz': i16,
  '2give': i17,
  '2key': i18,
  'aaave': i19,
  'aave': i20,
  'abat': i21,
  'abbc': i22,
  'abt': i23,
  'abusd': i24,
  'ac3': i25,
  'aca': i26,
  'acat': i27,
  'ace': i28,
  'ach': i29,
  'acm': i30,
  'act': i31,
  'adai': i32,
  'ada': i33,
  'adb': i34,
  'adk': i35,
  'ads': i36,
  'adt': i37,
  'adx': i38,
  'aenj': i39,
  'aeon': i40,
  'aergo': i41,
  'aero': i42,
  'ae': i43,
  'aethreth': i44,
  'aeth': i45,
  'aethweth': i46,
  'ageur': i47,
  'agi': i48,
  'agix': i49,
  'agld': i50,
  'agrs': i51,
  'aidoge': i52,
  'aid': i53,
  'aion': i54,
  'aioz': i55,
  'air': i56,
  'ai': i57,
  'ait': i58,
  'aknc': i59,
  'akro': i60,
  'akt': i61,
  'albt': i62,
  'alcx': i63,
  'alend': i64,
  'aleph': i65,
  'aleth': i66,
  'algo': i67,
  'alice': i68,
  'alink': i69,
  'alis': i70,
  'ali': i71,
  'alpaca': i72,
  'alpha': i73,
  'alpine': i74,
  'alt': i75,
  'alusd': i76,
  'alx': i77,
  'amana': i78,
  'amb': i79,
  'amino': i80,
  'amkr': i81,
  'amkt': i82,
  'amlt': i83,
  'ampl': i84,
  'amp': i85,
  'anc': i86,
  'anj': i87,
  'ankr': i88,
  'ant': i89,
  'aoa': i90,
  'apein': i91,
  'ape': i92,
  'aph': i93,
  'api3': i94,
  'apl': i95,
  'appc': i96,
  'apt': i97,
  'apw': i98,
  'apx': i99,
  'apy': i100,
  'arb': i101,
  'ardr': i102,
  'aren': i103,
  'arep': i104,
  'arix': i105,
  'arker': i106,
  'arkm': i107,
  'ark': i108,
  'armor': i109,
  'arn': i110,
  'arnx': i111,
  'aro': i112,
  'arpa': i113,
  'arrr': i114,
  'ar': i115,
  'arx': i116,
  'asafe': i117,
  'asd': i118,
  'ash': i119,
  'asm': i120,
  'asnx': i121,
  'asr': i122,
  'asta': i123,
  'astro': i124,
  'astr': i125,
  'ast': i126,
  'asusd': i127,
  'atlas': i128,
  'atmi': i129,
  'atm': i130,
  'atom': i131,
  'atri': i132,
  'atusd': i133,
  'auc': i134,
  'auction': i135,
  'audio': i136,
  'aunidaieth': i137,
  'aunilendeth': i138,
  'aunilinketh': i139,
  'aunimkreth': i140,
  'aunisetheth': i141,
  'auni': i142,
  'auniusdceth': i143,
  'aura': i144,
  'aurora': i145,
  'aur': i146,
  'aury': i147,
  'ausdc': i148,
  'ausdt': i149,
  'auto': i150,
  'ava': i151,
  'avax': i152,
  'avt': i153,
  'awbtc': i154,
  'awc': i155,
  'aweth': i156,
  'axc': i157,
  'axel': i158,
  'axl': i159,
  'axpr': i160,
  'axp': i161,
  'axs': i162,
  'ayfi': i163,
  'azero': i164,
  'azrx': i165,
  'babydoge': i166,
  'bac': i167,
  'badger': i168,
  'bake': i169,
  'bal': i170,
  'bam': i171,
  'band': i172,
  'bao': i173,
  'bar': i174,
  'basic': i175,
  'bat': i176,
  'baxa': i177,
  'bax': i178,
  'bay': i179,
  'bbk': i180,
  'bbr': i181,
  'bcc': i182,
  'bcd': i183,
  'bchabc': i184,
  'bcha': i185,
  'bch': i186,
  'bchsv': i187,
  'bcn': i188,
  'bco': i189,
  'bcpt': i190,
  'bcy': i191,
  'beam': i192,
  'bela': i193,
  'bel': i194,
  'belt': i195,
  'bepro': i196,
  'best': i197,
  'beta': i198,
  'beth': i199,
  'bfc': i200,
  'bf': i201,
  'bgb': i202,
  'bico': i203,
  'bifi': i204,
  'bit-2': i205,
  'bitb': i206,
  'bitcny': i207,
  'bitcoin': i208,
  'bits': i209,
  'bit': i210,
  'bix': i211,
  'bkx': i212,
  'blank': i213,
  'blast': i214,
  'bld': i215,
  'blitz': i216,
  'blk': i217,
  'block': i218,
  'bloc': i219,
  'blok': i220,
  'blt': i221,
  'blue': i222,
  'blur': i223,
  'blz': i224,
  'bmc': i225,
  'bmda': i226,
  'bmon': i227,
  'bmx': i228,
  'bnana': i229,
  'bnb': i230,
  'bnc': i231,
  'bnk': i232,
  'bns': i233,
  'bnt': i234,
  'bnty': i235,
  'bnx': i236,
  'boa': i237,
  'bobo': i238,
  'bob': i239,
  'boden': i240,
  'bolt': i241,
  'bome': i242,
  'bond-2': i243,
  'bondly': i244,
  'bond': i245,
  'bone': i246,
  'bonk': i247,
  'boo': i248,
  'bora': i249,
  'boson': i250,
  'bos': i251,
  'bot': i252,
  'botto': i253,
  'botx': i254,
  'box': i255,
  'bpt': i256,
  'bqx': i257,
  'brd': i258,
  'brett': i259,
  'brg': i260,
  'brise': i261,
  'briun': i262,
  'brk': i263,
  'brx': i264,
  'brz': i265,
  'bsd': i266,
  'bst': i267,
  'bsv': i268,
  'bsw': i269,
  'btcb': i270,
  'btcd': i271,
  'btcp': i272,
  'btcst': i273,
  'btc++': i274,
  'btc': i275,
  'btcz': i276,
  'btdx': i277,
  'btg': i278,
  'btm': i279,
  'btmx': i280,
  'bto': i281,
  'btrst': i282,
  'btr': i283,
  'bts': i284,
  'btt': i285,
  'btu': i286,
  'btx': i287,
  'bunny': i288,
  'burger': i289,
  'burp': i290,
  'burst': i291,
  'busd': i292,
  'bu': i293,
  'bux': i294,
  'buy': i295,
  'bwt': i296,
  'byc': i297,
  'bznt': i298,
  'bzrx': i299,
  'bz': i300,
  'c20': i301,
  'c98': i302,
  'cag': i303,
  'cake': i304,
  'canto': i305,
  'capp': i306,
  'cap': i307,
  'card': i308,
  'carr': i309,
  'car': i310,
  'cas': i311,
  'cbat': i312,
  'cbc': i313,
  'cbeth': i314,
  'cbt': i315,
  'cccx': i316,
  'cce': i317,
  'ccxx': i318,
  'cdai': i319,
  'cdt': i320,
  'celo': i321,
  'celr': i322,
  'cel': i323,
  'cennz': i324,
  'cere': i325,
  'ceth': i326,
  'cet': i327,
  'cfg': i328,
  'cfi': i329,
  'cfx': i330,
  'cgg': i331,
  'chain': i332,
  'chai': i333,
  'chat': i334,
  'chcb': i335,
  'chess': i336,
  'chi': i337,
  'chmb': i338,
  'cho': i339,
  'chp': i340,
  'chr': i341,
  'chsb': i342,
  'chz': i343,
  'cirus': i344,
  'city': i345,
  'cix100': i346,
  'ckb': i347,
  'clam': i348,
  'clh': i349,
  'cloak': i350,
  'clo': i351,
  'clout': i352,
  'club': i353,
  'clv': i354,
  'cmct': i355,
  'cmm': i356,
  'cmt': i357,
  'cnc': i358,
  'cnd': i359,
  'cnx': i360,
  'cob': i361,
  'cocn': i362,
  'cocos': i363,
  'coc': i364,
  'cofi': i365,
  'coinye': i366,
  'colx': i367,
  'combo': i368,
  'comb': i369,
  'comp': i370,
  'cone': i371,
  'coni': i372,
  'core': i373,
  'corgiai': i374,
  'cosm': i375,
  'cos': i376,
  'cost': i377,
  'coti': i378,
  'coval': i379,
  'cova': i380,
  'cover': i381,
  'cov': i382,
  'cpc': i383,
  'cpool': i384,
  'cpx': i385,
  'cqt': i386,
  'cra': i387,
  'crb': i388,
  'crd': i389,
  'cream': i390,
  'credi': i391,
  'cred': i392,
  'crep': i393,
  'cre': i394,
  'cro': i395,
  'crpt': i396,
  'crts': i397,
  'crunch': i398,
  'cru': i399,
  'crv': i400,
  'crw': i401,
  'csai': i402,
  'csc': i403,
  'cspr': i404,
  'csp': i405,
  'cs': i406,
  'ctc': i407,
  'cti': i408,
  'ctk': i409,
  'ctsi': i410,
  'ctxc': i411,
  'ctx': i412,
  'cube': i413,
  'cudos': i414,
  'cult': i415,
  'cusdc': i416,
  'cusd': i417,
  'cusdt-1': i418,
  'cusdt': i419,
  'cvc': i420,
  'cvp': i421,
  'cv': i422,
  'cvt': i423,
  'cvx': i424,
  'cwar': i425,
  'cwbtc': i426,
  'cweb': i427,
  'cws': i428,
  'cxo': i429,
  'cyber': i430,
  'czrx': i431,
  'dacc': i432,
  'dadi': i433,
  'dafi': i434,
  'dag': i435,
  'dai': i436,
  'dao': i437,
  'dappt': i438,
  'dappx': i439,
  'dar': i440,
  'dasc': i441,
  'dash': i442,
  'data': i443,
  'dat': i444,
  'datx': i445,
  'dawn': i446,
  'dbc': i447,
  'dcc': i448,
  'dcn': i449,
  'dcr': i450,
  'dct': i451,
  'ddd': i452,
  'ddj': i453,
  'ddx': i454,
  'defi': i455,
  'degen': i456,
  'dego': i457,
  'dent': i458,
  'dep': i459,
  'derc': i460,
  'deri': i461,
  'dero': i462,
  'deso': i463,
  'dexe': i464,
  'dfi': i465,
  'df': i466,
  'dft': i467,
  'dfyn': i468,
  'dgb': i469,
  'dgd': i470,
  'dgtx': i471,
  'dht': i472,
  'dia': i473,
  'dinero': i474,
  'dino': i475,
  'divi': i476,
  'dlt': i477,
  'dmd': i478,
  'dmg': i479,
  'dmtr': i480,
  'dmt': i481,
  'dnt': i482,
  'dock': i483,
  'dodo': i484,
  'doge': i485,
  'doginme': i486,
  'dog': i487,
  'dojo': i488,
  'dola': i489,
  'dome': i490,
  'dora': i491,
  'dorkl': i492,
  'dor': i493,
  'dot': i494,
  'dpi': i495,
  'dpr': i496,
  'dpx': i497,
  'drc': i498,
  'dreams': i499,
  'drep': i500,
  'drgn': i501,
  'drg': i502,
  'drop': i503,
  'drs': i504,
  'drt': i505,
  'dsla': i506,
  'dta': i507,
  'dth': i508,
  'dtr': i509,
  'dtx': i510,
  'dusk': i511,
  'dvf': i512,
  'dvi': i513,
  'dvpn': i514,
  'dxd': i515,
  'dx': i516,
  'dxt': i517,
  'dydx': i518,
  'dym': i519,
  'dyn': i520,
  'dypc': i521,
  'easy': i522,
  'ebst': i523,
  'eca': i524,
  'eco': i525,
  'edge': i526,
  'edg': i527,
  'edn': i528,
  'edo': i529,
  'edu': i530,
  'efi': i531,
  'efl': i532,
  'efx': i533,
  'egc': i534,
  'egld': i535,
  'egr': i536,
  'egt': i537,
  'ekg': i538,
  'ekt': i539,
  'elan': i540,
  'ela': i541,
  'elec': i542,
  'elf': i543,
  'elg': i544,
  'ella': i545,
  'elon': i546,
  'emc2': i547,
  'emc': i548,
  'eng': i549,
  'enj': i550,
  'enq': i551,
  'enrg': i552,
  'ens': i553,
  'eosc': i554,
  'eosdac': i555,
  'eos': i556,
  'epic': i557,
  'epik': i558,
  'epx': i559,
  'eqb': i560,
  'eqx': i561,
  'eqz': i562,
  'erc': i563,
  'erg': i564,
  'ern': i565,
  'ersdl': i566,
  'ertha': i567,
  'esbc': i568,
  'esd': i569,
  'esp': i570,
  'ess': i571,
  'etc': i572,
  'eth2': i573,
  'eth2 v2': i574,
  'etha': i575,
  'ethdydx': i576,
  'etho': i577,
  'eth': i578,
  'ethw': i579,
  'etn': i580,
  'etp': i581,
  'etz': i582,
  'eum': i583,
  'euroc': i584,
  'eurs': i585,
  'eur': i586,
  'eurt': i587,
  'evmos': i588,
  'evx': i589,
  'ewt': i590,
  'excl': i591,
  'exp': i592,
  'exrd': i593,
  'exrn': i594,
  'exy': i595,
  'ezy': i596,
  'fab': i597,
  'face': i598,
  'falcon': i599,
  'farm': i600,
  'fcon': i601,
  'fct': i602,
  'fdusd': i603,
  'fear': i604,
  'feed': i605,
  'fei': i606,
  'fet': i607,
  'fft': i608,
  'fida': i609,
  'filda': i610,
  'fil': i611,
  'fio': i612,
  'firo': i613,
  'fis': i614,
  'fitfi': i615,
  'fjc': i616,
  'fkx': i617,
  'flame': i618,
  'flash': i619,
  'flc': i620,
  'fldc': i621,
  'flex': i622,
  'flm': i623,
  'floki': i624,
  'flo': i625,
  'flow': i626,
  'flr': i627,
  'flux': i628,
  'fly': i629,
  'foam': i630,
  'fold': i631,
  'forestplus': i632,
  'form': i633,
  'for': i634,
  'forta': i635,
  'forth': i636,
  'fota': i637,
  'fox': i638,
  'fpis': i639,
  'fpi': i640,
  'frame': i641,
  'frax': i642,
  'fren': i643,
  'frm': i644,
  'front': i645,
  'frr': i646,
  'frxeth': i647,
  'fsn': i648,
  'fst': i649,
  'ftc': i650,
  'ftg': i651,
  'ftm': i652,
  'ft': i653,
  'ftt': i654,
  'fuel': i655,
  'fun': i656,
  'fuse': i657,
  'fxc': i658,
  'fxs': i659,
  'fx': i660,
  'fxt': i661,
  'gafi': i662,
  'gala': i663,
  'gal': i664,
  'gamb': i665,
  'gamee': i666,
  'game': i667,
  'gam': i668,
  'gari': i669,
  'gas': i670,
  'gbg': i671,
  'gbp': i672,
  'gbx': i673,
  'gbyte': i674,
  'gcr': i675,
  'gdc': i676,
  'gear': i677,
  'geeq': i678,
  'geist': i679,
  'gem': i680,
  'gens': i681,
  'gen': i682,
  'geo': i683,
  'gfi': i684,
  'gf': i685,
  'ggc': i686,
  'ggg': i687,
  'gho': i688,
  'ghst': i689,
  'ghx': i690,
  'gin': i691,
  'giv': i692,
  'glch': i693,
  'gld': i694,
  'glmr': i695,
  'glm': i696,
  'glq': i697,
  'gls': i698,
  'gmee': i699,
  'gmt': i700,
  'gmx': i701,
  'gno': i702,
  'gns': i703,
  'gnt': i704,
  'gnx': i705,
  'goc': i706,
  'gom2': i707,
  'go': i708,
  'got': i709,
  'govi': i710,
  'grail': i711,
  'grc': i712,
  'grg': i713,
  'grin': i714,
  'grow': i715,
  'grs': i716,
  'grt': i717,
  'gsc': i718,
  'gspi': i719,
  'gst': i720,
  'gswap': i721,
  'gtc': i722,
  'gto': i723,
  'gt': i724,
  'guild': i725,
  'gup': i726,
  'gusd': i727,
  'gvt': i728,
  'gxc': i729,
  'gxs': i730,
  'gyen': i731,
  'h3ro3s': i732,
  'hair': i733,
  'hai': i734,
  'haka': i735,
  'hakka': i736,
  'hanep': i737,
  'han': i738,
  'hapi': i739,
  'harambe': i740,
  'hard': i741,
  'hash': i742,
  'hav': i743,
  'hbar': i744,
  'hbb': i745,
  'hbtc': i746,
  'hc': i747,
  'heart': i748,
  'hedg': i749,
  'hegic': i750,
  'hero': i751,
  'her': i752,
  'hex': i753,
  'hft': i754,
  'hifi': i755,
  'high': i756,
  'hive': i757,
  'hmq': i758,
  'hmt': i759,
  'hns': i760,
  'hnt': i761,
  'hobbes': i762,
  'hod': i763,
  'hoge': i764,
  'hook': i765,
  'hop': i766,
  'hord': i767,
  'hotcross': i768,
  'hot': i769,
  'hot-x': i770,
  'hpb': i771,
  'hpo': i772,
  'hpp': i773,
  'hsr': i774,
  'html': i775,
  'htr': i776,
  'ht': i777,
  'hum': i778,
  'hunt': i779,
  'husd': i780,
  'hush': i781,
  'hvn': i782,
  'hxro': i783,
  'hydro': i784,
  'hyn': i785,
  'hyve': i786,
  'hzn': i787,
  'ibat': i788,
  'ice': i789,
  'icn': i790,
  'icp': i791,
  'icx': i792,
  'idai': i793,
  'idea': i794,
  'idex': i795,
  'id': i796,
  'ieth': i797,
  'ifarm': i798,
  'ignis': i799,
  'ihf': i800,
  'iknc': i801,
  'ila': i802,
  'ilink': i803,
  'ilv': i804,
  'imx': i805,
  'inb': i806,
  'incnt': i807,
  'index': i808,
  'infx': i809,
  'inj': i810,
  'ink': i811,
  'ino': i812,
  'ins': i813,
  'instar': i814,
  'insure': i815,
  'inv': i816,
  'ioc': i817,
  'ioi': i818,
  'ion': i819,
  'iop': i820,
  'iost': i821,
  'iota': i822,
  'iot': i823,
  'iotx': i824,
  'iq-2': i825,
  'iq50': i826,
  'iqn': i827,
  'iq': i828,
  'irep': i829,
  'iris': i830,
  'isp': i831,
  'ist': i832,
  'isusd': i833,
  'itc': i834,
  'iusdc': i835,
  'iwbtc': i836,
  'ixs': i837,
  'ixt': i838,
  'izrx': i839,
  'jar': i840,
  'jasmy': i841,
  'jeur': i842,
  'jitosol': i843,
  'jlp': i844,
  'jnt': i845,
  'joe': i846,
  'jrt': i847,
  'jst': i848,
  'jto': i849,
  'juno': i850,
  'jup': i851,
  'juv': i852,
  'kai': i853,
  'karma': i854,
  'kar': i855,
  'kas': i856,
  'kat': i857,
  'kava': i858,
  'kbc': i859,
  'kbtc': i860,
  'kcs': i861,
  'kda': i862,
  'kdon': i863,
  'keep': i864,
  'keycat': i865,
  'key': i866,
  'kick': i867,
  'kilt': i868,
  'kin': i869,
  'kint': i870,
  'kira': i871,
  'kiro': i872,
  'klay': i873,
  'klv': i874,
  'kma': i875,
  'kmd': i876,
  'knc': i877,
  'kndc': i878,
  'kok': i879,
  'kol': i880,
  'kono': i881,
  'kore': i882,
  'kp3r': i883,
  'krb': i884,
  'krl': i885,
  'krw': i886,
  'ksm': i887,
  'ksp': i888,
  'ktn': i889,
  'kub': i890,
  'kyl': i891,
  'lab': i892,
  'lace': i893,
  'ladys': i894,
  'lamb': i895,
  'land': i896,
  'la': i897,
  'layer': i898,
  'lazio': i899,
  'lba': i900,
  'lbc': i901,
  'lcc': i902,
  'lcdot': i903,
  'lcx': i904,
  'ldo': i905,
  'lend': i906,
  'leo': i907,
  'lever': i908,
  'lien': i909,
  'like': i910,
  'lina': i911,
  'linea': i912,
  'link': i913,
  'lith': i914,
  'lit': i915,
  'lkk': i916,
  'lky': i917,
  'lmc': i918,
  'lnchx': i919,
  'ln': i920,
  'locg': i921,
  'loc': i922,
  'lode': i923,
  'loka': i924,
  'loki': i925,
  'lon': i926,
  'looks': i927,
  'loom': i928,
  'love': i929,
  'lpf': i930,
  'lpool': i931,
  'lpt': i932,
  'lqd': i933,
  'lqty': i934,
  'lrc': i935,
  'lrg': i936,
  'lsk': i937,
  'lss': i938,
  'ltc': i939,
  'lto': i940,
  'ltx': i941,
  'luca': i942,
  'luna': i943,
  'lunc': i944,
  'lun': i945,
  'lusd': i946,
  'lxt': i947,
  'lym': i948,
  'lyxe': i949,
  'maapl': i950,
  'maga': i951,
  'magic': i952,
  'maha': i953,
  'maid': i954,
  'mai': i955,
  'maki': i956,
  'mana': i957,
  'man': i958,
  'manta': i959,
  'maps': i960,
  'map': i961,
  'marsh': i962,
  'mask': i963,
  'mass': i964,
  'math': i965,
  'matic': i966,
  'maticx': i967,
  'matter': i968,
  'mbc': i969,
  'mbl': i970,
  'mbox': i971,
  'mb': i972,
  'mcb': i973,
  'mco2': i974,
  'mco': i975,
  'mc': i976,
  'mcx': i977,
  'mdao': i978,
  'mda': i979,
  'mds': i980,
  'mdt': i981,
  'mdx': i982,
  'med': i983,
  'medx': i984,
  'meetone': i985,
  'meme': i986,
  'mem': i987,
  'mer': i988,
  'metano': i989,
  'meta': i990,
  'metis': i991,
  'met': i992,
  'mew': i993,
  'mex': i994,
  'mfg': i995,
  'mft': i996,
  'mhc': i997,
  'mimatic': i998,
  'mim': i999,
  'mina': i1000,
  'miota': i1001,
  'mir': i1002,
  'mith': i1003,
  'mitx': i1004,
  'mjt': i1005,
  'mkr': i1006,
  'mlb': i1007,
  'mlk': i1008,
  'mln': i1009,
  'mmt': i1010,
  'mmxn': i1011,
  'mnde': i1012,
  'mnet': i1013,
  'mngo': i1014,
  'mns': i1015,
  'mnst': i1016,
  'mntl': i1017,
  'mnt': i1018,
  'mnw': i1019,
  'moac': i1020,
  'mob': i1021,
  'mochi': i1022,
  'modefi': i1023,
  'mod': i1024,
  'mof': i1025,
  'mog': i1026,
  'mom': i1027,
  'mona': i1028,
  'moni': i1029,
  'moon': i1030,
  'mot': i1031,
  'movez': i1032,
  'movr': i1033,
  'mph': i1034,
  'mpl': i1035,
  'msol': i1036,
  'msr': i1037,
  'mswap': i1038,
  'mta': i1039,
  'mtc': i1040,
  'mth': i1041,
  'mtl': i1042,
  'mtn': i1043,
  'mtrg': i1044,
  'mts': i1045,
  'mtv': i1046,
  'mue': i1047,
  'multi': i1048,
  'musd': i1049,
  'music': i1050,
  'mvc': i1051,
  'mvl': i1052,
  'mvp': i1053,
  'mwat': i1054,
  'mwc': i1055,
  'mxc': i1056,
  'mxm': i1057,
  'mx': i1058,
  'mxw': i1059,
  'myb': i1060,
  'myro': i1061,
  'myst': i1062,
  'naka': i1063,
  'nano': i1064,
  'nas': i1065,
  'nav': i1066,
  'nbs': i1067,
  'nbt': i1068,
  'ncash': i1069,
  'nct': i1070,
  'ndau': i1071,
  'near': i1072,
  'nebl': i1073,
  'nec': i1074,
  'nem': i1075,
  'neon': i1076,
  'neos': i1077,
  'neo': i1078,
  'neox': i1079,
  'nest': i1080,
  'neu': i1081,
  'new': i1082,
  'nexo': i1083,
  'nex': i1084,
  'nexxo': i1085,
  'nftb': i1086,
  'nft': i1087,
  'nftx': i1088,
  'ngc': i1089,
  'ngm': i1090,
  'nif': i1091,
  'nim': i1092,
  'niox': i1093,
  'nix': i1094,
  'nkn': i1095,
  'nlc2': i1096,
  'nlg': i1097,
  'nmc': i1098,
  'nmr': i1099,
  'noia': i1100,
  'nord': i1101,
  'normie': i1102,
  'normilio': i1103,
  'nox': i1104,
  'nper': i1105,
  'npxs': i1106,
  'nrg': i1107,
  'nrve': i1108,
  'nrv': i1109,
  'ntic': i1110,
  'ntrn': i1111,
  'ntvrk': i1112,
  'nuls': i1113,
  'num': i1114,
  'nusd': i1115,
  'nu': i1116,
  'nwc': i1117,
  'nxm': i1118,
  'nxs': i1119,
  'nxt': i1120,
  'nye': i1121,
  'nym': i1122,
  'oag': i1123,
  'oak': i1124,
  'oax': i1125,
  'ocean': i1126,
  'ocn': i1127,
  'oddz': i1128,
  'ode': i1129,
  'ogn': i1130,
  'ogo': i1131,
  'og': i1132,
  'ohm': i1133,
  'oil': i1134,
  'okb': i1135,
  'oks': i1136,
  'ok': i1137,
  'olt': i1138,
  'omg': i1139,
  'omni': i1140,
  'om': i1141,
  'ondo': i1142,
  'one': i1143,
  'ong': i1144,
  'onion': i1145,
  'onston': i1146,
  'ont': i1147,
  'ooe': i1148,
  'ooki': i1149,
  'oot': i1150,
  'open': i1151,
  'opium': i1152,
  'opq': i1153,
  'opsec': i1154,
  'ops': i1155,
  'op': i1156,
  'opul': i1157,
  'opx': i1158,
  'orai': i1159,
  'orbs': i1160,
  'orca': i1161,
  'orcat': i1162,
  'orc': i1163,
  'ordi': i1164,
  'orn': i1165,
  'osmo': i1166,
  'ost': i1167,
  'ouro': i1168,
  'ousd': i1169,
  'ovc': i1170,
  'oxen': i1171,
  'oxt': i1172,
  'oxy': i1173,
  'pac': i1174,
  'paint': i1175,
  'pai': i1176,
  'palm': i1177,
  'pal': i1178,
  'paper': i1179,
  'par': i1180,
  'part': i1181,
  'pasc': i1182,
  'paxg': i1183,
  'pax': i1184,
  'pay': i1185,
  'payx': i1186,
  'pazzi': i1187,
  'pbirb': i1188,
  'pbr': i1189,
  'pbtc': i1190,
  'pbx': i1191,
  'pchu': i1192,
  'pcx': i1193,
  'pdex': i1194,
  'pearl': i1195,
  'peas': i1196,
  'pel': i1197,
  'pendle': i1198,
  'pepe': i1199,
  'perl': i1200,
  'perp': i1201,
  'pha': i1202,
  'phb': i1203,
  'phnx': i1204,
  'phtk': i1205,
  'phx': i1206,
  'pickle': i1207,
  'pink': i1208,
  'pip': i1209,
  'pirl': i1210,
  'pivx': i1211,
  'pkb': i1212,
  'pla': i1213,
  'play': i1214,
  'plbt': i1215,
  'plc': i1216,
  'pldai': i1217,
  'plgr': i1218,
  'plr': i1219,
  'pltc': i1220,
  'plt': i1221,
  'plusdc': i1222,
  'plu': i1223,
  'pma': i1224,
  'pmgt': i1225,
  'pmon': i1226,
  'png': i1227,
  'pnk': i1228,
  'pnt': i1229,
  'poa': i1230,
  'poe': i1231,
  'pokt': i1232,
  'polc': i1233,
  'polis': i1234,
  'polk': i1235,
  'pols': i1236,
  'pol': i1237,
  'polx': i1238,
  'poly-2': i1239,
  'poly': i1240,
  'polyx': i1241,
  'pom': i1242,
  'pond': i1243,
  'ponke': i1244,
  'pont': i1245,
  'pool': i1246,
  'popcat': i1247,
  'pop': i1248,
  'pork': i1249,
  'porto': i1250,
  'potnoy': i1251,
  'pot': i1252,
  'power': i1253,
  'powr': i1254,
  'ppay': i1255,
  'ppc': i1256,
  'ppp': i1257,
  'ppt': i1258,
  'premia': i1259,
  'pre': i1260,
  'prime': i1261,
  'prl': i1262,
  'prom': i1263,
  'props': i1264,
  'pros': i1265,
  'pro': i1266,
  'prq': i1267,
  'psg': i1268,
  'psp': i1269,
  'pstake': i1270,
  'pst': i1271,
  'ptc': i1272,
  'ptoy': i1273,
  'pundix': i1274,
  'pups': i1275,
  'pyr': i1276,
  'pyth': i1277,
  'pyusd': i1278,
  'qash': i1279,
  'qbit': i1280,
  'qi': i1281,
  'qkc': i1282,
  'qlc': i1283,
  'qnt': i1284,
  'qqq': i1285,
  'qrdo': i1286,
  'qrl': i1287,
  'qsp': i1288,
  'qtum': i1289,
  'quick': i1290,
  'qun': i1291,
  'qwark': i1292,
  'raca': i1293,
  'radar': i1294,
  'rads': i1295,
  'rad': i1296,
  'rae': i1297,
  'rai': i1298,
  'ramp': i1299,
  'ranker': i1300,
  'rare': i1301,
  'rari': i1302,
  'ray': i1303,
  'rbc': i1304,
  'rbn': i1305,
  'rbtc': i1306,
  'rby': i1307,
  'rcn': i1308,
  'rdd': i1309,
  'rdn': i1310,
  'rdnt': i1311,
  'reap': i1312,
  'reef': i1313,
  'rei': i1314,
  'renbtc': i1315,
  'render': i1316,
  'renfil': i1317,
  'ren': i1318,
  'rep': i1319,
  'req': i1320,
  'reth': i1321,
  'revo': i1322,
  'rev': i1323,
  'revu': i1324,
  'revv': i1325,
  'rfox': i1326,
  'rfr': i1327,
  'rfuel': i1328,
  'rfwsteth': i1329,
  'rgt': i1330,
  'rhoc': i1331,
  'rif': i1332,
  'rise': i1333,
  'rlc': i1334,
  'rly': i1335,
  'rmark': i1336,
  'rndr': i1337,
  'road': i1338,
  'roar': i1339,
  'ron': i1340,
  'roobee': i1341,
  'rook': i1342,
  'rose': i1343,
  'rosn': i1344,
  'route': i1345,
  'rpl': i1346,
  'rpx': i1347,
  'rsr': i1348,
  'r': i1349,
  'rsv': i1350,
  'ruff': i1351,
  'rune': i1352,
  'rvn': i1353,
  'rvr': i1354,
  'ryo': i1355,
  'safemoon': i1356,
  'sai': i1357,
  'saito': i1358,
  'salt': i1359,
  'samo': i1360,
  'sand': i1361,
  'san': i1362,
  'santos': i1363,
  'sapp': i1364,
  'sar': i1365,
  'savax': i1366,
  'sbd': i1367,
  'sbr': i1368,
  'sbtc': i1369,
  'sclp': i1370,
  'scrl': i1371,
  'scrt': i1372,
  'sc': i1373,
  'sdao': i1374,
  'sdl': i1375,
  'sdn': i1376,
  'sd': i1377,
  'sdt': i1378,
  'seele': i1379,
  'sefi': i1380,
  'sei': i1381,
  'sem': i1382,
  'senso': i1383,
  'seq': i1384,
  'sero': i1385,
  'seth2': i1386,
  'seth': i1387,
  'sfi': i1388,
  'sfm': i1389,
  'sfp-2': i1390,
  'sfp': i1391,
  'sfrxeth': i1392,
  'sfund': i1393,
  'sgb': i1394,
  'sha': i1395,
  'shdw': i1396,
  'shft': i1397,
  'shib': i1398,
  'shift': i1399,
  'shill': i1400,
  'ship': i1401,
  'shping': i1402,
  'shroom': i1403,
  'shr': i1404,
  'shx': i1405,
  'sia': i1406,
  'sib': i1407,
  'silo': i1408,
  'si': i1409,
  'skey': i1410,
  'skl': i1411,
  'sku': i1412,
  'sky': i1413,
  'sld': i1414,
  'slerf': i1415,
  'slim': i1416,
  'slink': i1417,
  'slp': i1418,
  'slr': i1419,
  'sls': i1420,
  'slt': i1421,
  'smart': i1422,
  'smog': i1423,
  'smurfcat': i1424,
  'snail': i1425,
  'snc': i1426,
  'sngls': i1427,
  'snm': i1428,
  'snow': i1429,
  'snt': i1430,
  'sntv': i1431,
  'snx': i1432,
  'sny': i1433,
  'soc': i1434,
  'solama': i1435,
  'solid': i1436,
  'solo': i1437,
  'solr': i1438,
  'sol': i1439,
  'solve': i1440,
  'sos': i1441,
  'soul': i1442,
  'sov': i1443,
  'spank': i1444,
  'sparta': i1445,
  'spell': i1446,
  'sphr': i1447,
  'sphtx': i1448,
  'spike': i1449,
  'spi': i1450,
  'spk': i1451,
  'spnd': i1452,
  'spn': i1453,
  'spr': i1454,
  'srm': i1455,
  'srn': i1456,
  's': i1457,
  'ssv': i1458,
  'stake': i1459,
  'stak': i1460,
  'stan': i1461,
  'starly': i1462,
  'start': i1463,
  'stc': i1464,
  'steem': i1465,
  'step': i1466,
  'steth-1': i1467,
  'steth': i1468,
  'stg': i1469,
  'stkaave': i1470,
  'stklyra': i1471,
  'stmatic': i1472,
  'stmx': i1473,
  'stnd': i1474,
  'storj': i1475,
  'storm': i1476,
  'stpt': i1477,
  'stq': i1478,
  'strat': i1479,
  'strax': i1480,
  'strk': i1481,
  'strong': i1482,
  'stx': i1483,
  'stz': i1484,
  'sub': i1485,
  'sui': i1486,
  'suku': i1487,
  'sumo': i1488,
  'sun': i1489,
  'super': i1490,
  'suqa': i1491,
  'sure': i1492,
  'surv': i1493,
  'susd': i1494,
  'sushi': i1495,
  'suter': i1496,
  'swap': i1497,
  'swash': i1498,
  'sweat': i1499,
  'swingby': i1500,
  'swp': i1501,
  'swrv': i1502,
  'swth': i1503,
  'swt': i1504,
  'sxdt': i1505,
  'sxp': i1506,
  'sylo': i1507,
  'syn': i1508,
  'synth': i1509,
  'synx': i1510,
  'sys': i1511,
  'taas': i1512,
  'tara': i1513,
  'tau': i1514,
  'tbtc': i1515,
  'tbx': i1516,
  'tch': i1517,
  'tcp': i1518,
  'tct': i1519,
  'tel': i1520,
  'ten': i1521,
  'tera': i1522,
  'tern': i1523,
  'tfl': i1524,
  'tfuel': i1525,
  'thales': i1526,
  'thc': i1527,
  'thedao': i1528,
  'theta': i1529,
  'thr': i1530,
  'tia': i1531,
  'tidal': i1532,
  'time': i1533,
  'tio': i1534,
  'titan': i1535,
  'tix': i1536,
  'tkn': i1537,
  'tko': i1538,
  'tks': i1539,
  'tky': i1540,
  'tlm': i1541,
  'tlos': i1542,
  'tnb': i1543,
  'tnc': i1544,
  'tnd': i1545,
  'tnt': i1546,
  'toby': i1547,
  'toke': i1548,
  'toko': i1549,
  'tomb': i1550,
  'tomi': i1551,
  'tomo': i1552,
  'tonic': i1553,
  'ton': i1554,
  'torn': i1555,
  'tor': i1556,
  'toshi': i1557,
  'tower': i1558,
  'tox': i1559,
  'tpay': i1560,
  'trac': i1561,
  'trade': i1562,
  'tra': i1563,
  'trb': i1564,
  'tremp': i1565,
  'trias': i1566,
  'tribe': i1567,
  'trig': i1568,
  'troy': i1569,
  'trst': i1570,
  'trtl': i1571,
  'trump': i1572,
  'tru': i1573,
  'trvl': i1574,
  'trx': i1575,
  'tryb': i1576,
  'try': i1577,
  't': i1578,
  'ttc': i1579,
  'tt': i1580,
  'ttt': i1581,
  'tube': i1582,
  'tur': i1583,
  'tusd': i1584,
  'tvk': i1585,
  'twt': i1586,
  'txa': i1587,
  'tybg': i1588,
  'tyzen': i1589,
  'tzc': i1590,
  'ubi': i1591,
  'ubq': i1592,
  'ubsn': i1593,
  'ubt': i1594,
  'ubx': i1595,
  'ubxt': i1596,
  'udoo': i1597,
  'ufo': i1598,
  'uft': i1599,
  'ukg': i1600,
  'ult': i1601,
  'uma': i1602,
  'umb': i1603,
  'umee': i1604,
  'unb': i1605,
  'uncx': i1606,
  'unfi': i1607,
  'unic': i1608,
  'unidaieth': i1609,
  'unilendeth': i1610,
  'unilinketh': i1611,
  'unimkreth': i1612,
  'uniqo': i1613,
  'unisetheth': i1614,
  'uni': i1615,
  'uniusdceth': i1616,
  'unn': i1617,
  'uno': i1618,
  'uos': i1619,
  'upi': i1620,
  'upp': i1621,
  'up': i1622,
  'uqc': i1623,
  'usdce': i1624,
  'usdc': i1625,
  'usdd': i1626,
  'usdj': i1627,
  'usdn': i1628,
  'usdp': i1629,
  'usds': i1630,
  'usd+': i1631,
  'usd': i1632,
  'usdt': i1633,
  'ustc': i1634,
  'ust': i1635,
  'usx': i1636,
  'utk': i1637,
  'ut': i1638,
  'uuu': i1639,
  'vader': i1640,
  'vai': i1641,
  'value': i1642,
  'veed': i1643,
  'vee': i1644,
  'vega': i1645,
  'veil': i1646,
  'vekwenta': i1647,
  'vela': i1648,
  'velo': i1649,
  'vemp': i1650,
  'ven': i1651,
  'veri': i1652,
  'vest': i1653,
  'vet': i1654,
  'vgx': i1655,
  'via': i1656,
  'vibe': i1657,
  'vib': i1658,
  'vid': i1659,
  'vidt': i1660,
  'vikky': i1661,
  'vina': i1662,
  'vin': i1663,
  'vita': i1664,
  'vite': i1665,
  'viu': i1666,
  'vix': i1667,
  'vlx': i1668,
  'vnx': i1669,
  'vol': i1670,
  'voxel': i1671,
  'vra': i1672,
  'vrc': i1673,
  'vrm': i1674,
  'vrsc': i1675,
  'vrs': i1676,
  'vr': i1677,
  'vrt': i1678,
  'vsp': i1679,
  'vsys': i1680,
  'vtc': i1681,
  'vtho': i1682,
  'vtr': i1683,
  'vvs': i1684,
  'vxv': i1685,
  'wabi': i1686,
  'wan': i1687,
  'warp': i1688,
  'wassie': i1689,
  'wavax': i1690,
  'waves': i1691,
  'waxp': i1692,
  'wax': i1693,
  'wbnb': i1694,
  'wbtc': i1695,
  'wct': i1696,
  'web': i1697,
  'wemix': i1698,
  'wen': i1699,
  'west': i1700,
  'weth': i1701,
  'wexpoly': i1702,
  'wftm': i1703,
  'wgro': i1704,
  'wgr': i1705,
  'whale': i1706,
  'whoren': i1707,
  'wib': i1708,
  'wicc': i1709,
  'wif-1': i1710,
  'wild': i1711,
  'wings': i1712,
  'wing': i1713,
  'win': i1714,
  'wis': i1715,
  'wld': i1716,
  'wmatic': i1717,
  'wmp': i1718,
  'wmt': i1719,
  'wndr': i1720,
  'wnxm': i1721,
  'wom': i1722,
  'wone': i1723,
  'woo': i1724,
  'wopenx': i1725,
  'wowow': i1726,
  'wozx': i1727,
  'wpr': i1728,
  'wrx': i1729,
  'wsienna': i1730,
  'wsteth': i1731,
  'wtbt': i1732,
  'wtc': i1733,
  'wxt': i1734,
  'x2y2': i1735,
  'xai': i1736,
  'xas': i1737,
  'xaut': i1738,
  'xava': i1739,
  'xbc': i1740,
  'xby': i1741,
  'xcad': i1742,
  'xchf': i1743,
  'xch': i1744,
  'xcm': i1745,
  'xcn': i1746,
  'xcp': i1747,
  'xcur': i1748,
  'xdata': i1749,
  'xdb': i1750,
  'xdc': i1751,
  'xdfi': i1752,
  'xdn': i1753,
  'xec': i1754,
  'xed': i1755,
  'xel': i1756,
  'xem': i1757,
  'xft': i1758,
  'xhv': i1759,
  'xido': i1760,
  'xin': i1761,
  'xlm': i1762,
  'xln': i1763,
  'xlq': i1764,
  'xmark': i1765,
  'xmg': i1766,
  'xmr': i1767,
  'xmt': i1768,
  'xmx': i1769,
  'xmy': i1770,
  'xnc': i1771,
  'xnk': i1772,
  'xnl': i1773,
  'xno': i1774,
  'xns': i1775,
  'xor': i1776,
  'xpa': i1777,
  'xpm': i1778,
  'xpr': i1779,
  'xprt': i1780,
  'xp': i1781,
  'xrd': i1782,
  'xrp': i1783,
  'xrt': i1784,
  'xsg': i1785,
  'xsn': i1786,
  'xsr': i1787,
  'xst': i1788,
  'xsushi': i1789,
  'xtag': i1790,
  'xtm': i1791,
  'xtp': i1792,
  'xt': i1793,
  'xtz': i1794,
  'xuc': i1795,
  'xvc': i1796,
  'xvg': i1797,
  'xvs': i1798,
  'xwc': i1799,
  'xym': i1800,
  'xyo': i1801,
  'xyz': i1802,
  'xzc': i1803,
  'yfdai': i1804,
  'yfii': i1805,
  'yfi': i1806,
  'ygg': i1807,
  'yld': i1808,
  'yop': i1809,
  'youc': i1810,
  'yoyo': i1811,
  'yoyow': i1812,
  'zai': i1813,
  'zar': i1814,
  'zb': i1815,
  'zcl': i1816,
  'zco': i1817,
  'zcx': i1818,
  'zec': i1819,
  'zee': i1820,
  'zel': i1821,
  'zen': i1822,
  'zeon': i1823,
  'zeta': i1824,
  'zil': i1825,
  'zip': i1826,
  'zks': i1827,
  'zkt': i1828,
  'zlw': i1829,
  'znn': i1830,
  'zort': i1831,
  'zpay': i1832,
  'zrx': i1833,
  'zusd': i1834,
};

const mapNetworkNameToTokenSymbol: Record<string, string> = {
  arbitrum: 'arb',
  dogecoin: 'doge',
  ethereum: 'eth',
  ethereumTestnetSepolia: 'eth',
  HDsegwitBech32: 'btc',
  optimism: 'op',
  polygon: 'pol',
  solana: 'sol',
  solanaDevnet: 'sol'
};

export const getTokenIconFromNetworkName = (networkName: string): React.FC<SvgProps> | undefined =>
  getTokenIcon(mapNetworkNameToTokenSymbol[networkName] ?? '');

export const getTokenIcon = (symbol: string): React.FC<SvgProps> | undefined => icons[symbol.toLowerCase() as keyof typeof icons];

const backgroundColors = ['#179B93', '#7D46C3', '#C15894', '#C9614A', '#2A9BE5', '#799836', '#C84B69', '#B08F3B', '#56AA64', '#307DA8', '#9F3AAF', '#5140B9'];

export const getTokenIconFallbackProps = memoize((tokenSymbol: string) => {
  const randomBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  return {
    backgroundColor: randomBackgroundColor,
    label: tokenSymbol.slice(0, 4).toUpperCase(),
  };
});
