import React from 'react';
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
import i32 from 'kraken-wallet-cryptoicons/src/ada.svg';
import i33 from 'kraken-wallet-cryptoicons/src/adai.svg';
import i34 from 'kraken-wallet-cryptoicons/src/adb.svg';
import i35 from 'kraken-wallet-cryptoicons/src/adk.svg';
import i36 from 'kraken-wallet-cryptoicons/src/ads.svg';
import i37 from 'kraken-wallet-cryptoicons/src/adt.svg';
import i38 from 'kraken-wallet-cryptoicons/src/adx.svg';
import i39 from 'kraken-wallet-cryptoicons/src/ae.svg';
import i40 from 'kraken-wallet-cryptoicons/src/aenj.svg';
import i41 from 'kraken-wallet-cryptoicons/src/aeon.svg';
import i42 from 'kraken-wallet-cryptoicons/src/aergo.svg';
import i43 from 'kraken-wallet-cryptoicons/src/aero.svg';
import i44 from 'kraken-wallet-cryptoicons/src/aeth.svg';
import i45 from 'kraken-wallet-cryptoicons/src/aethreth.svg';
import i46 from 'kraken-wallet-cryptoicons/src/aethweth.svg';
import i47 from 'kraken-wallet-cryptoicons/src/ageur.svg';
import i48 from 'kraken-wallet-cryptoicons/src/agi.svg';
import i49 from 'kraken-wallet-cryptoicons/src/agix.svg';
import i50 from 'kraken-wallet-cryptoicons/src/agld.svg';
import i51 from 'kraken-wallet-cryptoicons/src/agrs.svg';
import i52 from 'kraken-wallet-cryptoicons/src/ai.svg';
import i53 from 'kraken-wallet-cryptoicons/src/aid.svg';
import i54 from 'kraken-wallet-cryptoicons/src/aidoge.svg';
import i55 from 'kraken-wallet-cryptoicons/src/aion.svg';
import i56 from 'kraken-wallet-cryptoicons/src/aioz.svg';
import i57 from 'kraken-wallet-cryptoicons/src/air.svg';
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
import i68 from 'kraken-wallet-cryptoicons/src/ali.svg';
import i69 from 'kraken-wallet-cryptoicons/src/alice.svg';
import i70 from 'kraken-wallet-cryptoicons/src/alink.svg';
import i71 from 'kraken-wallet-cryptoicons/src/alis.svg';
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
import i84 from 'kraken-wallet-cryptoicons/src/amp.svg';
import i85 from 'kraken-wallet-cryptoicons/src/ampl.svg';
import i86 from 'kraken-wallet-cryptoicons/src/anc.svg';
import i87 from 'kraken-wallet-cryptoicons/src/anj.svg';
import i88 from 'kraken-wallet-cryptoicons/src/ankr.svg';
import i89 from 'kraken-wallet-cryptoicons/src/ant.svg';
import i90 from 'kraken-wallet-cryptoicons/src/aoa.svg';
import i91 from 'kraken-wallet-cryptoicons/src/ape.svg';
import i92 from 'kraken-wallet-cryptoicons/src/apein.svg';
import i93 from 'kraken-wallet-cryptoicons/src/aph.svg';
import i94 from 'kraken-wallet-cryptoicons/src/api3.svg';
import i95 from 'kraken-wallet-cryptoicons/src/apl.svg';
import i96 from 'kraken-wallet-cryptoicons/src/appc.svg';
import i97 from 'kraken-wallet-cryptoicons/src/apt.svg';
import i98 from 'kraken-wallet-cryptoicons/src/apw.svg';
import i99 from 'kraken-wallet-cryptoicons/src/apx.svg';
import i100 from 'kraken-wallet-cryptoicons/src/apy.svg';
import i101 from 'kraken-wallet-cryptoicons/src/ar.svg';
import i102 from 'kraken-wallet-cryptoicons/src/arb.svg';
import i103 from 'kraken-wallet-cryptoicons/src/ardr.svg';
import i104 from 'kraken-wallet-cryptoicons/src/aren.svg';
import i105 from 'kraken-wallet-cryptoicons/src/arep.svg';
import i106 from 'kraken-wallet-cryptoicons/src/arix.svg';
import i107 from 'kraken-wallet-cryptoicons/src/ark.svg';
import i108 from 'kraken-wallet-cryptoicons/src/arker.svg';
import i109 from 'kraken-wallet-cryptoicons/src/arkm.svg';
import i110 from 'kraken-wallet-cryptoicons/src/armor.svg';
import i111 from 'kraken-wallet-cryptoicons/src/arn.svg';
import i112 from 'kraken-wallet-cryptoicons/src/arnx.svg';
import i113 from 'kraken-wallet-cryptoicons/src/aro.svg';
import i114 from 'kraken-wallet-cryptoicons/src/arpa.svg';
import i115 from 'kraken-wallet-cryptoicons/src/arrr.svg';
import i116 from 'kraken-wallet-cryptoicons/src/arx.svg';
import i117 from 'kraken-wallet-cryptoicons/src/asafe.svg';
import i118 from 'kraken-wallet-cryptoicons/src/asd.svg';
import i119 from 'kraken-wallet-cryptoicons/src/ash.svg';
import i120 from 'kraken-wallet-cryptoicons/src/asm.svg';
import i121 from 'kraken-wallet-cryptoicons/src/asnx.svg';
import i122 from 'kraken-wallet-cryptoicons/src/asr.svg';
import i123 from 'kraken-wallet-cryptoicons/src/ast.svg';
import i124 from 'kraken-wallet-cryptoicons/src/asta.svg';
import i125 from 'kraken-wallet-cryptoicons/src/astr.svg';
import i126 from 'kraken-wallet-cryptoicons/src/astro.svg';
import i127 from 'kraken-wallet-cryptoicons/src/asusd.svg';
import i128 from 'kraken-wallet-cryptoicons/src/atlas.svg';
import i129 from 'kraken-wallet-cryptoicons/src/atm.svg';
import i130 from 'kraken-wallet-cryptoicons/src/atmi.svg';
import i131 from 'kraken-wallet-cryptoicons/src/atom.svg';
import i132 from 'kraken-wallet-cryptoicons/src/atri.svg';
import i133 from 'kraken-wallet-cryptoicons/src/atusd.svg';
import i134 from 'kraken-wallet-cryptoicons/src/auc.svg';
import i135 from 'kraken-wallet-cryptoicons/src/auction.svg';
import i136 from 'kraken-wallet-cryptoicons/src/audio.svg';
import i137 from 'kraken-wallet-cryptoicons/src/auni.svg';
import i138 from 'kraken-wallet-cryptoicons/src/aunidaieth.svg';
import i139 from 'kraken-wallet-cryptoicons/src/aunilendeth.svg';
import i140 from 'kraken-wallet-cryptoicons/src/aunilinketh.svg';
import i141 from 'kraken-wallet-cryptoicons/src/aunimkreth.svg';
import i142 from 'kraken-wallet-cryptoicons/src/aunisetheth.svg';
import i143 from 'kraken-wallet-cryptoicons/src/auniusdceth.svg';
import i144 from 'kraken-wallet-cryptoicons/src/aur.svg';
import i145 from 'kraken-wallet-cryptoicons/src/aura.svg';
import i146 from 'kraken-wallet-cryptoicons/src/aurora.svg';
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
import i160 from 'kraken-wallet-cryptoicons/src/axp.svg';
import i161 from 'kraken-wallet-cryptoicons/src/axpr.svg';
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
import i177 from 'kraken-wallet-cryptoicons/src/bax.svg';
import i178 from 'kraken-wallet-cryptoicons/src/baxa.svg';
import i179 from 'kraken-wallet-cryptoicons/src/bay.svg';
import i180 from 'kraken-wallet-cryptoicons/src/bbk.svg';
import i181 from 'kraken-wallet-cryptoicons/src/bbr.svg';
import i182 from 'kraken-wallet-cryptoicons/src/bcc.svg';
import i183 from 'kraken-wallet-cryptoicons/src/bcd.svg';
import i184 from 'kraken-wallet-cryptoicons/src/bch.svg';
import i185 from 'kraken-wallet-cryptoicons/src/bcha.svg';
import i186 from 'kraken-wallet-cryptoicons/src/bchabc.svg';
import i187 from 'kraken-wallet-cryptoicons/src/bchsv.svg';
import i188 from 'kraken-wallet-cryptoicons/src/bcn.svg';
import i189 from 'kraken-wallet-cryptoicons/src/bco.svg';
import i190 from 'kraken-wallet-cryptoicons/src/bcpt.svg';
import i191 from 'kraken-wallet-cryptoicons/src/bcy.svg';
import i192 from 'kraken-wallet-cryptoicons/src/beam.svg';
import i193 from 'kraken-wallet-cryptoicons/src/bel.svg';
import i194 from 'kraken-wallet-cryptoicons/src/bela.svg';
import i195 from 'kraken-wallet-cryptoicons/src/belt.svg';
import i196 from 'kraken-wallet-cryptoicons/src/bepro.svg';
import i197 from 'kraken-wallet-cryptoicons/src/best.svg';
import i198 from 'kraken-wallet-cryptoicons/src/beta.svg';
import i199 from 'kraken-wallet-cryptoicons/src/beth.svg';
import i200 from 'kraken-wallet-cryptoicons/src/bf.svg';
import i201 from 'kraken-wallet-cryptoicons/src/bfc.svg';
import i202 from 'kraken-wallet-cryptoicons/src/bgb.svg';
import i203 from 'kraken-wallet-cryptoicons/src/bico.svg';
import i204 from 'kraken-wallet-cryptoicons/src/bifi.svg';
import i205 from 'kraken-wallet-cryptoicons/src/bit-2.svg';
import i206 from 'kraken-wallet-cryptoicons/src/bit.svg';
import i207 from 'kraken-wallet-cryptoicons/src/bitb.svg';
import i208 from 'kraken-wallet-cryptoicons/src/bitcny.svg';
import i209 from 'kraken-wallet-cryptoicons/src/bitcoin.svg';
import i210 from 'kraken-wallet-cryptoicons/src/bits.svg';
import i211 from 'kraken-wallet-cryptoicons/src/bix.svg';
import i212 from 'kraken-wallet-cryptoicons/src/bkx.svg';
import i213 from 'kraken-wallet-cryptoicons/src/blank.svg';
import i214 from 'kraken-wallet-cryptoicons/src/blast.svg';
import i215 from 'kraken-wallet-cryptoicons/src/bld.svg';
import i216 from 'kraken-wallet-cryptoicons/src/blitz.svg';
import i217 from 'kraken-wallet-cryptoicons/src/blk.svg';
import i218 from 'kraken-wallet-cryptoicons/src/bloc.svg';
import i219 from 'kraken-wallet-cryptoicons/src/block.svg';
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
import i238 from 'kraken-wallet-cryptoicons/src/bob.svg';
import i239 from 'kraken-wallet-cryptoicons/src/bobo.svg';
import i240 from 'kraken-wallet-cryptoicons/src/boden.svg';
import i241 from 'kraken-wallet-cryptoicons/src/bolt.svg';
import i242 from 'kraken-wallet-cryptoicons/src/bome.svg';
import i243 from 'kraken-wallet-cryptoicons/src/bond-2.svg';
import i244 from 'kraken-wallet-cryptoicons/src/bond.svg';
import i245 from 'kraken-wallet-cryptoicons/src/bondly.svg';
import i246 from 'kraken-wallet-cryptoicons/src/bone.svg';
import i247 from 'kraken-wallet-cryptoicons/src/bonk.svg';
import i248 from 'kraken-wallet-cryptoicons/src/boo.svg';
import i249 from 'kraken-wallet-cryptoicons/src/bora.svg';
import i250 from 'kraken-wallet-cryptoicons/src/bos.svg';
import i251 from 'kraken-wallet-cryptoicons/src/boson.svg';
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
import i270 from 'kraken-wallet-cryptoicons/src/btc++.svg';
import i271 from 'kraken-wallet-cryptoicons/src/btc.svg';
import i272 from 'kraken-wallet-cryptoicons/src/btcb.svg';
import i273 from 'kraken-wallet-cryptoicons/src/btcd.svg';
import i274 from 'kraken-wallet-cryptoicons/src/btcp.svg';
import i275 from 'kraken-wallet-cryptoicons/src/btcst.svg';
import i276 from 'kraken-wallet-cryptoicons/src/btcz.svg';
import i277 from 'kraken-wallet-cryptoicons/src/btdx.svg';
import i278 from 'kraken-wallet-cryptoicons/src/btg.svg';
import i279 from 'kraken-wallet-cryptoicons/src/btm.svg';
import i280 from 'kraken-wallet-cryptoicons/src/btmx.svg';
import i281 from 'kraken-wallet-cryptoicons/src/bto.svg';
import i282 from 'kraken-wallet-cryptoicons/src/btr.svg';
import i283 from 'kraken-wallet-cryptoicons/src/btrst.svg';
import i284 from 'kraken-wallet-cryptoicons/src/bts.svg';
import i285 from 'kraken-wallet-cryptoicons/src/btt.svg';
import i286 from 'kraken-wallet-cryptoicons/src/btu.svg';
import i287 from 'kraken-wallet-cryptoicons/src/btx.svg';
import i288 from 'kraken-wallet-cryptoicons/src/bu.svg';
import i289 from 'kraken-wallet-cryptoicons/src/bunny.svg';
import i290 from 'kraken-wallet-cryptoicons/src/burger.svg';
import i291 from 'kraken-wallet-cryptoicons/src/burp.svg';
import i292 from 'kraken-wallet-cryptoicons/src/burst.svg';
import i293 from 'kraken-wallet-cryptoicons/src/busd.svg';
import i294 from 'kraken-wallet-cryptoicons/src/bux.svg';
import i295 from 'kraken-wallet-cryptoicons/src/buy.svg';
import i296 from 'kraken-wallet-cryptoicons/src/bwt.svg';
import i297 from 'kraken-wallet-cryptoicons/src/byc.svg';
import i298 from 'kraken-wallet-cryptoicons/src/bz.svg';
import i299 from 'kraken-wallet-cryptoicons/src/bznt.svg';
import i300 from 'kraken-wallet-cryptoicons/src/bzrx.svg';
import i301 from 'kraken-wallet-cryptoicons/src/c20.svg';
import i302 from 'kraken-wallet-cryptoicons/src/c98.svg';
import i303 from 'kraken-wallet-cryptoicons/src/cag.svg';
import i304 from 'kraken-wallet-cryptoicons/src/cake.svg';
import i305 from 'kraken-wallet-cryptoicons/src/canto.svg';
import i306 from 'kraken-wallet-cryptoicons/src/cap.svg';
import i307 from 'kraken-wallet-cryptoicons/src/capp.svg';
import i308 from 'kraken-wallet-cryptoicons/src/car.svg';
import i309 from 'kraken-wallet-cryptoicons/src/card.svg';
import i310 from 'kraken-wallet-cryptoicons/src/carr.svg';
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
import i321 from 'kraken-wallet-cryptoicons/src/cel.svg';
import i322 from 'kraken-wallet-cryptoicons/src/celo.svg';
import i323 from 'kraken-wallet-cryptoicons/src/celr.svg';
import i324 from 'kraken-wallet-cryptoicons/src/cennz.svg';
import i325 from 'kraken-wallet-cryptoicons/src/cere.svg';
import i326 from 'kraken-wallet-cryptoicons/src/cet.svg';
import i327 from 'kraken-wallet-cryptoicons/src/ceth.svg';
import i328 from 'kraken-wallet-cryptoicons/src/cfg.svg';
import i329 from 'kraken-wallet-cryptoicons/src/cfi.svg';
import i330 from 'kraken-wallet-cryptoicons/src/cfx.svg';
import i331 from 'kraken-wallet-cryptoicons/src/cgg.svg';
import i332 from 'kraken-wallet-cryptoicons/src/chai.svg';
import i333 from 'kraken-wallet-cryptoicons/src/chain.svg';
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
import i350 from 'kraken-wallet-cryptoicons/src/clo.svg';
import i351 from 'kraken-wallet-cryptoicons/src/cloak.svg';
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
import i362 from 'kraken-wallet-cryptoicons/src/coc.svg';
import i363 from 'kraken-wallet-cryptoicons/src/cocn.svg';
import i364 from 'kraken-wallet-cryptoicons/src/cocos.svg';
import i365 from 'kraken-wallet-cryptoicons/src/cofi.svg';
import i366 from 'kraken-wallet-cryptoicons/src/coinye.svg';
import i367 from 'kraken-wallet-cryptoicons/src/colx.svg';
import i368 from 'kraken-wallet-cryptoicons/src/comb.svg';
import i369 from 'kraken-wallet-cryptoicons/src/combo.svg';
import i370 from 'kraken-wallet-cryptoicons/src/comp.svg';
import i371 from 'kraken-wallet-cryptoicons/src/cone.svg';
import i372 from 'kraken-wallet-cryptoicons/src/coni.svg';
import i373 from 'kraken-wallet-cryptoicons/src/core.svg';
import i374 from 'kraken-wallet-cryptoicons/src/corgiai.svg';
import i375 from 'kraken-wallet-cryptoicons/src/cos.svg';
import i376 from 'kraken-wallet-cryptoicons/src/cosm.svg';
import i377 from 'kraken-wallet-cryptoicons/src/cost.svg';
import i378 from 'kraken-wallet-cryptoicons/src/coti.svg';
import i379 from 'kraken-wallet-cryptoicons/src/cov.svg';
import i380 from 'kraken-wallet-cryptoicons/src/cova.svg';
import i381 from 'kraken-wallet-cryptoicons/src/coval.svg';
import i382 from 'kraken-wallet-cryptoicons/src/cover.svg';
import i383 from 'kraken-wallet-cryptoicons/src/cpc.svg';
import i384 from 'kraken-wallet-cryptoicons/src/cpool.svg';
import i385 from 'kraken-wallet-cryptoicons/src/cpx.svg';
import i386 from 'kraken-wallet-cryptoicons/src/cqt.svg';
import i387 from 'kraken-wallet-cryptoicons/src/cra.svg';
import i388 from 'kraken-wallet-cryptoicons/src/crb.svg';
import i389 from 'kraken-wallet-cryptoicons/src/crd.svg';
import i390 from 'kraken-wallet-cryptoicons/src/cre.svg';
import i391 from 'kraken-wallet-cryptoicons/src/cream.svg';
import i392 from 'kraken-wallet-cryptoicons/src/cred.svg';
import i393 from 'kraken-wallet-cryptoicons/src/credi.svg';
import i394 from 'kraken-wallet-cryptoicons/src/crep.svg';
import i395 from 'kraken-wallet-cryptoicons/src/cro.svg';
import i396 from 'kraken-wallet-cryptoicons/src/crpt.svg';
import i397 from 'kraken-wallet-cryptoicons/src/crts.svg';
import i398 from 'kraken-wallet-cryptoicons/src/cru.svg';
import i399 from 'kraken-wallet-cryptoicons/src/crunch.svg';
import i400 from 'kraken-wallet-cryptoicons/src/crv.svg';
import i401 from 'kraken-wallet-cryptoicons/src/crw.svg';
import i402 from 'kraken-wallet-cryptoicons/src/cs.svg';
import i403 from 'kraken-wallet-cryptoicons/src/csai.svg';
import i404 from 'kraken-wallet-cryptoicons/src/csc.svg';
import i405 from 'kraken-wallet-cryptoicons/src/csp.svg';
import i406 from 'kraken-wallet-cryptoicons/src/cspr.svg';
import i407 from 'kraken-wallet-cryptoicons/src/ctc.svg';
import i408 from 'kraken-wallet-cryptoicons/src/cti.svg';
import i409 from 'kraken-wallet-cryptoicons/src/ctk.svg';
import i410 from 'kraken-wallet-cryptoicons/src/ctsi.svg';
import i411 from 'kraken-wallet-cryptoicons/src/ctx.svg';
import i412 from 'kraken-wallet-cryptoicons/src/ctxc.svg';
import i413 from 'kraken-wallet-cryptoicons/src/cube.svg';
import i414 from 'kraken-wallet-cryptoicons/src/cudos.svg';
import i415 from 'kraken-wallet-cryptoicons/src/cult.svg';
import i416 from 'kraken-wallet-cryptoicons/src/cusd.svg';
import i417 from 'kraken-wallet-cryptoicons/src/cusdc.svg';
import i418 from 'kraken-wallet-cryptoicons/src/cusdt-1.svg';
import i419 from 'kraken-wallet-cryptoicons/src/cusdt.svg';
import i420 from 'kraken-wallet-cryptoicons/src/cv.svg';
import i421 from 'kraken-wallet-cryptoicons/src/cvc.svg';
import i422 from 'kraken-wallet-cryptoicons/src/cvp.svg';
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
import i443 from 'kraken-wallet-cryptoicons/src/dat.svg';
import i444 from 'kraken-wallet-cryptoicons/src/data.svg';
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
import i465 from 'kraken-wallet-cryptoicons/src/df.svg';
import i466 from 'kraken-wallet-cryptoicons/src/dfi.svg';
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
import i480 from 'kraken-wallet-cryptoicons/src/dmt.svg';
import i481 from 'kraken-wallet-cryptoicons/src/dmtr.svg';
import i482 from 'kraken-wallet-cryptoicons/src/dnt.svg';
import i483 from 'kraken-wallet-cryptoicons/src/dock.svg';
import i484 from 'kraken-wallet-cryptoicons/src/dodo.svg';
import i485 from 'kraken-wallet-cryptoicons/src/dog.svg';
import i486 from 'kraken-wallet-cryptoicons/src/doge.svg';
import i487 from 'kraken-wallet-cryptoicons/src/doginme.svg';
import i488 from 'kraken-wallet-cryptoicons/src/dojo.svg';
import i489 from 'kraken-wallet-cryptoicons/src/dola.svg';
import i490 from 'kraken-wallet-cryptoicons/src/dome.svg';
import i491 from 'kraken-wallet-cryptoicons/src/dor.svg';
import i492 from 'kraken-wallet-cryptoicons/src/dora.svg';
import i493 from 'kraken-wallet-cryptoicons/src/dorkl.svg';
import i494 from 'kraken-wallet-cryptoicons/src/dot.svg';
import i495 from 'kraken-wallet-cryptoicons/src/dpi.svg';
import i496 from 'kraken-wallet-cryptoicons/src/dpr.svg';
import i497 from 'kraken-wallet-cryptoicons/src/dpx.svg';
import i498 from 'kraken-wallet-cryptoicons/src/drc.svg';
import i499 from 'kraken-wallet-cryptoicons/src/dreams.svg';
import i500 from 'kraken-wallet-cryptoicons/src/drep.svg';
import i501 from 'kraken-wallet-cryptoicons/src/drg.svg';
import i502 from 'kraken-wallet-cryptoicons/src/drgn.svg';
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
import i515 from 'kraken-wallet-cryptoicons/src/dx.svg';
import i516 from 'kraken-wallet-cryptoicons/src/dxd.svg';
import i517 from 'kraken-wallet-cryptoicons/src/dxt.svg';
import i518 from 'kraken-wallet-cryptoicons/src/dydx.svg';
import i519 from 'kraken-wallet-cryptoicons/src/dym.svg';
import i520 from 'kraken-wallet-cryptoicons/src/dyn.svg';
import i521 from 'kraken-wallet-cryptoicons/src/dypc.svg';
import i522 from 'kraken-wallet-cryptoicons/src/easy.svg';
import i523 from 'kraken-wallet-cryptoicons/src/ebst.svg';
import i524 from 'kraken-wallet-cryptoicons/src/eca.svg';
import i525 from 'kraken-wallet-cryptoicons/src/eco.svg';
import i526 from 'kraken-wallet-cryptoicons/src/edg.svg';
import i527 from 'kraken-wallet-cryptoicons/src/edge.svg';
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
import i540 from 'kraken-wallet-cryptoicons/src/ela.svg';
import i541 from 'kraken-wallet-cryptoicons/src/elan.svg';
import i542 from 'kraken-wallet-cryptoicons/src/elec.svg';
import i543 from 'kraken-wallet-cryptoicons/src/elf.svg';
import i544 from 'kraken-wallet-cryptoicons/src/elg.svg';
import i545 from 'kraken-wallet-cryptoicons/src/ella.svg';
import i546 from 'kraken-wallet-cryptoicons/src/elon.svg';
import i547 from 'kraken-wallet-cryptoicons/src/emc.svg';
import i548 from 'kraken-wallet-cryptoicons/src/emc2.svg';
import i549 from 'kraken-wallet-cryptoicons/src/eng.svg';
import i550 from 'kraken-wallet-cryptoicons/src/enj.svg';
import i551 from 'kraken-wallet-cryptoicons/src/enq.svg';
import i552 from 'kraken-wallet-cryptoicons/src/enrg.svg';
import i553 from 'kraken-wallet-cryptoicons/src/ens.svg';
import i554 from 'kraken-wallet-cryptoicons/src/eos.svg';
import i555 from 'kraken-wallet-cryptoicons/src/eosc.svg';
import i556 from 'kraken-wallet-cryptoicons/src/eosdac.svg';
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
import i573 from 'kraken-wallet-cryptoicons/src/eth.svg';
import i574 from 'kraken-wallet-cryptoicons/src/eth2 v2.svg';
import i575 from 'kraken-wallet-cryptoicons/src/eth2.svg';
import i576 from 'kraken-wallet-cryptoicons/src/etha.svg';
import i577 from 'kraken-wallet-cryptoicons/src/ethdydx.svg';
import i578 from 'kraken-wallet-cryptoicons/src/etho.svg';
import i579 from 'kraken-wallet-cryptoicons/src/ethw.svg';
import i580 from 'kraken-wallet-cryptoicons/src/etn.svg';
import i581 from 'kraken-wallet-cryptoicons/src/etp.svg';
import i582 from 'kraken-wallet-cryptoicons/src/etz.svg';
import i583 from 'kraken-wallet-cryptoicons/src/eum.svg';
import i584 from 'kraken-wallet-cryptoicons/src/eur.svg';
import i585 from 'kraken-wallet-cryptoicons/src/euroc.svg';
import i586 from 'kraken-wallet-cryptoicons/src/eurs.svg';
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
import i610 from 'kraken-wallet-cryptoicons/src/fil.svg';
import i611 from 'kraken-wallet-cryptoicons/src/filda.svg';
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
import i624 from 'kraken-wallet-cryptoicons/src/flo.svg';
import i625 from 'kraken-wallet-cryptoicons/src/floki.svg';
import i626 from 'kraken-wallet-cryptoicons/src/flow.svg';
import i627 from 'kraken-wallet-cryptoicons/src/flr.svg';
import i628 from 'kraken-wallet-cryptoicons/src/flux.svg';
import i629 from 'kraken-wallet-cryptoicons/src/fly.svg';
import i630 from 'kraken-wallet-cryptoicons/src/foam.svg';
import i631 from 'kraken-wallet-cryptoicons/src/fold.svg';
import i632 from 'kraken-wallet-cryptoicons/src/for.svg';
import i633 from 'kraken-wallet-cryptoicons/src/forestplus.svg';
import i634 from 'kraken-wallet-cryptoicons/src/form.svg';
import i635 from 'kraken-wallet-cryptoicons/src/forta.svg';
import i636 from 'kraken-wallet-cryptoicons/src/forth.svg';
import i637 from 'kraken-wallet-cryptoicons/src/fota.svg';
import i638 from 'kraken-wallet-cryptoicons/src/fox.svg';
import i639 from 'kraken-wallet-cryptoicons/src/fpi.svg';
import i640 from 'kraken-wallet-cryptoicons/src/fpis.svg';
import i641 from 'kraken-wallet-cryptoicons/src/frame.svg';
import i642 from 'kraken-wallet-cryptoicons/src/frax.svg';
import i643 from 'kraken-wallet-cryptoicons/src/fren.svg';
import i644 from 'kraken-wallet-cryptoicons/src/frm.svg';
import i645 from 'kraken-wallet-cryptoicons/src/front.svg';
import i646 from 'kraken-wallet-cryptoicons/src/frr.svg';
import i647 from 'kraken-wallet-cryptoicons/src/frxeth.svg';
import i648 from 'kraken-wallet-cryptoicons/src/fsn.svg';
import i649 from 'kraken-wallet-cryptoicons/src/fst.svg';
import i650 from 'kraken-wallet-cryptoicons/src/ft.svg';
import i651 from 'kraken-wallet-cryptoicons/src/ftc.svg';
import i652 from 'kraken-wallet-cryptoicons/src/ftg.svg';
import i653 from 'kraken-wallet-cryptoicons/src/ftm.svg';
import i654 from 'kraken-wallet-cryptoicons/src/ftt.svg';
import i655 from 'kraken-wallet-cryptoicons/src/fuel.svg';
import i656 from 'kraken-wallet-cryptoicons/src/fun.svg';
import i657 from 'kraken-wallet-cryptoicons/src/fuse.svg';
import i658 from 'kraken-wallet-cryptoicons/src/fx.svg';
import i659 from 'kraken-wallet-cryptoicons/src/fxc.svg';
import i660 from 'kraken-wallet-cryptoicons/src/fxs.svg';
import i661 from 'kraken-wallet-cryptoicons/src/fxt.svg';
import i662 from 'kraken-wallet-cryptoicons/src/gafi.svg';
import i663 from 'kraken-wallet-cryptoicons/src/gal.svg';
import i664 from 'kraken-wallet-cryptoicons/src/gala.svg';
import i665 from 'kraken-wallet-cryptoicons/src/gam.svg';
import i666 from 'kraken-wallet-cryptoicons/src/gamb.svg';
import i667 from 'kraken-wallet-cryptoicons/src/game.svg';
import i668 from 'kraken-wallet-cryptoicons/src/gamee.svg';
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
import i681 from 'kraken-wallet-cryptoicons/src/gen.svg';
import i682 from 'kraken-wallet-cryptoicons/src/gens.svg';
import i683 from 'kraken-wallet-cryptoicons/src/geo.svg';
import i684 from 'kraken-wallet-cryptoicons/src/gf.svg';
import i685 from 'kraken-wallet-cryptoicons/src/gfi.svg';
import i686 from 'kraken-wallet-cryptoicons/src/ggc.svg';
import i687 from 'kraken-wallet-cryptoicons/src/ggg.svg';
import i688 from 'kraken-wallet-cryptoicons/src/gho.svg';
import i689 from 'kraken-wallet-cryptoicons/src/ghst.svg';
import i690 from 'kraken-wallet-cryptoicons/src/ghx.svg';
import i691 from 'kraken-wallet-cryptoicons/src/gin.svg';
import i692 from 'kraken-wallet-cryptoicons/src/giv.svg';
import i693 from 'kraken-wallet-cryptoicons/src/glch.svg';
import i694 from 'kraken-wallet-cryptoicons/src/gld.svg';
import i695 from 'kraken-wallet-cryptoicons/src/glm.svg';
import i696 from 'kraken-wallet-cryptoicons/src/glmr.svg';
import i697 from 'kraken-wallet-cryptoicons/src/glq.svg';
import i698 from 'kraken-wallet-cryptoicons/src/gls.svg';
import i699 from 'kraken-wallet-cryptoicons/src/gmee.svg';
import i700 from 'kraken-wallet-cryptoicons/src/gmt.svg';
import i701 from 'kraken-wallet-cryptoicons/src/gmx.svg';
import i702 from 'kraken-wallet-cryptoicons/src/gno.svg';
import i703 from 'kraken-wallet-cryptoicons/src/gns.svg';
import i704 from 'kraken-wallet-cryptoicons/src/gnt.svg';
import i705 from 'kraken-wallet-cryptoicons/src/gnx.svg';
import i706 from 'kraken-wallet-cryptoicons/src/go.svg';
import i707 from 'kraken-wallet-cryptoicons/src/goc.svg';
import i708 from 'kraken-wallet-cryptoicons/src/gom2.svg';
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
import i722 from 'kraken-wallet-cryptoicons/src/gt.svg';
import i723 from 'kraken-wallet-cryptoicons/src/gtc.svg';
import i724 from 'kraken-wallet-cryptoicons/src/gto.svg';
import i725 from 'kraken-wallet-cryptoicons/src/guild.svg';
import i726 from 'kraken-wallet-cryptoicons/src/gup.svg';
import i727 from 'kraken-wallet-cryptoicons/src/gusd.svg';
import i728 from 'kraken-wallet-cryptoicons/src/gvt.svg';
import i729 from 'kraken-wallet-cryptoicons/src/gxc.svg';
import i730 from 'kraken-wallet-cryptoicons/src/gxs.svg';
import i731 from 'kraken-wallet-cryptoicons/src/gyen.svg';
import i732 from 'kraken-wallet-cryptoicons/src/h3ro3s.svg';
import i733 from 'kraken-wallet-cryptoicons/src/hai.svg';
import i734 from 'kraken-wallet-cryptoicons/src/hair.svg';
import i735 from 'kraken-wallet-cryptoicons/src/haka.svg';
import i736 from 'kraken-wallet-cryptoicons/src/hakka.svg';
import i737 from 'kraken-wallet-cryptoicons/src/han.svg';
import i738 from 'kraken-wallet-cryptoicons/src/hanep.svg';
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
import i751 from 'kraken-wallet-cryptoicons/src/her.svg';
import i752 from 'kraken-wallet-cryptoicons/src/hero.svg';
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
import i768 from 'kraken-wallet-cryptoicons/src/hot-x.svg';
import i769 from 'kraken-wallet-cryptoicons/src/hot.svg';
import i770 from 'kraken-wallet-cryptoicons/src/hotcross.svg';
import i771 from 'kraken-wallet-cryptoicons/src/hpb.svg';
import i772 from 'kraken-wallet-cryptoicons/src/hpo.svg';
import i773 from 'kraken-wallet-cryptoicons/src/hpp.svg';
import i774 from 'kraken-wallet-cryptoicons/src/hsr.svg';
import i775 from 'kraken-wallet-cryptoicons/src/ht.svg';
import i776 from 'kraken-wallet-cryptoicons/src/html.svg';
import i777 from 'kraken-wallet-cryptoicons/src/htr.svg';
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
import i793 from 'kraken-wallet-cryptoicons/src/id.svg';
import i794 from 'kraken-wallet-cryptoicons/src/idai.svg';
import i795 from 'kraken-wallet-cryptoicons/src/idea.svg';
import i796 from 'kraken-wallet-cryptoicons/src/idex.svg';
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
import i822 from 'kraken-wallet-cryptoicons/src/iot.svg';
import i823 from 'kraken-wallet-cryptoicons/src/iota.svg';
import i824 from 'kraken-wallet-cryptoicons/src/iotx.svg';
import i825 from 'kraken-wallet-cryptoicons/src/iq-2.svg';
import i826 from 'kraken-wallet-cryptoicons/src/iq.svg';
import i827 from 'kraken-wallet-cryptoicons/src/iq50.svg';
import i828 from 'kraken-wallet-cryptoicons/src/iqn.svg';
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
import i843 from 'kraken-wallet-cryptoicons/src/jlp.svg';
import i844 from 'kraken-wallet-cryptoicons/src/jnt.svg';
import i845 from 'kraken-wallet-cryptoicons/src/joe.svg';
import i846 from 'kraken-wallet-cryptoicons/src/jrt.svg';
import i847 from 'kraken-wallet-cryptoicons/src/jst.svg';
import i848 from 'kraken-wallet-cryptoicons/src/jto.svg';
import i849 from 'kraken-wallet-cryptoicons/src/juno.svg';
import i850 from 'kraken-wallet-cryptoicons/src/jup.svg';
import i851 from 'kraken-wallet-cryptoicons/src/juv.svg';
import i852 from 'kraken-wallet-cryptoicons/src/kai.svg';
import i853 from 'kraken-wallet-cryptoicons/src/kar.svg';
import i854 from 'kraken-wallet-cryptoicons/src/karma.svg';
import i855 from 'kraken-wallet-cryptoicons/src/kas.svg';
import i856 from 'kraken-wallet-cryptoicons/src/kat.svg';
import i857 from 'kraken-wallet-cryptoicons/src/kava.svg';
import i858 from 'kraken-wallet-cryptoicons/src/kbc.svg';
import i859 from 'kraken-wallet-cryptoicons/src/kbtc.svg';
import i860 from 'kraken-wallet-cryptoicons/src/kcs.svg';
import i861 from 'kraken-wallet-cryptoicons/src/kda.svg';
import i862 from 'kraken-wallet-cryptoicons/src/kdon.svg';
import i863 from 'kraken-wallet-cryptoicons/src/keep.svg';
import i864 from 'kraken-wallet-cryptoicons/src/key.svg';
import i865 from 'kraken-wallet-cryptoicons/src/keycat.svg';
import i866 from 'kraken-wallet-cryptoicons/src/kick.svg';
import i867 from 'kraken-wallet-cryptoicons/src/kilt.svg';
import i868 from 'kraken-wallet-cryptoicons/src/kin.svg';
import i869 from 'kraken-wallet-cryptoicons/src/kint.svg';
import i870 from 'kraken-wallet-cryptoicons/src/kira.svg';
import i871 from 'kraken-wallet-cryptoicons/src/kiro.svg';
import i872 from 'kraken-wallet-cryptoicons/src/klay.svg';
import i873 from 'kraken-wallet-cryptoicons/src/klv.svg';
import i874 from 'kraken-wallet-cryptoicons/src/kma.svg';
import i875 from 'kraken-wallet-cryptoicons/src/kmd.svg';
import i876 from 'kraken-wallet-cryptoicons/src/knc.svg';
import i877 from 'kraken-wallet-cryptoicons/src/kndc.svg';
import i878 from 'kraken-wallet-cryptoicons/src/kok.svg';
import i879 from 'kraken-wallet-cryptoicons/src/kol.svg';
import i880 from 'kraken-wallet-cryptoicons/src/kono.svg';
import i881 from 'kraken-wallet-cryptoicons/src/kore.svg';
import i882 from 'kraken-wallet-cryptoicons/src/kp3r.svg';
import i883 from 'kraken-wallet-cryptoicons/src/krb.svg';
import i884 from 'kraken-wallet-cryptoicons/src/krl.svg';
import i885 from 'kraken-wallet-cryptoicons/src/krw.svg';
import i886 from 'kraken-wallet-cryptoicons/src/ksm.svg';
import i887 from 'kraken-wallet-cryptoicons/src/ksp.svg';
import i888 from 'kraken-wallet-cryptoicons/src/ktn.svg';
import i889 from 'kraken-wallet-cryptoicons/src/kub.svg';
import i890 from 'kraken-wallet-cryptoicons/src/kyl.svg';
import i891 from 'kraken-wallet-cryptoicons/src/la.svg';
import i892 from 'kraken-wallet-cryptoicons/src/lab.svg';
import i893 from 'kraken-wallet-cryptoicons/src/lace.svg';
import i894 from 'kraken-wallet-cryptoicons/src/ladys.svg';
import i895 from 'kraken-wallet-cryptoicons/src/lamb.svg';
import i896 from 'kraken-wallet-cryptoicons/src/land.svg';
import i897 from 'kraken-wallet-cryptoicons/src/layer.svg';
import i898 from 'kraken-wallet-cryptoicons/src/lazio.svg';
import i899 from 'kraken-wallet-cryptoicons/src/lba.svg';
import i900 from 'kraken-wallet-cryptoicons/src/lbc.svg';
import i901 from 'kraken-wallet-cryptoicons/src/lcc.svg';
import i902 from 'kraken-wallet-cryptoicons/src/lcdot.svg';
import i903 from 'kraken-wallet-cryptoicons/src/lcx.svg';
import i904 from 'kraken-wallet-cryptoicons/src/ldo.svg';
import i905 from 'kraken-wallet-cryptoicons/src/lend.svg';
import i906 from 'kraken-wallet-cryptoicons/src/leo.svg';
import i907 from 'kraken-wallet-cryptoicons/src/lever.svg';
import i908 from 'kraken-wallet-cryptoicons/src/lien.svg';
import i909 from 'kraken-wallet-cryptoicons/src/like.svg';
import i910 from 'kraken-wallet-cryptoicons/src/lina.svg';
import i911 from 'kraken-wallet-cryptoicons/src/linea.svg';
import i912 from 'kraken-wallet-cryptoicons/src/link.svg';
import i913 from 'kraken-wallet-cryptoicons/src/lit.svg';
import i914 from 'kraken-wallet-cryptoicons/src/lith.svg';
import i915 from 'kraken-wallet-cryptoicons/src/lkk.svg';
import i916 from 'kraken-wallet-cryptoicons/src/lky.svg';
import i917 from 'kraken-wallet-cryptoicons/src/lmc.svg';
import i918 from 'kraken-wallet-cryptoicons/src/ln.svg';
import i919 from 'kraken-wallet-cryptoicons/src/lnchx.svg';
import i920 from 'kraken-wallet-cryptoicons/src/loc.svg';
import i921 from 'kraken-wallet-cryptoicons/src/locg.svg';
import i922 from 'kraken-wallet-cryptoicons/src/lode.svg';
import i923 from 'kraken-wallet-cryptoicons/src/loka.svg';
import i924 from 'kraken-wallet-cryptoicons/src/loki.svg';
import i925 from 'kraken-wallet-cryptoicons/src/lon.svg';
import i926 from 'kraken-wallet-cryptoicons/src/looks.svg';
import i927 from 'kraken-wallet-cryptoicons/src/loom.svg';
import i928 from 'kraken-wallet-cryptoicons/src/love.svg';
import i929 from 'kraken-wallet-cryptoicons/src/lpf.svg';
import i930 from 'kraken-wallet-cryptoicons/src/lpool.svg';
import i931 from 'kraken-wallet-cryptoicons/src/lpt.svg';
import i932 from 'kraken-wallet-cryptoicons/src/lqd.svg';
import i933 from 'kraken-wallet-cryptoicons/src/lqty.svg';
import i934 from 'kraken-wallet-cryptoicons/src/lrc.svg';
import i935 from 'kraken-wallet-cryptoicons/src/lrg.svg';
import i936 from 'kraken-wallet-cryptoicons/src/lsk.svg';
import i937 from 'kraken-wallet-cryptoicons/src/lss.svg';
import i938 from 'kraken-wallet-cryptoicons/src/ltc.svg';
import i939 from 'kraken-wallet-cryptoicons/src/lto.svg';
import i940 from 'kraken-wallet-cryptoicons/src/ltx.svg';
import i941 from 'kraken-wallet-cryptoicons/src/luca.svg';
import i942 from 'kraken-wallet-cryptoicons/src/lun.svg';
import i943 from 'kraken-wallet-cryptoicons/src/luna.svg';
import i944 from 'kraken-wallet-cryptoicons/src/lunc.svg';
import i945 from 'kraken-wallet-cryptoicons/src/lusd.svg';
import i946 from 'kraken-wallet-cryptoicons/src/lxt.svg';
import i947 from 'kraken-wallet-cryptoicons/src/lym.svg';
import i948 from 'kraken-wallet-cryptoicons/src/lyxe.svg';
import i949 from 'kraken-wallet-cryptoicons/src/maapl.svg';
import i950 from 'kraken-wallet-cryptoicons/src/maga.svg';
import i951 from 'kraken-wallet-cryptoicons/src/magic.svg';
import i952 from 'kraken-wallet-cryptoicons/src/maha.svg';
import i953 from 'kraken-wallet-cryptoicons/src/mai.svg';
import i954 from 'kraken-wallet-cryptoicons/src/maid.svg';
import i955 from 'kraken-wallet-cryptoicons/src/maki.svg';
import i956 from 'kraken-wallet-cryptoicons/src/man.svg';
import i957 from 'kraken-wallet-cryptoicons/src/mana.svg';
import i958 from 'kraken-wallet-cryptoicons/src/manta.svg';
import i959 from 'kraken-wallet-cryptoicons/src/map.svg';
import i960 from 'kraken-wallet-cryptoicons/src/maps.svg';
import i961 from 'kraken-wallet-cryptoicons/src/marsh.svg';
import i962 from 'kraken-wallet-cryptoicons/src/mask.svg';
import i963 from 'kraken-wallet-cryptoicons/src/mass.svg';
import i964 from 'kraken-wallet-cryptoicons/src/math.svg';
import i965 from 'kraken-wallet-cryptoicons/src/matic.svg';
import i966 from 'kraken-wallet-cryptoicons/src/maticx.svg';
import i967 from 'kraken-wallet-cryptoicons/src/matter.svg';
import i968 from 'kraken-wallet-cryptoicons/src/mb.svg';
import i969 from 'kraken-wallet-cryptoicons/src/mbc.svg';
import i970 from 'kraken-wallet-cryptoicons/src/mbl.svg';
import i971 from 'kraken-wallet-cryptoicons/src/mbox.svg';
import i972 from 'kraken-wallet-cryptoicons/src/mc.svg';
import i973 from 'kraken-wallet-cryptoicons/src/mcb.svg';
import i974 from 'kraken-wallet-cryptoicons/src/mco.svg';
import i975 from 'kraken-wallet-cryptoicons/src/mco2.svg';
import i976 from 'kraken-wallet-cryptoicons/src/mcx.svg';
import i977 from 'kraken-wallet-cryptoicons/src/mda.svg';
import i978 from 'kraken-wallet-cryptoicons/src/mdao.svg';
import i979 from 'kraken-wallet-cryptoicons/src/mds.svg';
import i980 from 'kraken-wallet-cryptoicons/src/mdt.svg';
import i981 from 'kraken-wallet-cryptoicons/src/mdx.svg';
import i982 from 'kraken-wallet-cryptoicons/src/med.svg';
import i983 from 'kraken-wallet-cryptoicons/src/medx.svg';
import i984 from 'kraken-wallet-cryptoicons/src/meetone.svg';
import i985 from 'kraken-wallet-cryptoicons/src/mem.svg';
import i986 from 'kraken-wallet-cryptoicons/src/meme.svg';
import i987 from 'kraken-wallet-cryptoicons/src/mer.svg';
import i988 from 'kraken-wallet-cryptoicons/src/met.svg';
import i989 from 'kraken-wallet-cryptoicons/src/meta.svg';
import i990 from 'kraken-wallet-cryptoicons/src/metano.svg';
import i991 from 'kraken-wallet-cryptoicons/src/metis.svg';
import i992 from 'kraken-wallet-cryptoicons/src/mew.svg';
import i993 from 'kraken-wallet-cryptoicons/src/mex.svg';
import i994 from 'kraken-wallet-cryptoicons/src/mfg.svg';
import i995 from 'kraken-wallet-cryptoicons/src/mft.svg';
import i996 from 'kraken-wallet-cryptoicons/src/mhc.svg';
import i997 from 'kraken-wallet-cryptoicons/src/mim.svg';
import i998 from 'kraken-wallet-cryptoicons/src/mimatic.svg';
import i999 from 'kraken-wallet-cryptoicons/src/mina.svg';
import i1000 from 'kraken-wallet-cryptoicons/src/miota.svg';
import i1001 from 'kraken-wallet-cryptoicons/src/mir.svg';
import i1002 from 'kraken-wallet-cryptoicons/src/mith.svg';
import i1003 from 'kraken-wallet-cryptoicons/src/mitx.svg';
import i1004 from 'kraken-wallet-cryptoicons/src/mjt.svg';
import i1005 from 'kraken-wallet-cryptoicons/src/mkr.svg';
import i1006 from 'kraken-wallet-cryptoicons/src/mlb.svg';
import i1007 from 'kraken-wallet-cryptoicons/src/mlk.svg';
import i1008 from 'kraken-wallet-cryptoicons/src/mln.svg';
import i1009 from 'kraken-wallet-cryptoicons/src/mmt.svg';
import i1010 from 'kraken-wallet-cryptoicons/src/mmxn.svg';
import i1011 from 'kraken-wallet-cryptoicons/src/mnde.svg';
import i1012 from 'kraken-wallet-cryptoicons/src/mnet.svg';
import i1013 from 'kraken-wallet-cryptoicons/src/mngo.svg';
import i1014 from 'kraken-wallet-cryptoicons/src/mns.svg';
import i1015 from 'kraken-wallet-cryptoicons/src/mnst.svg';
import i1016 from 'kraken-wallet-cryptoicons/src/mnt.svg';
import i1017 from 'kraken-wallet-cryptoicons/src/mntl.svg';
import i1018 from 'kraken-wallet-cryptoicons/src/mnw.svg';
import i1019 from 'kraken-wallet-cryptoicons/src/moac.svg';
import i1020 from 'kraken-wallet-cryptoicons/src/mob.svg';
import i1021 from 'kraken-wallet-cryptoicons/src/mochi.svg';
import i1022 from 'kraken-wallet-cryptoicons/src/mod.svg';
import i1023 from 'kraken-wallet-cryptoicons/src/modefi.svg';
import i1024 from 'kraken-wallet-cryptoicons/src/mof.svg';
import i1025 from 'kraken-wallet-cryptoicons/src/mog.svg';
import i1026 from 'kraken-wallet-cryptoicons/src/mom.svg';
import i1027 from 'kraken-wallet-cryptoicons/src/mona.svg';
import i1028 from 'kraken-wallet-cryptoicons/src/moni.svg';
import i1029 from 'kraken-wallet-cryptoicons/src/moon.svg';
import i1030 from 'kraken-wallet-cryptoicons/src/mot.svg';
import i1031 from 'kraken-wallet-cryptoicons/src/movez.svg';
import i1032 from 'kraken-wallet-cryptoicons/src/movr.svg';
import i1033 from 'kraken-wallet-cryptoicons/src/mph.svg';
import i1034 from 'kraken-wallet-cryptoicons/src/mpl.svg';
import i1035 from 'kraken-wallet-cryptoicons/src/msol.svg';
import i1036 from 'kraken-wallet-cryptoicons/src/msr.svg';
import i1037 from 'kraken-wallet-cryptoicons/src/mswap.svg';
import i1038 from 'kraken-wallet-cryptoicons/src/mta.svg';
import i1039 from 'kraken-wallet-cryptoicons/src/mtc.svg';
import i1040 from 'kraken-wallet-cryptoicons/src/mth.svg';
import i1041 from 'kraken-wallet-cryptoicons/src/mtl.svg';
import i1042 from 'kraken-wallet-cryptoicons/src/mtn.svg';
import i1043 from 'kraken-wallet-cryptoicons/src/mtrg.svg';
import i1044 from 'kraken-wallet-cryptoicons/src/mts.svg';
import i1045 from 'kraken-wallet-cryptoicons/src/mtv.svg';
import i1046 from 'kraken-wallet-cryptoicons/src/mue.svg';
import i1047 from 'kraken-wallet-cryptoicons/src/multi.svg';
import i1048 from 'kraken-wallet-cryptoicons/src/musd.svg';
import i1049 from 'kraken-wallet-cryptoicons/src/music.svg';
import i1050 from 'kraken-wallet-cryptoicons/src/mvc.svg';
import i1051 from 'kraken-wallet-cryptoicons/src/mvl.svg';
import i1052 from 'kraken-wallet-cryptoicons/src/mvp.svg';
import i1053 from 'kraken-wallet-cryptoicons/src/mwat.svg';
import i1054 from 'kraken-wallet-cryptoicons/src/mwc.svg';
import i1055 from 'kraken-wallet-cryptoicons/src/mx.svg';
import i1056 from 'kraken-wallet-cryptoicons/src/mxc.svg';
import i1057 from 'kraken-wallet-cryptoicons/src/mxm.svg';
import i1058 from 'kraken-wallet-cryptoicons/src/mxw.svg';
import i1059 from 'kraken-wallet-cryptoicons/src/myb.svg';
import i1060 from 'kraken-wallet-cryptoicons/src/myro.svg';
import i1061 from 'kraken-wallet-cryptoicons/src/myst.svg';
import i1062 from 'kraken-wallet-cryptoicons/src/naka.svg';
import i1063 from 'kraken-wallet-cryptoicons/src/nano.svg';
import i1064 from 'kraken-wallet-cryptoicons/src/nas.svg';
import i1065 from 'kraken-wallet-cryptoicons/src/nav.svg';
import i1066 from 'kraken-wallet-cryptoicons/src/nbs.svg';
import i1067 from 'kraken-wallet-cryptoicons/src/nbt.svg';
import i1068 from 'kraken-wallet-cryptoicons/src/ncash.svg';
import i1069 from 'kraken-wallet-cryptoicons/src/nct.svg';
import i1070 from 'kraken-wallet-cryptoicons/src/ndau.svg';
import i1071 from 'kraken-wallet-cryptoicons/src/near.svg';
import i1072 from 'kraken-wallet-cryptoicons/src/nebl.svg';
import i1073 from 'kraken-wallet-cryptoicons/src/nec.svg';
import i1074 from 'kraken-wallet-cryptoicons/src/nem.svg';
import i1075 from 'kraken-wallet-cryptoicons/src/neo.svg';
import i1076 from 'kraken-wallet-cryptoicons/src/neon.svg';
import i1077 from 'kraken-wallet-cryptoicons/src/neos.svg';
import i1078 from 'kraken-wallet-cryptoicons/src/neox.svg';
import i1079 from 'kraken-wallet-cryptoicons/src/nest.svg';
import i1080 from 'kraken-wallet-cryptoicons/src/neu.svg';
import i1081 from 'kraken-wallet-cryptoicons/src/new.svg';
import i1082 from 'kraken-wallet-cryptoicons/src/nex.svg';
import i1083 from 'kraken-wallet-cryptoicons/src/nexo.svg';
import i1084 from 'kraken-wallet-cryptoicons/src/nexxo.svg';
import i1085 from 'kraken-wallet-cryptoicons/src/nft.svg';
import i1086 from 'kraken-wallet-cryptoicons/src/nftb.svg';
import i1087 from 'kraken-wallet-cryptoicons/src/nftx.svg';
import i1088 from 'kraken-wallet-cryptoicons/src/ngc.svg';
import i1089 from 'kraken-wallet-cryptoicons/src/ngm.svg';
import i1090 from 'kraken-wallet-cryptoicons/src/nif.svg';
import i1091 from 'kraken-wallet-cryptoicons/src/nim.svg';
import i1092 from 'kraken-wallet-cryptoicons/src/niox.svg';
import i1093 from 'kraken-wallet-cryptoicons/src/nix.svg';
import i1094 from 'kraken-wallet-cryptoicons/src/nkn.svg';
import i1095 from 'kraken-wallet-cryptoicons/src/nlc2.svg';
import i1096 from 'kraken-wallet-cryptoicons/src/nlg.svg';
import i1097 from 'kraken-wallet-cryptoicons/src/nmc.svg';
import i1098 from 'kraken-wallet-cryptoicons/src/nmr.svg';
import i1099 from 'kraken-wallet-cryptoicons/src/noia.svg';
import i1100 from 'kraken-wallet-cryptoicons/src/nord.svg';
import i1101 from 'kraken-wallet-cryptoicons/src/normie.svg';
import i1102 from 'kraken-wallet-cryptoicons/src/normilio.svg';
import i1103 from 'kraken-wallet-cryptoicons/src/nox.svg';
import i1104 from 'kraken-wallet-cryptoicons/src/nper.svg';
import i1105 from 'kraken-wallet-cryptoicons/src/npxs.svg';
import i1106 from 'kraken-wallet-cryptoicons/src/nrg.svg';
import i1107 from 'kraken-wallet-cryptoicons/src/nrv.svg';
import i1108 from 'kraken-wallet-cryptoicons/src/nrve.svg';
import i1109 from 'kraken-wallet-cryptoicons/src/ntic.svg';
import i1110 from 'kraken-wallet-cryptoicons/src/ntrn.svg';
import i1111 from 'kraken-wallet-cryptoicons/src/ntvrk.svg';
import i1112 from 'kraken-wallet-cryptoicons/src/nu.svg';
import i1113 from 'kraken-wallet-cryptoicons/src/nuls.svg';
import i1114 from 'kraken-wallet-cryptoicons/src/num.svg';
import i1115 from 'kraken-wallet-cryptoicons/src/nusd.svg';
import i1116 from 'kraken-wallet-cryptoicons/src/nwc.svg';
import i1117 from 'kraken-wallet-cryptoicons/src/nxm.svg';
import i1118 from 'kraken-wallet-cryptoicons/src/nxs.svg';
import i1119 from 'kraken-wallet-cryptoicons/src/nxt.svg';
import i1120 from 'kraken-wallet-cryptoicons/src/nye.svg';
import i1121 from 'kraken-wallet-cryptoicons/src/nym.svg';
import i1122 from 'kraken-wallet-cryptoicons/src/oag.svg';
import i1123 from 'kraken-wallet-cryptoicons/src/oak.svg';
import i1124 from 'kraken-wallet-cryptoicons/src/oax.svg';
import i1125 from 'kraken-wallet-cryptoicons/src/ocean.svg';
import i1126 from 'kraken-wallet-cryptoicons/src/ocn.svg';
import i1127 from 'kraken-wallet-cryptoicons/src/oddz.svg';
import i1128 from 'kraken-wallet-cryptoicons/src/ode.svg';
import i1129 from 'kraken-wallet-cryptoicons/src/og.svg';
import i1130 from 'kraken-wallet-cryptoicons/src/ogn.svg';
import i1131 from 'kraken-wallet-cryptoicons/src/ogo.svg';
import i1132 from 'kraken-wallet-cryptoicons/src/ohm.svg';
import i1133 from 'kraken-wallet-cryptoicons/src/oil.svg';
import i1134 from 'kraken-wallet-cryptoicons/src/ok.svg';
import i1135 from 'kraken-wallet-cryptoicons/src/okb.svg';
import i1136 from 'kraken-wallet-cryptoicons/src/oks.svg';
import i1137 from 'kraken-wallet-cryptoicons/src/olt.svg';
import i1138 from 'kraken-wallet-cryptoicons/src/om.svg';
import i1139 from 'kraken-wallet-cryptoicons/src/omg.svg';
import i1140 from 'kraken-wallet-cryptoicons/src/omni.svg';
import i1141 from 'kraken-wallet-cryptoicons/src/ondo.svg';
import i1142 from 'kraken-wallet-cryptoicons/src/one.svg';
import i1143 from 'kraken-wallet-cryptoicons/src/ong.svg';
import i1144 from 'kraken-wallet-cryptoicons/src/onion.svg';
import i1145 from 'kraken-wallet-cryptoicons/src/onston.svg';
import i1146 from 'kraken-wallet-cryptoicons/src/ont.svg';
import i1147 from 'kraken-wallet-cryptoicons/src/ooe.svg';
import i1148 from 'kraken-wallet-cryptoicons/src/ooki.svg';
import i1149 from 'kraken-wallet-cryptoicons/src/oot.svg';
import i1150 from 'kraken-wallet-cryptoicons/src/op.svg';
import i1151 from 'kraken-wallet-cryptoicons/src/open.svg';
import i1152 from 'kraken-wallet-cryptoicons/src/opium.svg';
import i1153 from 'kraken-wallet-cryptoicons/src/opq.svg';
import i1154 from 'kraken-wallet-cryptoicons/src/ops.svg';
import i1155 from 'kraken-wallet-cryptoicons/src/opsec.svg';
import i1156 from 'kraken-wallet-cryptoicons/src/opul.svg';
import i1157 from 'kraken-wallet-cryptoicons/src/opx.svg';
import i1158 from 'kraken-wallet-cryptoicons/src/orai.svg';
import i1159 from 'kraken-wallet-cryptoicons/src/orbs.svg';
import i1160 from 'kraken-wallet-cryptoicons/src/orc.svg';
import i1161 from 'kraken-wallet-cryptoicons/src/orca.svg';
import i1162 from 'kraken-wallet-cryptoicons/src/orcat.svg';
import i1163 from 'kraken-wallet-cryptoicons/src/ordi.svg';
import i1164 from 'kraken-wallet-cryptoicons/src/orn.svg';
import i1165 from 'kraken-wallet-cryptoicons/src/osmo.svg';
import i1166 from 'kraken-wallet-cryptoicons/src/ost.svg';
import i1167 from 'kraken-wallet-cryptoicons/src/ouro.svg';
import i1168 from 'kraken-wallet-cryptoicons/src/ousd.svg';
import i1169 from 'kraken-wallet-cryptoicons/src/ovc.svg';
import i1170 from 'kraken-wallet-cryptoicons/src/oxen.svg';
import i1171 from 'kraken-wallet-cryptoicons/src/oxt.svg';
import i1172 from 'kraken-wallet-cryptoicons/src/oxy.svg';
import i1173 from 'kraken-wallet-cryptoicons/src/pac.svg';
import i1174 from 'kraken-wallet-cryptoicons/src/pai.svg';
import i1175 from 'kraken-wallet-cryptoicons/src/paint.svg';
import i1176 from 'kraken-wallet-cryptoicons/src/pal.svg';
import i1177 from 'kraken-wallet-cryptoicons/src/palm.svg';
import i1178 from 'kraken-wallet-cryptoicons/src/paper.svg';
import i1179 from 'kraken-wallet-cryptoicons/src/par.svg';
import i1180 from 'kraken-wallet-cryptoicons/src/part.svg';
import i1181 from 'kraken-wallet-cryptoicons/src/pasc.svg';
import i1182 from 'kraken-wallet-cryptoicons/src/pax.svg';
import i1183 from 'kraken-wallet-cryptoicons/src/paxg.svg';
import i1184 from 'kraken-wallet-cryptoicons/src/pay.svg';
import i1185 from 'kraken-wallet-cryptoicons/src/payx.svg';
import i1186 from 'kraken-wallet-cryptoicons/src/pazzi.svg';
import i1187 from 'kraken-wallet-cryptoicons/src/pbirb.svg';
import i1188 from 'kraken-wallet-cryptoicons/src/pbr.svg';
import i1189 from 'kraken-wallet-cryptoicons/src/pbtc.svg';
import i1190 from 'kraken-wallet-cryptoicons/src/pbx.svg';
import i1191 from 'kraken-wallet-cryptoicons/src/pchu.svg';
import i1192 from 'kraken-wallet-cryptoicons/src/pcx.svg';
import i1193 from 'kraken-wallet-cryptoicons/src/pdex.svg';
import i1194 from 'kraken-wallet-cryptoicons/src/pearl.svg';
import i1195 from 'kraken-wallet-cryptoicons/src/peas.svg';
import i1196 from 'kraken-wallet-cryptoicons/src/pel.svg';
import i1197 from 'kraken-wallet-cryptoicons/src/pendle.svg';
import i1198 from 'kraken-wallet-cryptoicons/src/pepe.svg';
import i1199 from 'kraken-wallet-cryptoicons/src/perl.svg';
import i1200 from 'kraken-wallet-cryptoicons/src/perp.svg';
import i1201 from 'kraken-wallet-cryptoicons/src/pha.svg';
import i1202 from 'kraken-wallet-cryptoicons/src/phb.svg';
import i1203 from 'kraken-wallet-cryptoicons/src/phnx.svg';
import i1204 from 'kraken-wallet-cryptoicons/src/phtk.svg';
import i1205 from 'kraken-wallet-cryptoicons/src/phx.svg';
import i1206 from 'kraken-wallet-cryptoicons/src/pickle.svg';
import i1207 from 'kraken-wallet-cryptoicons/src/pink.svg';
import i1208 from 'kraken-wallet-cryptoicons/src/pip.svg';
import i1209 from 'kraken-wallet-cryptoicons/src/pirl.svg';
import i1210 from 'kraken-wallet-cryptoicons/src/pivx.svg';
import i1211 from 'kraken-wallet-cryptoicons/src/pkb.svg';
import i1212 from 'kraken-wallet-cryptoicons/src/pla.svg';
import i1213 from 'kraken-wallet-cryptoicons/src/play.svg';
import i1214 from 'kraken-wallet-cryptoicons/src/plbt.svg';
import i1215 from 'kraken-wallet-cryptoicons/src/plc.svg';
import i1216 from 'kraken-wallet-cryptoicons/src/pldai.svg';
import i1217 from 'kraken-wallet-cryptoicons/src/plgr.svg';
import i1218 from 'kraken-wallet-cryptoicons/src/plr.svg';
import i1219 from 'kraken-wallet-cryptoicons/src/plt.svg';
import i1220 from 'kraken-wallet-cryptoicons/src/pltc.svg';
import i1221 from 'kraken-wallet-cryptoicons/src/plu.svg';
import i1222 from 'kraken-wallet-cryptoicons/src/plusdc.svg';
import i1223 from 'kraken-wallet-cryptoicons/src/pma.svg';
import i1224 from 'kraken-wallet-cryptoicons/src/pmgt.svg';
import i1225 from 'kraken-wallet-cryptoicons/src/pmon.svg';
import i1226 from 'kraken-wallet-cryptoicons/src/png.svg';
import i1227 from 'kraken-wallet-cryptoicons/src/pnk.svg';
import i1228 from 'kraken-wallet-cryptoicons/src/pnt.svg';
import i1229 from 'kraken-wallet-cryptoicons/src/poa.svg';
import i1230 from 'kraken-wallet-cryptoicons/src/poe.svg';
import i1231 from 'kraken-wallet-cryptoicons/src/pokt.svg';
import i1232 from 'kraken-wallet-cryptoicons/src/pol.svg';
import i1233 from 'kraken-wallet-cryptoicons/src/polc.svg';
import i1234 from 'kraken-wallet-cryptoicons/src/polis.svg';
import i1235 from 'kraken-wallet-cryptoicons/src/polk.svg';
import i1236 from 'kraken-wallet-cryptoicons/src/pols.svg';
import i1237 from 'kraken-wallet-cryptoicons/src/polx.svg';
import i1238 from 'kraken-wallet-cryptoicons/src/poly-2.svg';
import i1239 from 'kraken-wallet-cryptoicons/src/poly.svg';
import i1240 from 'kraken-wallet-cryptoicons/src/polyx.svg';
import i1241 from 'kraken-wallet-cryptoicons/src/pom.svg';
import i1242 from 'kraken-wallet-cryptoicons/src/pond.svg';
import i1243 from 'kraken-wallet-cryptoicons/src/ponke.svg';
import i1244 from 'kraken-wallet-cryptoicons/src/pont.svg';
import i1245 from 'kraken-wallet-cryptoicons/src/pool.svg';
import i1246 from 'kraken-wallet-cryptoicons/src/pop.svg';
import i1247 from 'kraken-wallet-cryptoicons/src/popcat.svg';
import i1248 from 'kraken-wallet-cryptoicons/src/pork.svg';
import i1249 from 'kraken-wallet-cryptoicons/src/porto.svg';
import i1250 from 'kraken-wallet-cryptoicons/src/pot.svg';
import i1251 from 'kraken-wallet-cryptoicons/src/potnoy.svg';
import i1252 from 'kraken-wallet-cryptoicons/src/power.svg';
import i1253 from 'kraken-wallet-cryptoicons/src/powr.svg';
import i1254 from 'kraken-wallet-cryptoicons/src/ppay.svg';
import i1255 from 'kraken-wallet-cryptoicons/src/ppc.svg';
import i1256 from 'kraken-wallet-cryptoicons/src/ppp.svg';
import i1257 from 'kraken-wallet-cryptoicons/src/ppt.svg';
import i1258 from 'kraken-wallet-cryptoicons/src/pre.svg';
import i1259 from 'kraken-wallet-cryptoicons/src/premia.svg';
import i1260 from 'kraken-wallet-cryptoicons/src/prime.svg';
import i1261 from 'kraken-wallet-cryptoicons/src/prl.svg';
import i1262 from 'kraken-wallet-cryptoicons/src/pro.svg';
import i1263 from 'kraken-wallet-cryptoicons/src/prom.svg';
import i1264 from 'kraken-wallet-cryptoicons/src/props.svg';
import i1265 from 'kraken-wallet-cryptoicons/src/pros.svg';
import i1266 from 'kraken-wallet-cryptoicons/src/prq.svg';
import i1267 from 'kraken-wallet-cryptoicons/src/psg.svg';
import i1268 from 'kraken-wallet-cryptoicons/src/psp.svg';
import i1269 from 'kraken-wallet-cryptoicons/src/pst.svg';
import i1270 from 'kraken-wallet-cryptoicons/src/pstake.svg';
import i1271 from 'kraken-wallet-cryptoicons/src/ptc.svg';
import i1272 from 'kraken-wallet-cryptoicons/src/ptoy.svg';
import i1273 from 'kraken-wallet-cryptoicons/src/pundix.svg';
import i1274 from 'kraken-wallet-cryptoicons/src/pups.svg';
import i1275 from 'kraken-wallet-cryptoicons/src/pyr.svg';
import i1276 from 'kraken-wallet-cryptoicons/src/pyth.svg';
import i1277 from 'kraken-wallet-cryptoicons/src/pyusd.svg';
import i1278 from 'kraken-wallet-cryptoicons/src/qash.svg';
import i1279 from 'kraken-wallet-cryptoicons/src/qbit.svg';
import i1280 from 'kraken-wallet-cryptoicons/src/qi.svg';
import i1281 from 'kraken-wallet-cryptoicons/src/qkc.svg';
import i1282 from 'kraken-wallet-cryptoicons/src/qlc.svg';
import i1283 from 'kraken-wallet-cryptoicons/src/qnt.svg';
import i1284 from 'kraken-wallet-cryptoicons/src/qqq.svg';
import i1285 from 'kraken-wallet-cryptoicons/src/qrdo.svg';
import i1286 from 'kraken-wallet-cryptoicons/src/qrl.svg';
import i1287 from 'kraken-wallet-cryptoicons/src/qsp.svg';
import i1288 from 'kraken-wallet-cryptoicons/src/qtum.svg';
import i1289 from 'kraken-wallet-cryptoicons/src/quick.svg';
import i1290 from 'kraken-wallet-cryptoicons/src/qun.svg';
import i1291 from 'kraken-wallet-cryptoicons/src/qwark.svg';
import i1292 from 'kraken-wallet-cryptoicons/src/r.svg';
import i1293 from 'kraken-wallet-cryptoicons/src/raca.svg';
import i1294 from 'kraken-wallet-cryptoicons/src/rad.svg';
import i1295 from 'kraken-wallet-cryptoicons/src/radar.svg';
import i1296 from 'kraken-wallet-cryptoicons/src/rads.svg';
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
import i1315 from 'kraken-wallet-cryptoicons/src/ren.svg';
import i1316 from 'kraken-wallet-cryptoicons/src/renbtc.svg';
import i1317 from 'kraken-wallet-cryptoicons/src/render.svg';
import i1318 from 'kraken-wallet-cryptoicons/src/renfil.svg';
import i1319 from 'kraken-wallet-cryptoicons/src/rep.svg';
import i1320 from 'kraken-wallet-cryptoicons/src/req.svg';
import i1321 from 'kraken-wallet-cryptoicons/src/reth.svg';
import i1322 from 'kraken-wallet-cryptoicons/src/rev.svg';
import i1323 from 'kraken-wallet-cryptoicons/src/revo.svg';
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
import i1349 from 'kraken-wallet-cryptoicons/src/rsv.svg';
import i1350 from 'kraken-wallet-cryptoicons/src/ruff.svg';
import i1351 from 'kraken-wallet-cryptoicons/src/rune.svg';
import i1352 from 'kraken-wallet-cryptoicons/src/rvn.svg';
import i1353 from 'kraken-wallet-cryptoicons/src/rvr.svg';
import i1354 from 'kraken-wallet-cryptoicons/src/ryo.svg';
import i1355 from 'kraken-wallet-cryptoicons/src/s.svg';
import i1356 from 'kraken-wallet-cryptoicons/src/safemoon.svg';
import i1357 from 'kraken-wallet-cryptoicons/src/sai.svg';
import i1358 from 'kraken-wallet-cryptoicons/src/saito.svg';
import i1359 from 'kraken-wallet-cryptoicons/src/salt.svg';
import i1360 from 'kraken-wallet-cryptoicons/src/samo.svg';
import i1361 from 'kraken-wallet-cryptoicons/src/san.svg';
import i1362 from 'kraken-wallet-cryptoicons/src/sand.svg';
import i1363 from 'kraken-wallet-cryptoicons/src/santos.svg';
import i1364 from 'kraken-wallet-cryptoicons/src/sapp.svg';
import i1365 from 'kraken-wallet-cryptoicons/src/sar.svg';
import i1366 from 'kraken-wallet-cryptoicons/src/savax.svg';
import i1367 from 'kraken-wallet-cryptoicons/src/sbd.svg';
import i1368 from 'kraken-wallet-cryptoicons/src/sbr.svg';
import i1369 from 'kraken-wallet-cryptoicons/src/sbtc.svg';
import i1370 from 'kraken-wallet-cryptoicons/src/sc.svg';
import i1371 from 'kraken-wallet-cryptoicons/src/sclp.svg';
import i1372 from 'kraken-wallet-cryptoicons/src/scrl.svg';
import i1373 from 'kraken-wallet-cryptoicons/src/scrt.svg';
import i1374 from 'kraken-wallet-cryptoicons/src/sd.svg';
import i1375 from 'kraken-wallet-cryptoicons/src/sdao.svg';
import i1376 from 'kraken-wallet-cryptoicons/src/sdl.svg';
import i1377 from 'kraken-wallet-cryptoicons/src/sdn.svg';
import i1378 from 'kraken-wallet-cryptoicons/src/sdt.svg';
import i1379 from 'kraken-wallet-cryptoicons/src/seele.svg';
import i1380 from 'kraken-wallet-cryptoicons/src/sefi.svg';
import i1381 from 'kraken-wallet-cryptoicons/src/sei.svg';
import i1382 from 'kraken-wallet-cryptoicons/src/sem.svg';
import i1383 from 'kraken-wallet-cryptoicons/src/senso.svg';
import i1384 from 'kraken-wallet-cryptoicons/src/seq.svg';
import i1385 from 'kraken-wallet-cryptoicons/src/sero.svg';
import i1386 from 'kraken-wallet-cryptoicons/src/seth.svg';
import i1387 from 'kraken-wallet-cryptoicons/src/seth2.svg';
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
import i1403 from 'kraken-wallet-cryptoicons/src/shr.svg';
import i1404 from 'kraken-wallet-cryptoicons/src/shroom.svg';
import i1405 from 'kraken-wallet-cryptoicons/src/shx.svg';
import i1406 from 'kraken-wallet-cryptoicons/src/si.svg';
import i1407 from 'kraken-wallet-cryptoicons/src/sia.svg';
import i1408 from 'kraken-wallet-cryptoicons/src/sib.svg';
import i1409 from 'kraken-wallet-cryptoicons/src/silo.svg';
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
import i1435 from 'kraken-wallet-cryptoicons/src/sol.svg';
import i1436 from 'kraken-wallet-cryptoicons/src/solama.svg';
import i1437 from 'kraken-wallet-cryptoicons/src/solid.svg';
import i1438 from 'kraken-wallet-cryptoicons/src/solo.svg';
import i1439 from 'kraken-wallet-cryptoicons/src/solr.svg';
import i1440 from 'kraken-wallet-cryptoicons/src/solve.svg';
import i1441 from 'kraken-wallet-cryptoicons/src/sos.svg';
import i1442 from 'kraken-wallet-cryptoicons/src/soul.svg';
import i1443 from 'kraken-wallet-cryptoicons/src/sov.svg';
import i1444 from 'kraken-wallet-cryptoicons/src/spank.svg';
import i1445 from 'kraken-wallet-cryptoicons/src/sparta.svg';
import i1446 from 'kraken-wallet-cryptoicons/src/spell.svg';
import i1447 from 'kraken-wallet-cryptoicons/src/sphr.svg';
import i1448 from 'kraken-wallet-cryptoicons/src/sphtx.svg';
import i1449 from 'kraken-wallet-cryptoicons/src/spi.svg';
import i1450 from 'kraken-wallet-cryptoicons/src/spike.svg';
import i1451 from 'kraken-wallet-cryptoicons/src/spk.svg';
import i1452 from 'kraken-wallet-cryptoicons/src/spn.svg';
import i1453 from 'kraken-wallet-cryptoicons/src/spnd.svg';
import i1454 from 'kraken-wallet-cryptoicons/src/spr.svg';
import i1455 from 'kraken-wallet-cryptoicons/src/srm.svg';
import i1456 from 'kraken-wallet-cryptoicons/src/srn.svg';
import i1457 from 'kraken-wallet-cryptoicons/src/ssv.svg';
import i1458 from 'kraken-wallet-cryptoicons/src/stak.svg';
import i1459 from 'kraken-wallet-cryptoicons/src/stake.svg';
import i1460 from 'kraken-wallet-cryptoicons/src/stan.svg';
import i1461 from 'kraken-wallet-cryptoicons/src/starly.svg';
import i1462 from 'kraken-wallet-cryptoicons/src/start.svg';
import i1463 from 'kraken-wallet-cryptoicons/src/stc.svg';
import i1464 from 'kraken-wallet-cryptoicons/src/steem.svg';
import i1465 from 'kraken-wallet-cryptoicons/src/step.svg';
import i1466 from 'kraken-wallet-cryptoicons/src/steth-1.svg';
import i1467 from 'kraken-wallet-cryptoicons/src/steth.svg';
import i1468 from 'kraken-wallet-cryptoicons/src/stg.svg';
import i1469 from 'kraken-wallet-cryptoicons/src/stkaave.svg';
import i1470 from 'kraken-wallet-cryptoicons/src/stklyra.svg';
import i1471 from 'kraken-wallet-cryptoicons/src/stmatic.svg';
import i1472 from 'kraken-wallet-cryptoicons/src/stmx.svg';
import i1473 from 'kraken-wallet-cryptoicons/src/stnd.svg';
import i1474 from 'kraken-wallet-cryptoicons/src/storj.svg';
import i1475 from 'kraken-wallet-cryptoicons/src/storm.svg';
import i1476 from 'kraken-wallet-cryptoicons/src/stpt.svg';
import i1477 from 'kraken-wallet-cryptoicons/src/stq.svg';
import i1478 from 'kraken-wallet-cryptoicons/src/strat.svg';
import i1479 from 'kraken-wallet-cryptoicons/src/strax.svg';
import i1480 from 'kraken-wallet-cryptoicons/src/strk.svg';
import i1481 from 'kraken-wallet-cryptoicons/src/strong.svg';
import i1482 from 'kraken-wallet-cryptoicons/src/stx.svg';
import i1483 from 'kraken-wallet-cryptoicons/src/stz.svg';
import i1484 from 'kraken-wallet-cryptoicons/src/sub.svg';
import i1485 from 'kraken-wallet-cryptoicons/src/sui.svg';
import i1486 from 'kraken-wallet-cryptoicons/src/suku.svg';
import i1487 from 'kraken-wallet-cryptoicons/src/sumo.svg';
import i1488 from 'kraken-wallet-cryptoicons/src/sun.svg';
import i1489 from 'kraken-wallet-cryptoicons/src/super.svg';
import i1490 from 'kraken-wallet-cryptoicons/src/suqa.svg';
import i1491 from 'kraken-wallet-cryptoicons/src/sure.svg';
import i1492 from 'kraken-wallet-cryptoicons/src/surv.svg';
import i1493 from 'kraken-wallet-cryptoicons/src/susd.svg';
import i1494 from 'kraken-wallet-cryptoicons/src/sushi.svg';
import i1495 from 'kraken-wallet-cryptoicons/src/suter.svg';
import i1496 from 'kraken-wallet-cryptoicons/src/swap.svg';
import i1497 from 'kraken-wallet-cryptoicons/src/swash.svg';
import i1498 from 'kraken-wallet-cryptoicons/src/sweat.svg';
import i1499 from 'kraken-wallet-cryptoicons/src/swingby.svg';
import i1500 from 'kraken-wallet-cryptoicons/src/swp.svg';
import i1501 from 'kraken-wallet-cryptoicons/src/swrv.svg';
import i1502 from 'kraken-wallet-cryptoicons/src/swt.svg';
import i1503 from 'kraken-wallet-cryptoicons/src/swth.svg';
import i1504 from 'kraken-wallet-cryptoicons/src/sxdt.svg';
import i1505 from 'kraken-wallet-cryptoicons/src/sxp.svg';
import i1506 from 'kraken-wallet-cryptoicons/src/sylo.svg';
import i1507 from 'kraken-wallet-cryptoicons/src/syn.svg';
import i1508 from 'kraken-wallet-cryptoicons/src/synth.svg';
import i1509 from 'kraken-wallet-cryptoicons/src/synx.svg';
import i1510 from 'kraken-wallet-cryptoicons/src/sys.svg';
import i1511 from 'kraken-wallet-cryptoicons/src/t.svg';
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
import i1553 from 'kraken-wallet-cryptoicons/src/ton.svg';
import i1554 from 'kraken-wallet-cryptoicons/src/tonic.svg';
import i1555 from 'kraken-wallet-cryptoicons/src/tor.svg';
import i1556 from 'kraken-wallet-cryptoicons/src/torn.svg';
import i1557 from 'kraken-wallet-cryptoicons/src/toshi.svg';
import i1558 from 'kraken-wallet-cryptoicons/src/tower.svg';
import i1559 from 'kraken-wallet-cryptoicons/src/tox.svg';
import i1560 from 'kraken-wallet-cryptoicons/src/tpay.svg';
import i1561 from 'kraken-wallet-cryptoicons/src/tra.svg';
import i1562 from 'kraken-wallet-cryptoicons/src/trac.svg';
import i1563 from 'kraken-wallet-cryptoicons/src/trade.svg';
import i1564 from 'kraken-wallet-cryptoicons/src/trb.svg';
import i1565 from 'kraken-wallet-cryptoicons/src/tremp.svg';
import i1566 from 'kraken-wallet-cryptoicons/src/trias.svg';
import i1567 from 'kraken-wallet-cryptoicons/src/tribe.svg';
import i1568 from 'kraken-wallet-cryptoicons/src/trig.svg';
import i1569 from 'kraken-wallet-cryptoicons/src/troy.svg';
import i1570 from 'kraken-wallet-cryptoicons/src/trst.svg';
import i1571 from 'kraken-wallet-cryptoicons/src/trtl.svg';
import i1572 from 'kraken-wallet-cryptoicons/src/tru.svg';
import i1573 from 'kraken-wallet-cryptoicons/src/trump.svg';
import i1574 from 'kraken-wallet-cryptoicons/src/trvl.svg';
import i1575 from 'kraken-wallet-cryptoicons/src/trx.svg';
import i1576 from 'kraken-wallet-cryptoicons/src/try.svg';
import i1577 from 'kraken-wallet-cryptoicons/src/tryb.svg';
import i1578 from 'kraken-wallet-cryptoicons/src/tt.svg';
import i1579 from 'kraken-wallet-cryptoicons/src/ttc.svg';
import i1580 from 'kraken-wallet-cryptoicons/src/ttt.svg';
import i1581 from 'kraken-wallet-cryptoicons/src/tube.svg';
import i1582 from 'kraken-wallet-cryptoicons/src/tur.svg';
import i1583 from 'kraken-wallet-cryptoicons/src/tusd.svg';
import i1584 from 'kraken-wallet-cryptoicons/src/tvk.svg';
import i1585 from 'kraken-wallet-cryptoicons/src/twt.svg';
import i1586 from 'kraken-wallet-cryptoicons/src/txa.svg';
import i1587 from 'kraken-wallet-cryptoicons/src/tybg.svg';
import i1588 from 'kraken-wallet-cryptoicons/src/tyzen.svg';
import i1589 from 'kraken-wallet-cryptoicons/src/tzc.svg';
import i1590 from 'kraken-wallet-cryptoicons/src/ubi.svg';
import i1591 from 'kraken-wallet-cryptoicons/src/ubq.svg';
import i1592 from 'kraken-wallet-cryptoicons/src/ubsn.svg';
import i1593 from 'kraken-wallet-cryptoicons/src/ubt.svg';
import i1594 from 'kraken-wallet-cryptoicons/src/ubx.svg';
import i1595 from 'kraken-wallet-cryptoicons/src/ubxt.svg';
import i1596 from 'kraken-wallet-cryptoicons/src/udoo.svg';
import i1597 from 'kraken-wallet-cryptoicons/src/ufo.svg';
import i1598 from 'kraken-wallet-cryptoicons/src/uft.svg';
import i1599 from 'kraken-wallet-cryptoicons/src/ukg.svg';
import i1600 from 'kraken-wallet-cryptoicons/src/ult.svg';
import i1601 from 'kraken-wallet-cryptoicons/src/uma.svg';
import i1602 from 'kraken-wallet-cryptoicons/src/umb.svg';
import i1603 from 'kraken-wallet-cryptoicons/src/umee.svg';
import i1604 from 'kraken-wallet-cryptoicons/src/unb.svg';
import i1605 from 'kraken-wallet-cryptoicons/src/uncx.svg';
import i1606 from 'kraken-wallet-cryptoicons/src/unfi.svg';
import i1607 from 'kraken-wallet-cryptoicons/src/uni.svg';
import i1608 from 'kraken-wallet-cryptoicons/src/unic.svg';
import i1609 from 'kraken-wallet-cryptoicons/src/unidaieth.svg';
import i1610 from 'kraken-wallet-cryptoicons/src/unilendeth.svg';
import i1611 from 'kraken-wallet-cryptoicons/src/unilinketh.svg';
import i1612 from 'kraken-wallet-cryptoicons/src/unimkreth.svg';
import i1613 from 'kraken-wallet-cryptoicons/src/uniqo.svg';
import i1614 from 'kraken-wallet-cryptoicons/src/unisetheth.svg';
import i1615 from 'kraken-wallet-cryptoicons/src/uniusdceth.svg';
import i1616 from 'kraken-wallet-cryptoicons/src/unn.svg';
import i1617 from 'kraken-wallet-cryptoicons/src/uno.svg';
import i1618 from 'kraken-wallet-cryptoicons/src/uos.svg';
import i1619 from 'kraken-wallet-cryptoicons/src/up.svg';
import i1620 from 'kraken-wallet-cryptoicons/src/upi.svg';
import i1621 from 'kraken-wallet-cryptoicons/src/upp.svg';
import i1622 from 'kraken-wallet-cryptoicons/src/uqc.svg';
import i1623 from 'kraken-wallet-cryptoicons/src/usd+.svg';
import i1624 from 'kraken-wallet-cryptoicons/src/usd.svg';
import i1625 from 'kraken-wallet-cryptoicons/src/usdc.svg';
import i1626 from 'kraken-wallet-cryptoicons/src/usdce.svg';
import i1627 from 'kraken-wallet-cryptoicons/src/usdd.svg';
import i1628 from 'kraken-wallet-cryptoicons/src/usdj.svg';
import i1629 from 'kraken-wallet-cryptoicons/src/usdn.svg';
import i1630 from 'kraken-wallet-cryptoicons/src/usdp.svg';
import i1631 from 'kraken-wallet-cryptoicons/src/usds.svg';
import i1632 from 'kraken-wallet-cryptoicons/src/usdt.svg';
import i1633 from 'kraken-wallet-cryptoicons/src/ust.svg';
import i1634 from 'kraken-wallet-cryptoicons/src/ustc.svg';
import i1635 from 'kraken-wallet-cryptoicons/src/usx.svg';
import i1636 from 'kraken-wallet-cryptoicons/src/ut.svg';
import i1637 from 'kraken-wallet-cryptoicons/src/utk.svg';
import i1638 from 'kraken-wallet-cryptoicons/src/uuu.svg';
import i1639 from 'kraken-wallet-cryptoicons/src/vader.svg';
import i1640 from 'kraken-wallet-cryptoicons/src/vai.svg';
import i1641 from 'kraken-wallet-cryptoicons/src/value.svg';
import i1642 from 'kraken-wallet-cryptoicons/src/vee.svg';
import i1643 from 'kraken-wallet-cryptoicons/src/veed.svg';
import i1644 from 'kraken-wallet-cryptoicons/src/vega.svg';
import i1645 from 'kraken-wallet-cryptoicons/src/veil.svg';
import i1646 from 'kraken-wallet-cryptoicons/src/vekwenta.svg';
import i1647 from 'kraken-wallet-cryptoicons/src/vela.svg';
import i1648 from 'kraken-wallet-cryptoicons/src/velo.svg';
import i1649 from 'kraken-wallet-cryptoicons/src/vemp.svg';
import i1650 from 'kraken-wallet-cryptoicons/src/ven.svg';
import i1651 from 'kraken-wallet-cryptoicons/src/veri.svg';
import i1652 from 'kraken-wallet-cryptoicons/src/vest.svg';
import i1653 from 'kraken-wallet-cryptoicons/src/vet.svg';
import i1654 from 'kraken-wallet-cryptoicons/src/vgx.svg';
import i1655 from 'kraken-wallet-cryptoicons/src/via.svg';
import i1656 from 'kraken-wallet-cryptoicons/src/vib.svg';
import i1657 from 'kraken-wallet-cryptoicons/src/vibe.svg';
import i1658 from 'kraken-wallet-cryptoicons/src/vid.svg';
import i1659 from 'kraken-wallet-cryptoicons/src/vidt.svg';
import i1660 from 'kraken-wallet-cryptoicons/src/vikky.svg';
import i1661 from 'kraken-wallet-cryptoicons/src/vin.svg';
import i1662 from 'kraken-wallet-cryptoicons/src/vina.svg';
import i1663 from 'kraken-wallet-cryptoicons/src/vita.svg';
import i1664 from 'kraken-wallet-cryptoicons/src/vite.svg';
import i1665 from 'kraken-wallet-cryptoicons/src/viu.svg';
import i1666 from 'kraken-wallet-cryptoicons/src/vix.svg';
import i1667 from 'kraken-wallet-cryptoicons/src/vlx.svg';
import i1668 from 'kraken-wallet-cryptoicons/src/vnx.svg';
import i1669 from 'kraken-wallet-cryptoicons/src/vol.svg';
import i1670 from 'kraken-wallet-cryptoicons/src/voxel.svg';
import i1671 from 'kraken-wallet-cryptoicons/src/vr.svg';
import i1672 from 'kraken-wallet-cryptoicons/src/vra.svg';
import i1673 from 'kraken-wallet-cryptoicons/src/vrc.svg';
import i1674 from 'kraken-wallet-cryptoicons/src/vrm.svg';
import i1675 from 'kraken-wallet-cryptoicons/src/vrs.svg';
import i1676 from 'kraken-wallet-cryptoicons/src/vrsc.svg';
import i1677 from 'kraken-wallet-cryptoicons/src/vrt.svg';
import i1678 from 'kraken-wallet-cryptoicons/src/vsp.svg';
import i1679 from 'kraken-wallet-cryptoicons/src/vsys.svg';
import i1680 from 'kraken-wallet-cryptoicons/src/vtc.svg';
import i1681 from 'kraken-wallet-cryptoicons/src/vtho.svg';
import i1682 from 'kraken-wallet-cryptoicons/src/vtr.svg';
import i1683 from 'kraken-wallet-cryptoicons/src/vvs.svg';
import i1684 from 'kraken-wallet-cryptoicons/src/vxv.svg';
import i1685 from 'kraken-wallet-cryptoicons/src/wabi.svg';
import i1686 from 'kraken-wallet-cryptoicons/src/wan.svg';
import i1687 from 'kraken-wallet-cryptoicons/src/warp.svg';
import i1688 from 'kraken-wallet-cryptoicons/src/wassie.svg';
import i1689 from 'kraken-wallet-cryptoicons/src/wavax.svg';
import i1690 from 'kraken-wallet-cryptoicons/src/waves.svg';
import i1691 from 'kraken-wallet-cryptoicons/src/wax.svg';
import i1692 from 'kraken-wallet-cryptoicons/src/waxp.svg';
import i1693 from 'kraken-wallet-cryptoicons/src/wbnb.svg';
import i1694 from 'kraken-wallet-cryptoicons/src/wbtc.svg';
import i1695 from 'kraken-wallet-cryptoicons/src/wct.svg';
import i1696 from 'kraken-wallet-cryptoicons/src/web.svg';
import i1697 from 'kraken-wallet-cryptoicons/src/wemix.svg';
import i1698 from 'kraken-wallet-cryptoicons/src/wen.svg';
import i1699 from 'kraken-wallet-cryptoicons/src/west.svg';
import i1700 from 'kraken-wallet-cryptoicons/src/weth.svg';
import i1701 from 'kraken-wallet-cryptoicons/src/wexpoly.svg';
import i1702 from 'kraken-wallet-cryptoicons/src/wftm.svg';
import i1703 from 'kraken-wallet-cryptoicons/src/wgr.svg';
import i1704 from 'kraken-wallet-cryptoicons/src/wgro.svg';
import i1705 from 'kraken-wallet-cryptoicons/src/whale.svg';
import i1706 from 'kraken-wallet-cryptoicons/src/whoren.svg';
import i1707 from 'kraken-wallet-cryptoicons/src/wib.svg';
import i1708 from 'kraken-wallet-cryptoicons/src/wicc.svg';
import i1709 from 'kraken-wallet-cryptoicons/src/wif-1.svg';
import i1710 from 'kraken-wallet-cryptoicons/src/wild.svg';
import i1711 from 'kraken-wallet-cryptoicons/src/win.svg';
import i1712 from 'kraken-wallet-cryptoicons/src/wing.svg';
import i1713 from 'kraken-wallet-cryptoicons/src/wings.svg';
import i1714 from 'kraken-wallet-cryptoicons/src/wis.svg';
import i1715 from 'kraken-wallet-cryptoicons/src/wld.svg';
import i1716 from 'kraken-wallet-cryptoicons/src/wmatic.svg';
import i1717 from 'kraken-wallet-cryptoicons/src/wmp.svg';
import i1718 from 'kraken-wallet-cryptoicons/src/wmt.svg';
import i1719 from 'kraken-wallet-cryptoicons/src/wndr.svg';
import i1720 from 'kraken-wallet-cryptoicons/src/wnxm.svg';
import i1721 from 'kraken-wallet-cryptoicons/src/wom.svg';
import i1722 from 'kraken-wallet-cryptoicons/src/wone.svg';
import i1723 from 'kraken-wallet-cryptoicons/src/woo.svg';
import i1724 from 'kraken-wallet-cryptoicons/src/wopenx.svg';
import i1725 from 'kraken-wallet-cryptoicons/src/wowow.svg';
import i1726 from 'kraken-wallet-cryptoicons/src/wozx.svg';
import i1727 from 'kraken-wallet-cryptoicons/src/wpr.svg';
import i1728 from 'kraken-wallet-cryptoicons/src/wrx.svg';
import i1729 from 'kraken-wallet-cryptoicons/src/wsienna.svg';
import i1730 from 'kraken-wallet-cryptoicons/src/wsteth.svg';
import i1731 from 'kraken-wallet-cryptoicons/src/wtbt.svg';
import i1732 from 'kraken-wallet-cryptoicons/src/wtc.svg';
import i1733 from 'kraken-wallet-cryptoicons/src/wxt.svg';
import i1734 from 'kraken-wallet-cryptoicons/src/x2y2.svg';
import i1735 from 'kraken-wallet-cryptoicons/src/xai.svg';
import i1736 from 'kraken-wallet-cryptoicons/src/xas.svg';
import i1737 from 'kraken-wallet-cryptoicons/src/xaut.svg';
import i1738 from 'kraken-wallet-cryptoicons/src/xava.svg';
import i1739 from 'kraken-wallet-cryptoicons/src/xbc.svg';
import i1740 from 'kraken-wallet-cryptoicons/src/xby.svg';
import i1741 from 'kraken-wallet-cryptoicons/src/xcad.svg';
import i1742 from 'kraken-wallet-cryptoicons/src/xch.svg';
import i1743 from 'kraken-wallet-cryptoicons/src/xchf.svg';
import i1744 from 'kraken-wallet-cryptoicons/src/xcm.svg';
import i1745 from 'kraken-wallet-cryptoicons/src/xcn.svg';
import i1746 from 'kraken-wallet-cryptoicons/src/xcp.svg';
import i1747 from 'kraken-wallet-cryptoicons/src/xcur.svg';
import i1748 from 'kraken-wallet-cryptoicons/src/xdata.svg';
import i1749 from 'kraken-wallet-cryptoicons/src/xdb.svg';
import i1750 from 'kraken-wallet-cryptoicons/src/xdc.svg';
import i1751 from 'kraken-wallet-cryptoicons/src/xdfi.svg';
import i1752 from 'kraken-wallet-cryptoicons/src/xdn.svg';
import i1753 from 'kraken-wallet-cryptoicons/src/xec.svg';
import i1754 from 'kraken-wallet-cryptoicons/src/xed.svg';
import i1755 from 'kraken-wallet-cryptoicons/src/xel.svg';
import i1756 from 'kraken-wallet-cryptoicons/src/xem.svg';
import i1757 from 'kraken-wallet-cryptoicons/src/xft.svg';
import i1758 from 'kraken-wallet-cryptoicons/src/xhv.svg';
import i1759 from 'kraken-wallet-cryptoicons/src/xido.svg';
import i1760 from 'kraken-wallet-cryptoicons/src/xin.svg';
import i1761 from 'kraken-wallet-cryptoicons/src/xlm.svg';
import i1762 from 'kraken-wallet-cryptoicons/src/xln.svg';
import i1763 from 'kraken-wallet-cryptoicons/src/xlq.svg';
import i1764 from 'kraken-wallet-cryptoicons/src/xmark.svg';
import i1765 from 'kraken-wallet-cryptoicons/src/xmg.svg';
import i1766 from 'kraken-wallet-cryptoicons/src/xmr.svg';
import i1767 from 'kraken-wallet-cryptoicons/src/xmt.svg';
import i1768 from 'kraken-wallet-cryptoicons/src/xmx.svg';
import i1769 from 'kraken-wallet-cryptoicons/src/xmy.svg';
import i1770 from 'kraken-wallet-cryptoicons/src/xnc.svg';
import i1771 from 'kraken-wallet-cryptoicons/src/xnk.svg';
import i1772 from 'kraken-wallet-cryptoicons/src/xnl.svg';
import i1773 from 'kraken-wallet-cryptoicons/src/xno.svg';
import i1774 from 'kraken-wallet-cryptoicons/src/xns.svg';
import i1775 from 'kraken-wallet-cryptoicons/src/xor.svg';
import i1776 from 'kraken-wallet-cryptoicons/src/xp.svg';
import i1777 from 'kraken-wallet-cryptoicons/src/xpa.svg';
import i1778 from 'kraken-wallet-cryptoicons/src/xpm.svg';
import i1779 from 'kraken-wallet-cryptoicons/src/xpr.svg';
import i1780 from 'kraken-wallet-cryptoicons/src/xprt.svg';
import i1781 from 'kraken-wallet-cryptoicons/src/xrd.svg';
import i1782 from 'kraken-wallet-cryptoicons/src/xrp.svg';
import i1783 from 'kraken-wallet-cryptoicons/src/xrt.svg';
import i1784 from 'kraken-wallet-cryptoicons/src/xsg.svg';
import i1785 from 'kraken-wallet-cryptoicons/src/xsn.svg';
import i1786 from 'kraken-wallet-cryptoicons/src/xsr.svg';
import i1787 from 'kraken-wallet-cryptoicons/src/xst.svg';
import i1788 from 'kraken-wallet-cryptoicons/src/xsushi.svg';
import i1789 from 'kraken-wallet-cryptoicons/src/xt.svg';
import i1790 from 'kraken-wallet-cryptoicons/src/xtag.svg';
import i1791 from 'kraken-wallet-cryptoicons/src/xtm.svg';
import i1792 from 'kraken-wallet-cryptoicons/src/xtp.svg';
import i1793 from 'kraken-wallet-cryptoicons/src/xtz.svg';
import i1794 from 'kraken-wallet-cryptoicons/src/xuc.svg';
import i1795 from 'kraken-wallet-cryptoicons/src/xvc.svg';
import i1796 from 'kraken-wallet-cryptoicons/src/xvg.svg';
import i1797 from 'kraken-wallet-cryptoicons/src/xvs.svg';
import i1798 from 'kraken-wallet-cryptoicons/src/xwc.svg';
import i1799 from 'kraken-wallet-cryptoicons/src/xym.svg';
import i1800 from 'kraken-wallet-cryptoicons/src/xyo.svg';
import i1801 from 'kraken-wallet-cryptoicons/src/xyz.svg';
import i1802 from 'kraken-wallet-cryptoicons/src/xzc.svg';
import i1803 from 'kraken-wallet-cryptoicons/src/yfdai.svg';
import i1804 from 'kraken-wallet-cryptoicons/src/yfi.svg';
import i1805 from 'kraken-wallet-cryptoicons/src/yfii.svg';
import i1806 from 'kraken-wallet-cryptoicons/src/ygg.svg';
import i1807 from 'kraken-wallet-cryptoicons/src/yld.svg';
import i1808 from 'kraken-wallet-cryptoicons/src/yop.svg';
import i1809 from 'kraken-wallet-cryptoicons/src/youc.svg';
import i1810 from 'kraken-wallet-cryptoicons/src/yoyo.svg';
import i1811 from 'kraken-wallet-cryptoicons/src/yoyow.svg';
import i1812 from 'kraken-wallet-cryptoicons/src/zai.svg';
import i1813 from 'kraken-wallet-cryptoicons/src/zar.svg';
import i1814 from 'kraken-wallet-cryptoicons/src/zb.svg';
import i1815 from 'kraken-wallet-cryptoicons/src/zcl.svg';
import i1816 from 'kraken-wallet-cryptoicons/src/zco.svg';
import i1817 from 'kraken-wallet-cryptoicons/src/zcx.svg';
import i1818 from 'kraken-wallet-cryptoicons/src/zec.svg';
import i1819 from 'kraken-wallet-cryptoicons/src/zee.svg';
import i1820 from 'kraken-wallet-cryptoicons/src/zel.svg';
import i1821 from 'kraken-wallet-cryptoicons/src/zen.svg';
import i1822 from 'kraken-wallet-cryptoicons/src/zeon.svg';
import i1823 from 'kraken-wallet-cryptoicons/src/zeta.svg';
import i1824 from 'kraken-wallet-cryptoicons/src/zil.svg';
import i1825 from 'kraken-wallet-cryptoicons/src/zip.svg';
import i1826 from 'kraken-wallet-cryptoicons/src/zks.svg';
import i1827 from 'kraken-wallet-cryptoicons/src/zkt.svg';
import i1828 from 'kraken-wallet-cryptoicons/src/zlw.svg';
import i1829 from 'kraken-wallet-cryptoicons/src/znn.svg';
import i1830 from 'kraken-wallet-cryptoicons/src/zort.svg';
import i1831 from 'kraken-wallet-cryptoicons/src/zpay.svg';
import i1832 from 'kraken-wallet-cryptoicons/src/zrx.svg';
import i1833 from 'kraken-wallet-cryptoicons/src/zusd.svg';

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
  'ada': i32,
  'adai': i33,
  'adb': i34,
  'adk': i35,
  'ads': i36,
  'adt': i37,
  'adx': i38,
  'ae': i39,
  'aenj': i40,
  'aeon': i41,
  'aergo': i42,
  'aero': i43,
  'aeth': i44,
  'aethreth': i45,
  'aethweth': i46,
  'ageur': i47,
  'agi': i48,
  'agix': i49,
  'agld': i50,
  'agrs': i51,
  'ai': i52,
  'aid': i53,
  'aidoge': i54,
  'aion': i55,
  'aioz': i56,
  'air': i57,
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
  'ali': i68,
  'alice': i69,
  'alink': i70,
  'alis': i71,
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
  'amp': i84,
  'ampl': i85,
  'anc': i86,
  'anj': i87,
  'ankr': i88,
  'ant': i89,
  'aoa': i90,
  'ape': i91,
  'apein': i92,
  'aph': i93,
  'api3': i94,
  'apl': i95,
  'appc': i96,
  'apt': i97,
  'apw': i98,
  'apx': i99,
  'apy': i100,
  'ar': i101,
  'arb': i102,
  'ardr': i103,
  'aren': i104,
  'arep': i105,
  'arix': i106,
  'ark': i107,
  'arker': i108,
  'arkm': i109,
  'armor': i110,
  'arn': i111,
  'arnx': i112,
  'aro': i113,
  'arpa': i114,
  'arrr': i115,
  'arx': i116,
  'asafe': i117,
  'asd': i118,
  'ash': i119,
  'asm': i120,
  'asnx': i121,
  'asr': i122,
  'ast': i123,
  'asta': i124,
  'astr': i125,
  'astro': i126,
  'asusd': i127,
  'atlas': i128,
  'atm': i129,
  'atmi': i130,
  'atom': i131,
  'atri': i132,
  'atusd': i133,
  'auc': i134,
  'auction': i135,
  'audio': i136,
  'auni': i137,
  'aunidaieth': i138,
  'aunilendeth': i139,
  'aunilinketh': i140,
  'aunimkreth': i141,
  'aunisetheth': i142,
  'auniusdceth': i143,
  'aur': i144,
  'aura': i145,
  'aurora': i146,
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
  'axp': i160,
  'axpr': i161,
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
  'bax': i177,
  'baxa': i178,
  'bay': i179,
  'bbk': i180,
  'bbr': i181,
  'bcc': i182,
  'bcd': i183,
  'bch': i184,
  'bcha': i185,
  'bchabc': i186,
  'bchsv': i187,
  'bcn': i188,
  'bco': i189,
  'bcpt': i190,
  'bcy': i191,
  'beam': i192,
  'bel': i193,
  'bela': i194,
  'belt': i195,
  'bepro': i196,
  'best': i197,
  'beta': i198,
  'beth': i199,
  'bf': i200,
  'bfc': i201,
  'bgb': i202,
  'bico': i203,
  'bifi': i204,
  'bit-2': i205,
  'bit': i206,
  'bitb': i207,
  'bitcny': i208,
  'bitcoin': i209,
  'bits': i210,
  'bix': i211,
  'bkx': i212,
  'blank': i213,
  'blast': i214,
  'bld': i215,
  'blitz': i216,
  'blk': i217,
  'bloc': i218,
  'block': i219,
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
  'bob': i238,
  'bobo': i239,
  'boden': i240,
  'bolt': i241,
  'bome': i242,
  'bond-2': i243,
  'bond': i244,
  'bondly': i245,
  'bone': i246,
  'bonk': i247,
  'boo': i248,
  'bora': i249,
  'bos': i250,
  'boson': i251,
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
  'btc++': i270,
  'btc': i271,
  'btcb': i272,
  'btcd': i273,
  'btcp': i274,
  'btcst': i275,
  'btcz': i276,
  'btdx': i277,
  'btg': i278,
  'btm': i279,
  'btmx': i280,
  'bto': i281,
  'btr': i282,
  'btrst': i283,
  'bts': i284,
  'btt': i285,
  'btu': i286,
  'btx': i287,
  'bu': i288,
  'bunny': i289,
  'burger': i290,
  'burp': i291,
  'burst': i292,
  'busd': i293,
  'bux': i294,
  'buy': i295,
  'bwt': i296,
  'byc': i297,
  'bz': i298,
  'bznt': i299,
  'bzrx': i300,
  'c20': i301,
  'c98': i302,
  'cag': i303,
  'cake': i304,
  'canto': i305,
  'cap': i306,
  'capp': i307,
  'car': i308,
  'card': i309,
  'carr': i310,
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
  'cel': i321,
  'celo': i322,
  'celr': i323,
  'cennz': i324,
  'cere': i325,
  'cet': i326,
  'ceth': i327,
  'cfg': i328,
  'cfi': i329,
  'cfx': i330,
  'cgg': i331,
  'chai': i332,
  'chain': i333,
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
  'clo': i350,
  'cloak': i351,
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
  'coc': i362,
  'cocn': i363,
  'cocos': i364,
  'cofi': i365,
  'coinye': i366,
  'colx': i367,
  'comb': i368,
  'combo': i369,
  'comp': i370,
  'cone': i371,
  'coni': i372,
  'core': i373,
  'corgiai': i374,
  'cos': i375,
  'cosm': i376,
  'cost': i377,
  'coti': i378,
  'cov': i379,
  'cova': i380,
  'coval': i381,
  'cover': i382,
  'cpc': i383,
  'cpool': i384,
  'cpx': i385,
  'cqt': i386,
  'cra': i387,
  'crb': i388,
  'crd': i389,
  'cre': i390,
  'cream': i391,
  'cred': i392,
  'credi': i393,
  'crep': i394,
  'cro': i395,
  'crpt': i396,
  'crts': i397,
  'cru': i398,
  'crunch': i399,
  'crv': i400,
  'crw': i401,
  'cs': i402,
  'csai': i403,
  'csc': i404,
  'csp': i405,
  'cspr': i406,
  'ctc': i407,
  'cti': i408,
  'ctk': i409,
  'ctsi': i410,
  'ctx': i411,
  'ctxc': i412,
  'cube': i413,
  'cudos': i414,
  'cult': i415,
  'cusd': i416,
  'cusdc': i417,
  'cusdt-1': i418,
  'cusdt': i419,
  'cv': i420,
  'cvc': i421,
  'cvp': i422,
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
  'dat': i443,
  'data': i444,
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
  'df': i465,
  'dfi': i466,
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
  'dmt': i480,
  'dmtr': i481,
  'dnt': i482,
  'dock': i483,
  'dodo': i484,
  'dog': i485,
  'doge': i486,
  'doginme': i487,
  'dojo': i488,
  'dola': i489,
  'dome': i490,
  'dor': i491,
  'dora': i492,
  'dorkl': i493,
  'dot': i494,
  'dpi': i495,
  'dpr': i496,
  'dpx': i497,
  'drc': i498,
  'dreams': i499,
  'drep': i500,
  'drg': i501,
  'drgn': i502,
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
  'dx': i515,
  'dxd': i516,
  'dxt': i517,
  'dydx': i518,
  'dym': i519,
  'dyn': i520,
  'dypc': i521,
  'easy': i522,
  'ebst': i523,
  'eca': i524,
  'eco': i525,
  'edg': i526,
  'edge': i527,
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
  'ela': i540,
  'elan': i541,
  'elec': i542,
  'elf': i543,
  'elg': i544,
  'ella': i545,
  'elon': i546,
  'emc': i547,
  'emc2': i548,
  'eng': i549,
  'enj': i550,
  'enq': i551,
  'enrg': i552,
  'ens': i553,
  'eos': i554,
  'eosc': i555,
  'eosdac': i556,
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
  'eth': i573,
  'eth2 v2': i574,
  'eth2': i575,
  'etha': i576,
  'ethdydx': i577,
  'etho': i578,
  'ethw': i579,
  'etn': i580,
  'etp': i581,
  'etz': i582,
  'eum': i583,
  'eur': i584,
  'euroc': i585,
  'eurs': i586,
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
  'fil': i610,
  'filda': i611,
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
  'flo': i624,
  'floki': i625,
  'flow': i626,
  'flr': i627,
  'flux': i628,
  'fly': i629,
  'foam': i630,
  'fold': i631,
  'for': i632,
  'forestplus': i633,
  'form': i634,
  'forta': i635,
  'forth': i636,
  'fota': i637,
  'fox': i638,
  'fpi': i639,
  'fpis': i640,
  'frame': i641,
  'frax': i642,
  'fren': i643,
  'frm': i644,
  'front': i645,
  'frr': i646,
  'frxeth': i647,
  'fsn': i648,
  'fst': i649,
  'ft': i650,
  'ftc': i651,
  'ftg': i652,
  'ftm': i653,
  'ftt': i654,
  'fuel': i655,
  'fun': i656,
  'fuse': i657,
  'fx': i658,
  'fxc': i659,
  'fxs': i660,
  'fxt': i661,
  'gafi': i662,
  'gal': i663,
  'gala': i664,
  'gam': i665,
  'gamb': i666,
  'game': i667,
  'gamee': i668,
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
  'gen': i681,
  'gens': i682,
  'geo': i683,
  'gf': i684,
  'gfi': i685,
  'ggc': i686,
  'ggg': i687,
  'gho': i688,
  'ghst': i689,
  'ghx': i690,
  'gin': i691,
  'giv': i692,
  'glch': i693,
  'gld': i694,
  'glm': i695,
  'glmr': i696,
  'glq': i697,
  'gls': i698,
  'gmee': i699,
  'gmt': i700,
  'gmx': i701,
  'gno': i702,
  'gns': i703,
  'gnt': i704,
  'gnx': i705,
  'go': i706,
  'goc': i707,
  'gom2': i708,
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
  'gt': i722,
  'gtc': i723,
  'gto': i724,
  'guild': i725,
  'gup': i726,
  'gusd': i727,
  'gvt': i728,
  'gxc': i729,
  'gxs': i730,
  'gyen': i731,
  'h3ro3s': i732,
  'hai': i733,
  'hair': i734,
  'haka': i735,
  'hakka': i736,
  'han': i737,
  'hanep': i738,
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
  'her': i751,
  'hero': i752,
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
  'hot-x': i768,
  'hot': i769,
  'hotcross': i770,
  'hpb': i771,
  'hpo': i772,
  'hpp': i773,
  'hsr': i774,
  'ht': i775,
  'html': i776,
  'htr': i777,
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
  'id': i793,
  'idai': i794,
  'idea': i795,
  'idex': i796,
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
  'iot': i822,
  'iota': i823,
  'iotx': i824,
  'iq-2': i825,
  'iq': i826,
  'iq50': i827,
  'iqn': i828,
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
  'jlp': i843,
  'jnt': i844,
  'joe': i845,
  'jrt': i846,
  'jst': i847,
  'jto': i848,
  'juno': i849,
  'jup': i850,
  'juv': i851,
  'kai': i852,
  'kar': i853,
  'karma': i854,
  'kas': i855,
  'kat': i856,
  'kava': i857,
  'kbc': i858,
  'kbtc': i859,
  'kcs': i860,
  'kda': i861,
  'kdon': i862,
  'keep': i863,
  'key': i864,
  'keycat': i865,
  'kick': i866,
  'kilt': i867,
  'kin': i868,
  'kint': i869,
  'kira': i870,
  'kiro': i871,
  'klay': i872,
  'klv': i873,
  'kma': i874,
  'kmd': i875,
  'knc': i876,
  'kndc': i877,
  'kok': i878,
  'kol': i879,
  'kono': i880,
  'kore': i881,
  'kp3r': i882,
  'krb': i883,
  'krl': i884,
  'krw': i885,
  'ksm': i886,
  'ksp': i887,
  'ktn': i888,
  'kub': i889,
  'kyl': i890,
  'la': i891,
  'lab': i892,
  'lace': i893,
  'ladys': i894,
  'lamb': i895,
  'land': i896,
  'layer': i897,
  'lazio': i898,
  'lba': i899,
  'lbc': i900,
  'lcc': i901,
  'lcdot': i902,
  'lcx': i903,
  'ldo': i904,
  'lend': i905,
  'leo': i906,
  'lever': i907,
  'lien': i908,
  'like': i909,
  'lina': i910,
  'linea': i911,
  'link': i912,
  'lit': i913,
  'lith': i914,
  'lkk': i915,
  'lky': i916,
  'lmc': i917,
  'ln': i918,
  'lnchx': i919,
  'loc': i920,
  'locg': i921,
  'lode': i922,
  'loka': i923,
  'loki': i924,
  'lon': i925,
  'looks': i926,
  'loom': i927,
  'love': i928,
  'lpf': i929,
  'lpool': i930,
  'lpt': i931,
  'lqd': i932,
  'lqty': i933,
  'lrc': i934,
  'lrg': i935,
  'lsk': i936,
  'lss': i937,
  'ltc': i938,
  'lto': i939,
  'ltx': i940,
  'luca': i941,
  'lun': i942,
  'luna': i943,
  'lunc': i944,
  'lusd': i945,
  'lxt': i946,
  'lym': i947,
  'lyxe': i948,
  'maapl': i949,
  'maga': i950,
  'magic': i951,
  'maha': i952,
  'mai': i953,
  'maid': i954,
  'maki': i955,
  'man': i956,
  'mana': i957,
  'manta': i958,
  'map': i959,
  'maps': i960,
  'marsh': i961,
  'mask': i962,
  'mass': i963,
  'math': i964,
  'matic': i965,
  'maticx': i966,
  'matter': i967,
  'mb': i968,
  'mbc': i969,
  'mbl': i970,
  'mbox': i971,
  'mc': i972,
  'mcb': i973,
  'mco': i974,
  'mco2': i975,
  'mcx': i976,
  'mda': i977,
  'mdao': i978,
  'mds': i979,
  'mdt': i980,
  'mdx': i981,
  'med': i982,
  'medx': i983,
  'meetone': i984,
  'mem': i985,
  'meme': i986,
  'mer': i987,
  'met': i988,
  'meta': i989,
  'metano': i990,
  'metis': i991,
  'mew': i992,
  'mex': i993,
  'mfg': i994,
  'mft': i995,
  'mhc': i996,
  'mim': i997,
  'mimatic': i998,
  'mina': i999,
  'miota': i1000,
  'mir': i1001,
  'mith': i1002,
  'mitx': i1003,
  'mjt': i1004,
  'mkr': i1005,
  'mlb': i1006,
  'mlk': i1007,
  'mln': i1008,
  'mmt': i1009,
  'mmxn': i1010,
  'mnde': i1011,
  'mnet': i1012,
  'mngo': i1013,
  'mns': i1014,
  'mnst': i1015,
  'mnt': i1016,
  'mntl': i1017,
  'mnw': i1018,
  'moac': i1019,
  'mob': i1020,
  'mochi': i1021,
  'mod': i1022,
  'modefi': i1023,
  'mof': i1024,
  'mog': i1025,
  'mom': i1026,
  'mona': i1027,
  'moni': i1028,
  'moon': i1029,
  'mot': i1030,
  'movez': i1031,
  'movr': i1032,
  'mph': i1033,
  'mpl': i1034,
  'msol': i1035,
  'msr': i1036,
  'mswap': i1037,
  'mta': i1038,
  'mtc': i1039,
  'mth': i1040,
  'mtl': i1041,
  'mtn': i1042,
  'mtrg': i1043,
  'mts': i1044,
  'mtv': i1045,
  'mue': i1046,
  'multi': i1047,
  'musd': i1048,
  'music': i1049,
  'mvc': i1050,
  'mvl': i1051,
  'mvp': i1052,
  'mwat': i1053,
  'mwc': i1054,
  'mx': i1055,
  'mxc': i1056,
  'mxm': i1057,
  'mxw': i1058,
  'myb': i1059,
  'myro': i1060,
  'myst': i1061,
  'naka': i1062,
  'nano': i1063,
  'nas': i1064,
  'nav': i1065,
  'nbs': i1066,
  'nbt': i1067,
  'ncash': i1068,
  'nct': i1069,
  'ndau': i1070,
  'near': i1071,
  'nebl': i1072,
  'nec': i1073,
  'nem': i1074,
  'neo': i1075,
  'neon': i1076,
  'neos': i1077,
  'neox': i1078,
  'nest': i1079,
  'neu': i1080,
  'new': i1081,
  'nex': i1082,
  'nexo': i1083,
  'nexxo': i1084,
  'nft': i1085,
  'nftb': i1086,
  'nftx': i1087,
  'ngc': i1088,
  'ngm': i1089,
  'nif': i1090,
  'nim': i1091,
  'niox': i1092,
  'nix': i1093,
  'nkn': i1094,
  'nlc2': i1095,
  'nlg': i1096,
  'nmc': i1097,
  'nmr': i1098,
  'noia': i1099,
  'nord': i1100,
  'normie': i1101,
  'normilio': i1102,
  'nox': i1103,
  'nper': i1104,
  'npxs': i1105,
  'nrg': i1106,
  'nrv': i1107,
  'nrve': i1108,
  'ntic': i1109,
  'ntrn': i1110,
  'ntvrk': i1111,
  'nu': i1112,
  'nuls': i1113,
  'num': i1114,
  'nusd': i1115,
  'nwc': i1116,
  'nxm': i1117,
  'nxs': i1118,
  'nxt': i1119,
  'nye': i1120,
  'nym': i1121,
  'oag': i1122,
  'oak': i1123,
  'oax': i1124,
  'ocean': i1125,
  'ocn': i1126,
  'oddz': i1127,
  'ode': i1128,
  'og': i1129,
  'ogn': i1130,
  'ogo': i1131,
  'ohm': i1132,
  'oil': i1133,
  'ok': i1134,
  'okb': i1135,
  'oks': i1136,
  'olt': i1137,
  'om': i1138,
  'omg': i1139,
  'omni': i1140,
  'ondo': i1141,
  'one': i1142,
  'ong': i1143,
  'onion': i1144,
  'onston': i1145,
  'ont': i1146,
  'ooe': i1147,
  'ooki': i1148,
  'oot': i1149,
  'op': i1150,
  'open': i1151,
  'opium': i1152,
  'opq': i1153,
  'ops': i1154,
  'opsec': i1155,
  'opul': i1156,
  'opx': i1157,
  'orai': i1158,
  'orbs': i1159,
  'orc': i1160,
  'orca': i1161,
  'orcat': i1162,
  'ordi': i1163,
  'orn': i1164,
  'osmo': i1165,
  'ost': i1166,
  'ouro': i1167,
  'ousd': i1168,
  'ovc': i1169,
  'oxen': i1170,
  'oxt': i1171,
  'oxy': i1172,
  'pac': i1173,
  'pai': i1174,
  'paint': i1175,
  'pal': i1176,
  'palm': i1177,
  'paper': i1178,
  'par': i1179,
  'part': i1180,
  'pasc': i1181,
  'pax': i1182,
  'paxg': i1183,
  'pay': i1184,
  'payx': i1185,
  'pazzi': i1186,
  'pbirb': i1187,
  'pbr': i1188,
  'pbtc': i1189,
  'pbx': i1190,
  'pchu': i1191,
  'pcx': i1192,
  'pdex': i1193,
  'pearl': i1194,
  'peas': i1195,
  'pel': i1196,
  'pendle': i1197,
  'pepe': i1198,
  'perl': i1199,
  'perp': i1200,
  'pha': i1201,
  'phb': i1202,
  'phnx': i1203,
  'phtk': i1204,
  'phx': i1205,
  'pickle': i1206,
  'pink': i1207,
  'pip': i1208,
  'pirl': i1209,
  'pivx': i1210,
  'pkb': i1211,
  'pla': i1212,
  'play': i1213,
  'plbt': i1214,
  'plc': i1215,
  'pldai': i1216,
  'plgr': i1217,
  'plr': i1218,
  'plt': i1219,
  'pltc': i1220,
  'plu': i1221,
  'plusdc': i1222,
  'pma': i1223,
  'pmgt': i1224,
  'pmon': i1225,
  'png': i1226,
  'pnk': i1227,
  'pnt': i1228,
  'poa': i1229,
  'poe': i1230,
  'pokt': i1231,
  'pol': i1232,
  'polc': i1233,
  'polis': i1234,
  'polk': i1235,
  'pols': i1236,
  'polx': i1237,
  'poly-2': i1238,
  'poly': i1239,
  'polyx': i1240,
  'pom': i1241,
  'pond': i1242,
  'ponke': i1243,
  'pont': i1244,
  'pool': i1245,
  'pop': i1246,
  'popcat': i1247,
  'pork': i1248,
  'porto': i1249,
  'pot': i1250,
  'potnoy': i1251,
  'power': i1252,
  'powr': i1253,
  'ppay': i1254,
  'ppc': i1255,
  'ppp': i1256,
  'ppt': i1257,
  'pre': i1258,
  'premia': i1259,
  'prime': i1260,
  'prl': i1261,
  'pro': i1262,
  'prom': i1263,
  'props': i1264,
  'pros': i1265,
  'prq': i1266,
  'psg': i1267,
  'psp': i1268,
  'pst': i1269,
  'pstake': i1270,
  'ptc': i1271,
  'ptoy': i1272,
  'pundix': i1273,
  'pups': i1274,
  'pyr': i1275,
  'pyth': i1276,
  'pyusd': i1277,
  'qash': i1278,
  'qbit': i1279,
  'qi': i1280,
  'qkc': i1281,
  'qlc': i1282,
  'qnt': i1283,
  'qqq': i1284,
  'qrdo': i1285,
  'qrl': i1286,
  'qsp': i1287,
  'qtum': i1288,
  'quick': i1289,
  'qun': i1290,
  'qwark': i1291,
  'r': i1292,
  'raca': i1293,
  'rad': i1294,
  'radar': i1295,
  'rads': i1296,
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
  'ren': i1315,
  'renbtc': i1316,
  'render': i1317,
  'renfil': i1318,
  'rep': i1319,
  'req': i1320,
  'reth': i1321,
  'rev': i1322,
  'revo': i1323,
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
  'rsv': i1349,
  'ruff': i1350,
  'rune': i1351,
  'rvn': i1352,
  'rvr': i1353,
  'ryo': i1354,
  's': i1355,
  'safemoon': i1356,
  'sai': i1357,
  'saito': i1358,
  'salt': i1359,
  'samo': i1360,
  'san': i1361,
  'sand': i1362,
  'santos': i1363,
  'sapp': i1364,
  'sar': i1365,
  'savax': i1366,
  'sbd': i1367,
  'sbr': i1368,
  'sbtc': i1369,
  'sc': i1370,
  'sclp': i1371,
  'scrl': i1372,
  'scrt': i1373,
  'sd': i1374,
  'sdao': i1375,
  'sdl': i1376,
  'sdn': i1377,
  'sdt': i1378,
  'seele': i1379,
  'sefi': i1380,
  'sei': i1381,
  'sem': i1382,
  'senso': i1383,
  'seq': i1384,
  'sero': i1385,
  'seth': i1386,
  'seth2': i1387,
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
  'shr': i1403,
  'shroom': i1404,
  'shx': i1405,
  'si': i1406,
  'sia': i1407,
  'sib': i1408,
  'silo': i1409,
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
  'sol': i1435,
  'solama': i1436,
  'solid': i1437,
  'solo': i1438,
  'solr': i1439,
  'solve': i1440,
  'sos': i1441,
  'soul': i1442,
  'sov': i1443,
  'spank': i1444,
  'sparta': i1445,
  'spell': i1446,
  'sphr': i1447,
  'sphtx': i1448,
  'spi': i1449,
  'spike': i1450,
  'spk': i1451,
  'spn': i1452,
  'spnd': i1453,
  'spr': i1454,
  'srm': i1455,
  'srn': i1456,
  'ssv': i1457,
  'stak': i1458,
  'stake': i1459,
  'stan': i1460,
  'starly': i1461,
  'start': i1462,
  'stc': i1463,
  'steem': i1464,
  'step': i1465,
  'steth-1': i1466,
  'steth': i1467,
  'stg': i1468,
  'stkaave': i1469,
  'stklyra': i1470,
  'stmatic': i1471,
  'stmx': i1472,
  'stnd': i1473,
  'storj': i1474,
  'storm': i1475,
  'stpt': i1476,
  'stq': i1477,
  'strat': i1478,
  'strax': i1479,
  'strk': i1480,
  'strong': i1481,
  'stx': i1482,
  'stz': i1483,
  'sub': i1484,
  'sui': i1485,
  'suku': i1486,
  'sumo': i1487,
  'sun': i1488,
  'super': i1489,
  'suqa': i1490,
  'sure': i1491,
  'surv': i1492,
  'susd': i1493,
  'sushi': i1494,
  'suter': i1495,
  'swap': i1496,
  'swash': i1497,
  'sweat': i1498,
  'swingby': i1499,
  'swp': i1500,
  'swrv': i1501,
  'swt': i1502,
  'swth': i1503,
  'sxdt': i1504,
  'sxp': i1505,
  'sylo': i1506,
  'syn': i1507,
  'synth': i1508,
  'synx': i1509,
  'sys': i1510,
  't': i1511,
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
  'ton': i1553,
  'tonic': i1554,
  'tor': i1555,
  'torn': i1556,
  'toshi': i1557,
  'tower': i1558,
  'tox': i1559,
  'tpay': i1560,
  'tra': i1561,
  'trac': i1562,
  'trade': i1563,
  'trb': i1564,
  'tremp': i1565,
  'trias': i1566,
  'tribe': i1567,
  'trig': i1568,
  'troy': i1569,
  'trst': i1570,
  'trtl': i1571,
  'tru': i1572,
  'trump': i1573,
  'trvl': i1574,
  'trx': i1575,
  'try': i1576,
  'tryb': i1577,
  'tt': i1578,
  'ttc': i1579,
  'ttt': i1580,
  'tube': i1581,
  'tur': i1582,
  'tusd': i1583,
  'tvk': i1584,
  'twt': i1585,
  'txa': i1586,
  'tybg': i1587,
  'tyzen': i1588,
  'tzc': i1589,
  'ubi': i1590,
  'ubq': i1591,
  'ubsn': i1592,
  'ubt': i1593,
  'ubx': i1594,
  'ubxt': i1595,
  'udoo': i1596,
  'ufo': i1597,
  'uft': i1598,
  'ukg': i1599,
  'ult': i1600,
  'uma': i1601,
  'umb': i1602,
  'umee': i1603,
  'unb': i1604,
  'uncx': i1605,
  'unfi': i1606,
  'uni': i1607,
  'unic': i1608,
  'unidaieth': i1609,
  'unilendeth': i1610,
  'unilinketh': i1611,
  'unimkreth': i1612,
  'uniqo': i1613,
  'unisetheth': i1614,
  'uniusdceth': i1615,
  'unn': i1616,
  'uno': i1617,
  'uos': i1618,
  'up': i1619,
  'upi': i1620,
  'upp': i1621,
  'uqc': i1622,
  'usd+': i1623,
  'usd': i1624,
  'usdc': i1625,
  'usdce': i1626,
  'usdd': i1627,
  'usdj': i1628,
  'usdn': i1629,
  'usdp': i1630,
  'usds': i1631,
  'usdt': i1632,
  'ust': i1633,
  'ustc': i1634,
  'usx': i1635,
  'ut': i1636,
  'utk': i1637,
  'uuu': i1638,
  'vader': i1639,
  'vai': i1640,
  'value': i1641,
  'vee': i1642,
  'veed': i1643,
  'vega': i1644,
  'veil': i1645,
  'vekwenta': i1646,
  'vela': i1647,
  'velo': i1648,
  'vemp': i1649,
  'ven': i1650,
  'veri': i1651,
  'vest': i1652,
  'vet': i1653,
  'vgx': i1654,
  'via': i1655,
  'vib': i1656,
  'vibe': i1657,
  'vid': i1658,
  'vidt': i1659,
  'vikky': i1660,
  'vin': i1661,
  'vina': i1662,
  'vita': i1663,
  'vite': i1664,
  'viu': i1665,
  'vix': i1666,
  'vlx': i1667,
  'vnx': i1668,
  'vol': i1669,
  'voxel': i1670,
  'vr': i1671,
  'vra': i1672,
  'vrc': i1673,
  'vrm': i1674,
  'vrs': i1675,
  'vrsc': i1676,
  'vrt': i1677,
  'vsp': i1678,
  'vsys': i1679,
  'vtc': i1680,
  'vtho': i1681,
  'vtr': i1682,
  'vvs': i1683,
  'vxv': i1684,
  'wabi': i1685,
  'wan': i1686,
  'warp': i1687,
  'wassie': i1688,
  'wavax': i1689,
  'waves': i1690,
  'wax': i1691,
  'waxp': i1692,
  'wbnb': i1693,
  'wbtc': i1694,
  'wct': i1695,
  'web': i1696,
  'wemix': i1697,
  'wen': i1698,
  'west': i1699,
  'weth': i1700,
  'wexpoly': i1701,
  'wftm': i1702,
  'wgr': i1703,
  'wgro': i1704,
  'whale': i1705,
  'whoren': i1706,
  'wib': i1707,
  'wicc': i1708,
  'wif-1': i1709,
  'wild': i1710,
  'win': i1711,
  'wing': i1712,
  'wings': i1713,
  'wis': i1714,
  'wld': i1715,
  'wmatic': i1716,
  'wmp': i1717,
  'wmt': i1718,
  'wndr': i1719,
  'wnxm': i1720,
  'wom': i1721,
  'wone': i1722,
  'woo': i1723,
  'wopenx': i1724,
  'wowow': i1725,
  'wozx': i1726,
  'wpr': i1727,
  'wrx': i1728,
  'wsienna': i1729,
  'wsteth': i1730,
  'wtbt': i1731,
  'wtc': i1732,
  'wxt': i1733,
  'x2y2': i1734,
  'xai': i1735,
  'xas': i1736,
  'xaut': i1737,
  'xava': i1738,
  'xbc': i1739,
  'xby': i1740,
  'xcad': i1741,
  'xch': i1742,
  'xchf': i1743,
  'xcm': i1744,
  'xcn': i1745,
  'xcp': i1746,
  'xcur': i1747,
  'xdata': i1748,
  'xdb': i1749,
  'xdc': i1750,
  'xdfi': i1751,
  'xdn': i1752,
  'xec': i1753,
  'xed': i1754,
  'xel': i1755,
  'xem': i1756,
  'xft': i1757,
  'xhv': i1758,
  'xido': i1759,
  'xin': i1760,
  'xlm': i1761,
  'xln': i1762,
  'xlq': i1763,
  'xmark': i1764,
  'xmg': i1765,
  'xmr': i1766,
  'xmt': i1767,
  'xmx': i1768,
  'xmy': i1769,
  'xnc': i1770,
  'xnk': i1771,
  'xnl': i1772,
  'xno': i1773,
  'xns': i1774,
  'xor': i1775,
  'xp': i1776,
  'xpa': i1777,
  'xpm': i1778,
  'xpr': i1779,
  'xprt': i1780,
  'xrd': i1781,
  'xrp': i1782,
  'xrt': i1783,
  'xsg': i1784,
  'xsn': i1785,
  'xsr': i1786,
  'xst': i1787,
  'xsushi': i1788,
  'xt': i1789,
  'xtag': i1790,
  'xtm': i1791,
  'xtp': i1792,
  'xtz': i1793,
  'xuc': i1794,
  'xvc': i1795,
  'xvg': i1796,
  'xvs': i1797,
  'xwc': i1798,
  'xym': i1799,
  'xyo': i1800,
  'xyz': i1801,
  'xzc': i1802,
  'yfdai': i1803,
  'yfi': i1804,
  'yfii': i1805,
  'ygg': i1806,
  'yld': i1807,
  'yop': i1808,
  'youc': i1809,
  'yoyo': i1810,
  'yoyow': i1811,
  'zai': i1812,
  'zar': i1813,
  'zb': i1814,
  'zcl': i1815,
  'zco': i1816,
  'zcx': i1817,
  'zec': i1818,
  'zee': i1819,
  'zel': i1820,
  'zen': i1821,
  'zeon': i1822,
  'zeta': i1823,
  'zil': i1824,
  'zip': i1825,
  'zks': i1826,
  'zkt': i1827,
  'zlw': i1828,
  'znn': i1829,
  'zort': i1830,
  'zpay': i1831,
  'zrx': i1832,
  'zusd': i1833,
};

const mapNetworkNameToTokenSymbol: Record<string, string> = {
  arbitrum: 'arb',
  dogecoin: 'doge',
  ethereum: 'eth',
  ethereumTestnetSepolia: 'eth',
  HDsegwitBech32: 'btc',
  optimism: 'op',
  polygon: 'matic',
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
