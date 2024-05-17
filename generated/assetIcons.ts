import React from 'react';
import { SvgProps } from 'react-native-svg';
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
import i214 from 'kraken-wallet-cryptoicons/src/bld.svg';
import i215 from 'kraken-wallet-cryptoicons/src/blitz.svg';
import i216 from 'kraken-wallet-cryptoicons/src/blk.svg';
import i217 from 'kraken-wallet-cryptoicons/src/bloc.svg';
import i218 from 'kraken-wallet-cryptoicons/src/block.svg';
import i219 from 'kraken-wallet-cryptoicons/src/blok.svg';
import i220 from 'kraken-wallet-cryptoicons/src/blt.svg';
import i221 from 'kraken-wallet-cryptoicons/src/blue.svg';
import i222 from 'kraken-wallet-cryptoicons/src/blur.svg';
import i223 from 'kraken-wallet-cryptoicons/src/blz.svg';
import i224 from 'kraken-wallet-cryptoicons/src/bmc.svg';
import i225 from 'kraken-wallet-cryptoicons/src/bmda.svg';
import i226 from 'kraken-wallet-cryptoicons/src/bmon.svg';
import i227 from 'kraken-wallet-cryptoicons/src/bmx.svg';
import i228 from 'kraken-wallet-cryptoicons/src/bnana.svg';
import i229 from 'kraken-wallet-cryptoicons/src/bnb.svg';
import i230 from 'kraken-wallet-cryptoicons/src/bnc.svg';
import i231 from 'kraken-wallet-cryptoicons/src/bnk.svg';
import i232 from 'kraken-wallet-cryptoicons/src/bns.svg';
import i233 from 'kraken-wallet-cryptoicons/src/bnt.svg';
import i234 from 'kraken-wallet-cryptoicons/src/bnty.svg';
import i235 from 'kraken-wallet-cryptoicons/src/bnx.svg';
import i236 from 'kraken-wallet-cryptoicons/src/boa.svg';
import i237 from 'kraken-wallet-cryptoicons/src/bob.svg';
import i238 from 'kraken-wallet-cryptoicons/src/bobo.svg';
import i239 from 'kraken-wallet-cryptoicons/src/boden.svg';
import i240 from 'kraken-wallet-cryptoicons/src/bolt.svg';
import i241 from 'kraken-wallet-cryptoicons/src/bome.svg';
import i242 from 'kraken-wallet-cryptoicons/src/bond-2.svg';
import i243 from 'kraken-wallet-cryptoicons/src/bond.svg';
import i244 from 'kraken-wallet-cryptoicons/src/bondly.svg';
import i245 from 'kraken-wallet-cryptoicons/src/bone.svg';
import i246 from 'kraken-wallet-cryptoicons/src/bonk.svg';
import i247 from 'kraken-wallet-cryptoicons/src/boo.svg';
import i248 from 'kraken-wallet-cryptoicons/src/bora.svg';
import i249 from 'kraken-wallet-cryptoicons/src/bos.svg';
import i250 from 'kraken-wallet-cryptoicons/src/boson.svg';
import i251 from 'kraken-wallet-cryptoicons/src/bot.svg';
import i252 from 'kraken-wallet-cryptoicons/src/botto.svg';
import i253 from 'kraken-wallet-cryptoicons/src/botx.svg';
import i254 from 'kraken-wallet-cryptoicons/src/box.svg';
import i255 from 'kraken-wallet-cryptoicons/src/bpt.svg';
import i256 from 'kraken-wallet-cryptoicons/src/bqx.svg';
import i257 from 'kraken-wallet-cryptoicons/src/brd.svg';
import i258 from 'kraken-wallet-cryptoicons/src/brett.svg';
import i259 from 'kraken-wallet-cryptoicons/src/brg.svg';
import i260 from 'kraken-wallet-cryptoicons/src/brise.svg';
import i261 from 'kraken-wallet-cryptoicons/src/briun.svg';
import i262 from 'kraken-wallet-cryptoicons/src/brk.svg';
import i263 from 'kraken-wallet-cryptoicons/src/brx.svg';
import i264 from 'kraken-wallet-cryptoicons/src/brz.svg';
import i265 from 'kraken-wallet-cryptoicons/src/bsd.svg';
import i266 from 'kraken-wallet-cryptoicons/src/bst.svg';
import i267 from 'kraken-wallet-cryptoicons/src/bsv.svg';
import i268 from 'kraken-wallet-cryptoicons/src/bsw.svg';
import i269 from 'kraken-wallet-cryptoicons/src/btc++.svg';
import i270 from 'kraken-wallet-cryptoicons/src/btc.svg';
import i271 from 'kraken-wallet-cryptoicons/src/btcb.svg';
import i272 from 'kraken-wallet-cryptoicons/src/btcd.svg';
import i273 from 'kraken-wallet-cryptoicons/src/btcp.svg';
import i274 from 'kraken-wallet-cryptoicons/src/btcst.svg';
import i275 from 'kraken-wallet-cryptoicons/src/btcz.svg';
import i276 from 'kraken-wallet-cryptoicons/src/btdx.svg';
import i277 from 'kraken-wallet-cryptoicons/src/btg.svg';
import i278 from 'kraken-wallet-cryptoicons/src/btm.svg';
import i279 from 'kraken-wallet-cryptoicons/src/btmx.svg';
import i280 from 'kraken-wallet-cryptoicons/src/bto.svg';
import i281 from 'kraken-wallet-cryptoicons/src/btr.svg';
import i282 from 'kraken-wallet-cryptoicons/src/btrst.svg';
import i283 from 'kraken-wallet-cryptoicons/src/bts.svg';
import i284 from 'kraken-wallet-cryptoicons/src/btt.svg';
import i285 from 'kraken-wallet-cryptoicons/src/btu.svg';
import i286 from 'kraken-wallet-cryptoicons/src/btx.svg';
import i287 from 'kraken-wallet-cryptoicons/src/bu.svg';
import i288 from 'kraken-wallet-cryptoicons/src/bunny.svg';
import i289 from 'kraken-wallet-cryptoicons/src/burger.svg';
import i290 from 'kraken-wallet-cryptoicons/src/burp.svg';
import i291 from 'kraken-wallet-cryptoicons/src/burst.svg';
import i292 from 'kraken-wallet-cryptoicons/src/busd.svg';
import i293 from 'kraken-wallet-cryptoicons/src/bux.svg';
import i294 from 'kraken-wallet-cryptoicons/src/buy.svg';
import i295 from 'kraken-wallet-cryptoicons/src/bwt.svg';
import i296 from 'kraken-wallet-cryptoicons/src/byc.svg';
import i297 from 'kraken-wallet-cryptoicons/src/bz.svg';
import i298 from 'kraken-wallet-cryptoicons/src/bznt.svg';
import i299 from 'kraken-wallet-cryptoicons/src/bzrx.svg';
import i300 from 'kraken-wallet-cryptoicons/src/c20.svg';
import i301 from 'kraken-wallet-cryptoicons/src/c98.svg';
import i302 from 'kraken-wallet-cryptoicons/src/cag.svg';
import i303 from 'kraken-wallet-cryptoicons/src/cake.svg';
import i304 from 'kraken-wallet-cryptoicons/src/canto.svg';
import i305 from 'kraken-wallet-cryptoicons/src/cap.svg';
import i306 from 'kraken-wallet-cryptoicons/src/capp.svg';
import i307 from 'kraken-wallet-cryptoicons/src/car.svg';
import i308 from 'kraken-wallet-cryptoicons/src/card.svg';
import i309 from 'kraken-wallet-cryptoicons/src/carr.svg';
import i310 from 'kraken-wallet-cryptoicons/src/cas.svg';
import i311 from 'kraken-wallet-cryptoicons/src/cbat.svg';
import i312 from 'kraken-wallet-cryptoicons/src/cbc.svg';
import i313 from 'kraken-wallet-cryptoicons/src/cbeth.svg';
import i314 from 'kraken-wallet-cryptoicons/src/cbt.svg';
import i315 from 'kraken-wallet-cryptoicons/src/cccx.svg';
import i316 from 'kraken-wallet-cryptoicons/src/cce.svg';
import i317 from 'kraken-wallet-cryptoicons/src/ccxx.svg';
import i318 from 'kraken-wallet-cryptoicons/src/cdai.svg';
import i319 from 'kraken-wallet-cryptoicons/src/cdt.svg';
import i320 from 'kraken-wallet-cryptoicons/src/cel.svg';
import i321 from 'kraken-wallet-cryptoicons/src/celo.svg';
import i322 from 'kraken-wallet-cryptoicons/src/celr.svg';
import i323 from 'kraken-wallet-cryptoicons/src/cennz.svg';
import i324 from 'kraken-wallet-cryptoicons/src/cere.svg';
import i325 from 'kraken-wallet-cryptoicons/src/cet.svg';
import i326 from 'kraken-wallet-cryptoicons/src/ceth.svg';
import i327 from 'kraken-wallet-cryptoicons/src/cfg.svg';
import i328 from 'kraken-wallet-cryptoicons/src/cfi.svg';
import i329 from 'kraken-wallet-cryptoicons/src/cfx.svg';
import i330 from 'kraken-wallet-cryptoicons/src/cgg.svg';
import i331 from 'kraken-wallet-cryptoicons/src/chai.svg';
import i332 from 'kraken-wallet-cryptoicons/src/chain.svg';
import i333 from 'kraken-wallet-cryptoicons/src/chat.svg';
import i334 from 'kraken-wallet-cryptoicons/src/chcb.svg';
import i335 from 'kraken-wallet-cryptoicons/src/chess.svg';
import i336 from 'kraken-wallet-cryptoicons/src/chi.svg';
import i337 from 'kraken-wallet-cryptoicons/src/chmb.svg';
import i338 from 'kraken-wallet-cryptoicons/src/cho.svg';
import i339 from 'kraken-wallet-cryptoicons/src/chp.svg';
import i340 from 'kraken-wallet-cryptoicons/src/chr.svg';
import i341 from 'kraken-wallet-cryptoicons/src/chsb.svg';
import i342 from 'kraken-wallet-cryptoicons/src/chz.svg';
import i343 from 'kraken-wallet-cryptoicons/src/cirus.svg';
import i344 from 'kraken-wallet-cryptoicons/src/city.svg';
import i345 from 'kraken-wallet-cryptoicons/src/cix100.svg';
import i346 from 'kraken-wallet-cryptoicons/src/ckb.svg';
import i347 from 'kraken-wallet-cryptoicons/src/clam.svg';
import i348 from 'kraken-wallet-cryptoicons/src/clh.svg';
import i349 from 'kraken-wallet-cryptoicons/src/clo.svg';
import i350 from 'kraken-wallet-cryptoicons/src/cloak.svg';
import i351 from 'kraken-wallet-cryptoicons/src/clout.svg';
import i352 from 'kraken-wallet-cryptoicons/src/club.svg';
import i353 from 'kraken-wallet-cryptoicons/src/clv.svg';
import i354 from 'kraken-wallet-cryptoicons/src/cmct.svg';
import i355 from 'kraken-wallet-cryptoicons/src/cmm.svg';
import i356 from 'kraken-wallet-cryptoicons/src/cmt.svg';
import i357 from 'kraken-wallet-cryptoicons/src/cnc.svg';
import i358 from 'kraken-wallet-cryptoicons/src/cnd.svg';
import i359 from 'kraken-wallet-cryptoicons/src/cnx.svg';
import i360 from 'kraken-wallet-cryptoicons/src/cob.svg';
import i361 from 'kraken-wallet-cryptoicons/src/coc.svg';
import i362 from 'kraken-wallet-cryptoicons/src/cocn.svg';
import i363 from 'kraken-wallet-cryptoicons/src/cocos.svg';
import i364 from 'kraken-wallet-cryptoicons/src/cofi.svg';
import i365 from 'kraken-wallet-cryptoicons/src/coinye.svg';
import i366 from 'kraken-wallet-cryptoicons/src/colx.svg';
import i367 from 'kraken-wallet-cryptoicons/src/comb.svg';
import i368 from 'kraken-wallet-cryptoicons/src/combo.svg';
import i369 from 'kraken-wallet-cryptoicons/src/comp.svg';
import i370 from 'kraken-wallet-cryptoicons/src/cone.svg';
import i371 from 'kraken-wallet-cryptoicons/src/coni.svg';
import i372 from 'kraken-wallet-cryptoicons/src/core.svg';
import i373 from 'kraken-wallet-cryptoicons/src/corgiai.svg';
import i374 from 'kraken-wallet-cryptoicons/src/cos.svg';
import i375 from 'kraken-wallet-cryptoicons/src/cosm.svg';
import i376 from 'kraken-wallet-cryptoicons/src/cost.svg';
import i377 from 'kraken-wallet-cryptoicons/src/coti.svg';
import i378 from 'kraken-wallet-cryptoicons/src/cov.svg';
import i379 from 'kraken-wallet-cryptoicons/src/cova.svg';
import i380 from 'kraken-wallet-cryptoicons/src/coval.svg';
import i381 from 'kraken-wallet-cryptoicons/src/cover.svg';
import i382 from 'kraken-wallet-cryptoicons/src/cpc.svg';
import i383 from 'kraken-wallet-cryptoicons/src/cpool.svg';
import i384 from 'kraken-wallet-cryptoicons/src/cpx.svg';
import i385 from 'kraken-wallet-cryptoicons/src/cqt.svg';
import i386 from 'kraken-wallet-cryptoicons/src/cra.svg';
import i387 from 'kraken-wallet-cryptoicons/src/crb.svg';
import i388 from 'kraken-wallet-cryptoicons/src/crd.svg';
import i389 from 'kraken-wallet-cryptoicons/src/cre.svg';
import i390 from 'kraken-wallet-cryptoicons/src/cream.svg';
import i391 from 'kraken-wallet-cryptoicons/src/cred.svg';
import i392 from 'kraken-wallet-cryptoicons/src/credi.svg';
import i393 from 'kraken-wallet-cryptoicons/src/crep.svg';
import i394 from 'kraken-wallet-cryptoicons/src/cro.svg';
import i395 from 'kraken-wallet-cryptoicons/src/crpt.svg';
import i396 from 'kraken-wallet-cryptoicons/src/crts.svg';
import i397 from 'kraken-wallet-cryptoicons/src/cru.svg';
import i398 from 'kraken-wallet-cryptoicons/src/crunch.svg';
import i399 from 'kraken-wallet-cryptoicons/src/crv.svg';
import i400 from 'kraken-wallet-cryptoicons/src/crw.svg';
import i401 from 'kraken-wallet-cryptoicons/src/cs.svg';
import i402 from 'kraken-wallet-cryptoicons/src/csai.svg';
import i403 from 'kraken-wallet-cryptoicons/src/csc.svg';
import i404 from 'kraken-wallet-cryptoicons/src/csp.svg';
import i405 from 'kraken-wallet-cryptoicons/src/cspr.svg';
import i406 from 'kraken-wallet-cryptoicons/src/ctc.svg';
import i407 from 'kraken-wallet-cryptoicons/src/cti.svg';
import i408 from 'kraken-wallet-cryptoicons/src/ctk.svg';
import i409 from 'kraken-wallet-cryptoicons/src/ctsi.svg';
import i410 from 'kraken-wallet-cryptoicons/src/ctx.svg';
import i411 from 'kraken-wallet-cryptoicons/src/ctxc.svg';
import i412 from 'kraken-wallet-cryptoicons/src/cube.svg';
import i413 from 'kraken-wallet-cryptoicons/src/cudos.svg';
import i414 from 'kraken-wallet-cryptoicons/src/cult.svg';
import i415 from 'kraken-wallet-cryptoicons/src/cusd.svg';
import i416 from 'kraken-wallet-cryptoicons/src/cusdc.svg';
import i417 from 'kraken-wallet-cryptoicons/src/cusdt-1.svg';
import i418 from 'kraken-wallet-cryptoicons/src/cusdt.svg';
import i419 from 'kraken-wallet-cryptoicons/src/cv.svg';
import i420 from 'kraken-wallet-cryptoicons/src/cvc.svg';
import i421 from 'kraken-wallet-cryptoicons/src/cvp.svg';
import i422 from 'kraken-wallet-cryptoicons/src/cvt.svg';
import i423 from 'kraken-wallet-cryptoicons/src/cvx.svg';
import i424 from 'kraken-wallet-cryptoicons/src/cwar.svg';
import i425 from 'kraken-wallet-cryptoicons/src/cwbtc.svg';
import i426 from 'kraken-wallet-cryptoicons/src/cweb.svg';
import i427 from 'kraken-wallet-cryptoicons/src/cws.svg';
import i428 from 'kraken-wallet-cryptoicons/src/cxo.svg';
import i429 from 'kraken-wallet-cryptoicons/src/cyber.svg';
import i430 from 'kraken-wallet-cryptoicons/src/czrx.svg';
import i431 from 'kraken-wallet-cryptoicons/src/dacc.svg';
import i432 from 'kraken-wallet-cryptoicons/src/dadi.svg';
import i433 from 'kraken-wallet-cryptoicons/src/dafi.svg';
import i434 from 'kraken-wallet-cryptoicons/src/dag.svg';
import i435 from 'kraken-wallet-cryptoicons/src/dai.svg';
import i436 from 'kraken-wallet-cryptoicons/src/dao.svg';
import i437 from 'kraken-wallet-cryptoicons/src/dappt.svg';
import i438 from 'kraken-wallet-cryptoicons/src/dappx.svg';
import i439 from 'kraken-wallet-cryptoicons/src/dar.svg';
import i440 from 'kraken-wallet-cryptoicons/src/dasc.svg';
import i441 from 'kraken-wallet-cryptoicons/src/dash.svg';
import i442 from 'kraken-wallet-cryptoicons/src/dat.svg';
import i443 from 'kraken-wallet-cryptoicons/src/data.svg';
import i444 from 'kraken-wallet-cryptoicons/src/datx.svg';
import i445 from 'kraken-wallet-cryptoicons/src/dawn.svg';
import i446 from 'kraken-wallet-cryptoicons/src/dbc.svg';
import i447 from 'kraken-wallet-cryptoicons/src/dcc.svg';
import i448 from 'kraken-wallet-cryptoicons/src/dcn.svg';
import i449 from 'kraken-wallet-cryptoicons/src/dcr.svg';
import i450 from 'kraken-wallet-cryptoicons/src/dct.svg';
import i451 from 'kraken-wallet-cryptoicons/src/ddd.svg';
import i452 from 'kraken-wallet-cryptoicons/src/ddj.svg';
import i453 from 'kraken-wallet-cryptoicons/src/ddx.svg';
import i454 from 'kraken-wallet-cryptoicons/src/defi.svg';
import i455 from 'kraken-wallet-cryptoicons/src/degen.svg';
import i456 from 'kraken-wallet-cryptoicons/src/dego.svg';
import i457 from 'kraken-wallet-cryptoicons/src/dent.svg';
import i458 from 'kraken-wallet-cryptoicons/src/dep.svg';
import i459 from 'kraken-wallet-cryptoicons/src/derc.svg';
import i460 from 'kraken-wallet-cryptoicons/src/deri.svg';
import i461 from 'kraken-wallet-cryptoicons/src/dero.svg';
import i462 from 'kraken-wallet-cryptoicons/src/deso.svg';
import i463 from 'kraken-wallet-cryptoicons/src/dexe.svg';
import i464 from 'kraken-wallet-cryptoicons/src/df.svg';
import i465 from 'kraken-wallet-cryptoicons/src/dfi.svg';
import i466 from 'kraken-wallet-cryptoicons/src/dft.svg';
import i467 from 'kraken-wallet-cryptoicons/src/dfyn.svg';
import i468 from 'kraken-wallet-cryptoicons/src/dgb.svg';
import i469 from 'kraken-wallet-cryptoicons/src/dgd.svg';
import i470 from 'kraken-wallet-cryptoicons/src/dgtx.svg';
import i471 from 'kraken-wallet-cryptoicons/src/dht.svg';
import i472 from 'kraken-wallet-cryptoicons/src/dia.svg';
import i473 from 'kraken-wallet-cryptoicons/src/dinero.svg';
import i474 from 'kraken-wallet-cryptoicons/src/dino.svg';
import i475 from 'kraken-wallet-cryptoicons/src/divi.svg';
import i476 from 'kraken-wallet-cryptoicons/src/dlt.svg';
import i477 from 'kraken-wallet-cryptoicons/src/dmd.svg';
import i478 from 'kraken-wallet-cryptoicons/src/dmg.svg';
import i479 from 'kraken-wallet-cryptoicons/src/dmt.svg';
import i480 from 'kraken-wallet-cryptoicons/src/dmtr.svg';
import i481 from 'kraken-wallet-cryptoicons/src/dnt.svg';
import i482 from 'kraken-wallet-cryptoicons/src/dock.svg';
import i483 from 'kraken-wallet-cryptoicons/src/dodo.svg';
import i484 from 'kraken-wallet-cryptoicons/src/dog.svg';
import i485 from 'kraken-wallet-cryptoicons/src/doge.svg';
import i486 from 'kraken-wallet-cryptoicons/src/doginme.svg';
import i487 from 'kraken-wallet-cryptoicons/src/dojo.svg';
import i488 from 'kraken-wallet-cryptoicons/src/dola.svg';
import i489 from 'kraken-wallet-cryptoicons/src/dome.svg';
import i490 from 'kraken-wallet-cryptoicons/src/dor.svg';
import i491 from 'kraken-wallet-cryptoicons/src/dora.svg';
import i492 from 'kraken-wallet-cryptoicons/src/dorkl.svg';
import i493 from 'kraken-wallet-cryptoicons/src/dot.svg';
import i494 from 'kraken-wallet-cryptoicons/src/dpi.svg';
import i495 from 'kraken-wallet-cryptoicons/src/dpr.svg';
import i496 from 'kraken-wallet-cryptoicons/src/dpx.svg';
import i497 from 'kraken-wallet-cryptoicons/src/drc.svg';
import i498 from 'kraken-wallet-cryptoicons/src/dreams.svg';
import i499 from 'kraken-wallet-cryptoicons/src/drep.svg';
import i500 from 'kraken-wallet-cryptoicons/src/drg.svg';
import i501 from 'kraken-wallet-cryptoicons/src/drgn.svg';
import i502 from 'kraken-wallet-cryptoicons/src/drop.svg';
import i503 from 'kraken-wallet-cryptoicons/src/drs.svg';
import i504 from 'kraken-wallet-cryptoicons/src/drt.svg';
import i505 from 'kraken-wallet-cryptoicons/src/dsla.svg';
import i506 from 'kraken-wallet-cryptoicons/src/dta.svg';
import i507 from 'kraken-wallet-cryptoicons/src/dth.svg';
import i508 from 'kraken-wallet-cryptoicons/src/dtr.svg';
import i509 from 'kraken-wallet-cryptoicons/src/dtx.svg';
import i510 from 'kraken-wallet-cryptoicons/src/dusk.svg';
import i511 from 'kraken-wallet-cryptoicons/src/dvf.svg';
import i512 from 'kraken-wallet-cryptoicons/src/dvi.svg';
import i513 from 'kraken-wallet-cryptoicons/src/dvpn.svg';
import i514 from 'kraken-wallet-cryptoicons/src/dx.svg';
import i515 from 'kraken-wallet-cryptoicons/src/dxd.svg';
import i516 from 'kraken-wallet-cryptoicons/src/dxt.svg';
import i517 from 'kraken-wallet-cryptoicons/src/dydx.svg';
import i518 from 'kraken-wallet-cryptoicons/src/dym.svg';
import i519 from 'kraken-wallet-cryptoicons/src/dyn.svg';
import i520 from 'kraken-wallet-cryptoicons/src/dypc.svg';
import i521 from 'kraken-wallet-cryptoicons/src/easy.svg';
import i522 from 'kraken-wallet-cryptoicons/src/ebst.svg';
import i523 from 'kraken-wallet-cryptoicons/src/eca.svg';
import i524 from 'kraken-wallet-cryptoicons/src/eco.svg';
import i525 from 'kraken-wallet-cryptoicons/src/edg.svg';
import i526 from 'kraken-wallet-cryptoicons/src/edge.svg';
import i527 from 'kraken-wallet-cryptoicons/src/edn.svg';
import i528 from 'kraken-wallet-cryptoicons/src/edo.svg';
import i529 from 'kraken-wallet-cryptoicons/src/edu.svg';
import i530 from 'kraken-wallet-cryptoicons/src/efi.svg';
import i531 from 'kraken-wallet-cryptoicons/src/efl.svg';
import i532 from 'kraken-wallet-cryptoicons/src/efx.svg';
import i533 from 'kraken-wallet-cryptoicons/src/egc.svg';
import i534 from 'kraken-wallet-cryptoicons/src/egld.svg';
import i535 from 'kraken-wallet-cryptoicons/src/egr.svg';
import i536 from 'kraken-wallet-cryptoicons/src/egt.svg';
import i537 from 'kraken-wallet-cryptoicons/src/ekg.svg';
import i538 from 'kraken-wallet-cryptoicons/src/ekt.svg';
import i539 from 'kraken-wallet-cryptoicons/src/ela.svg';
import i540 from 'kraken-wallet-cryptoicons/src/elan.svg';
import i541 from 'kraken-wallet-cryptoicons/src/elec.svg';
import i542 from 'kraken-wallet-cryptoicons/src/elf.svg';
import i543 from 'kraken-wallet-cryptoicons/src/elg.svg';
import i544 from 'kraken-wallet-cryptoicons/src/ella.svg';
import i545 from 'kraken-wallet-cryptoicons/src/elon.svg';
import i546 from 'kraken-wallet-cryptoicons/src/emc.svg';
import i547 from 'kraken-wallet-cryptoicons/src/emc2.svg';
import i548 from 'kraken-wallet-cryptoicons/src/eng.svg';
import i549 from 'kraken-wallet-cryptoicons/src/enj.svg';
import i550 from 'kraken-wallet-cryptoicons/src/enq.svg';
import i551 from 'kraken-wallet-cryptoicons/src/enrg.svg';
import i552 from 'kraken-wallet-cryptoicons/src/ens.svg';
import i553 from 'kraken-wallet-cryptoicons/src/eos.svg';
import i554 from 'kraken-wallet-cryptoicons/src/eosc.svg';
import i555 from 'kraken-wallet-cryptoicons/src/eosdac.svg';
import i556 from 'kraken-wallet-cryptoicons/src/epic.svg';
import i557 from 'kraken-wallet-cryptoicons/src/epik.svg';
import i558 from 'kraken-wallet-cryptoicons/src/epx.svg';
import i559 from 'kraken-wallet-cryptoicons/src/eqb.svg';
import i560 from 'kraken-wallet-cryptoicons/src/eqx.svg';
import i561 from 'kraken-wallet-cryptoicons/src/eqz.svg';
import i562 from 'kraken-wallet-cryptoicons/src/erc.svg';
import i563 from 'kraken-wallet-cryptoicons/src/erg.svg';
import i564 from 'kraken-wallet-cryptoicons/src/ern.svg';
import i565 from 'kraken-wallet-cryptoicons/src/ersdl.svg';
import i566 from 'kraken-wallet-cryptoicons/src/ertha.svg';
import i567 from 'kraken-wallet-cryptoicons/src/esbc.svg';
import i568 from 'kraken-wallet-cryptoicons/src/esd.svg';
import i569 from 'kraken-wallet-cryptoicons/src/esp.svg';
import i570 from 'kraken-wallet-cryptoicons/src/ess.svg';
import i571 from 'kraken-wallet-cryptoicons/src/etc.svg';
import i572 from 'kraken-wallet-cryptoicons/src/eth.svg';
import i573 from 'kraken-wallet-cryptoicons/src/eth2 v2.svg';
import i574 from 'kraken-wallet-cryptoicons/src/eth2.svg';
import i575 from 'kraken-wallet-cryptoicons/src/etha.svg';
import i576 from 'kraken-wallet-cryptoicons/src/ethdydx.svg';
import i577 from 'kraken-wallet-cryptoicons/src/etho.svg';
import i578 from 'kraken-wallet-cryptoicons/src/ethw.svg';
import i579 from 'kraken-wallet-cryptoicons/src/etn.svg';
import i580 from 'kraken-wallet-cryptoicons/src/etp.svg';
import i581 from 'kraken-wallet-cryptoicons/src/etz.svg';
import i582 from 'kraken-wallet-cryptoicons/src/eum.svg';
import i583 from 'kraken-wallet-cryptoicons/src/eur.svg';
import i584 from 'kraken-wallet-cryptoicons/src/euroc.svg';
import i585 from 'kraken-wallet-cryptoicons/src/eurs.svg';
import i586 from 'kraken-wallet-cryptoicons/src/eurt.svg';
import i587 from 'kraken-wallet-cryptoicons/src/evmos.svg';
import i588 from 'kraken-wallet-cryptoicons/src/evx.svg';
import i589 from 'kraken-wallet-cryptoicons/src/ewt.svg';
import i590 from 'kraken-wallet-cryptoicons/src/excl.svg';
import i591 from 'kraken-wallet-cryptoicons/src/exp.svg';
import i592 from 'kraken-wallet-cryptoicons/src/exrd.svg';
import i593 from 'kraken-wallet-cryptoicons/src/exrn.svg';
import i594 from 'kraken-wallet-cryptoicons/src/exy.svg';
import i595 from 'kraken-wallet-cryptoicons/src/ezy.svg';
import i596 from 'kraken-wallet-cryptoicons/src/fab.svg';
import i597 from 'kraken-wallet-cryptoicons/src/face.svg';
import i598 from 'kraken-wallet-cryptoicons/src/falcon.svg';
import i599 from 'kraken-wallet-cryptoicons/src/farm.svg';
import i600 from 'kraken-wallet-cryptoicons/src/fcon.svg';
import i601 from 'kraken-wallet-cryptoicons/src/fct.svg';
import i602 from 'kraken-wallet-cryptoicons/src/fdusd.svg';
import i603 from 'kraken-wallet-cryptoicons/src/fear.svg';
import i604 from 'kraken-wallet-cryptoicons/src/feed.svg';
import i605 from 'kraken-wallet-cryptoicons/src/fei.svg';
import i606 from 'kraken-wallet-cryptoicons/src/fet.svg';
import i607 from 'kraken-wallet-cryptoicons/src/fft.svg';
import i608 from 'kraken-wallet-cryptoicons/src/fida.svg';
import i609 from 'kraken-wallet-cryptoicons/src/fil.svg';
import i610 from 'kraken-wallet-cryptoicons/src/filda.svg';
import i611 from 'kraken-wallet-cryptoicons/src/fio.svg';
import i612 from 'kraken-wallet-cryptoicons/src/firo.svg';
import i613 from 'kraken-wallet-cryptoicons/src/fis.svg';
import i614 from 'kraken-wallet-cryptoicons/src/fitfi.svg';
import i615 from 'kraken-wallet-cryptoicons/src/fjc.svg';
import i616 from 'kraken-wallet-cryptoicons/src/fkx.svg';
import i617 from 'kraken-wallet-cryptoicons/src/flame.svg';
import i618 from 'kraken-wallet-cryptoicons/src/flash.svg';
import i619 from 'kraken-wallet-cryptoicons/src/flc.svg';
import i620 from 'kraken-wallet-cryptoicons/src/fldc.svg';
import i621 from 'kraken-wallet-cryptoicons/src/flex.svg';
import i622 from 'kraken-wallet-cryptoicons/src/flm.svg';
import i623 from 'kraken-wallet-cryptoicons/src/flo.svg';
import i624 from 'kraken-wallet-cryptoicons/src/floki.svg';
import i625 from 'kraken-wallet-cryptoicons/src/flow.svg';
import i626 from 'kraken-wallet-cryptoicons/src/flr.svg';
import i627 from 'kraken-wallet-cryptoicons/src/flux.svg';
import i628 from 'kraken-wallet-cryptoicons/src/fly.svg';
import i629 from 'kraken-wallet-cryptoicons/src/foam.svg';
import i630 from 'kraken-wallet-cryptoicons/src/fold.svg';
import i631 from 'kraken-wallet-cryptoicons/src/for.svg';
import i632 from 'kraken-wallet-cryptoicons/src/forestplus.svg';
import i633 from 'kraken-wallet-cryptoicons/src/form.svg';
import i634 from 'kraken-wallet-cryptoicons/src/forta.svg';
import i635 from 'kraken-wallet-cryptoicons/src/forth.svg';
import i636 from 'kraken-wallet-cryptoicons/src/fota.svg';
import i637 from 'kraken-wallet-cryptoicons/src/fox.svg';
import i638 from 'kraken-wallet-cryptoicons/src/fpi.svg';
import i639 from 'kraken-wallet-cryptoicons/src/fpis.svg';
import i640 from 'kraken-wallet-cryptoicons/src/frame.svg';
import i641 from 'kraken-wallet-cryptoicons/src/frax.svg';
import i642 from 'kraken-wallet-cryptoicons/src/fren.svg';
import i643 from 'kraken-wallet-cryptoicons/src/frm.svg';
import i644 from 'kraken-wallet-cryptoicons/src/front.svg';
import i645 from 'kraken-wallet-cryptoicons/src/frr.svg';
import i646 from 'kraken-wallet-cryptoicons/src/frxeth.svg';
import i647 from 'kraken-wallet-cryptoicons/src/fsn.svg';
import i648 from 'kraken-wallet-cryptoicons/src/fst.svg';
import i649 from 'kraken-wallet-cryptoicons/src/ft.svg';
import i650 from 'kraken-wallet-cryptoicons/src/ftc.svg';
import i651 from 'kraken-wallet-cryptoicons/src/ftg.svg';
import i652 from 'kraken-wallet-cryptoicons/src/ftm.svg';
import i653 from 'kraken-wallet-cryptoicons/src/ftt.svg';
import i654 from 'kraken-wallet-cryptoicons/src/fuel.svg';
import i655 from 'kraken-wallet-cryptoicons/src/fun.svg';
import i656 from 'kraken-wallet-cryptoicons/src/fuse.svg';
import i657 from 'kraken-wallet-cryptoicons/src/fx.svg';
import i658 from 'kraken-wallet-cryptoicons/src/fxc.svg';
import i659 from 'kraken-wallet-cryptoicons/src/fxs.svg';
import i660 from 'kraken-wallet-cryptoicons/src/fxt.svg';
import i661 from 'kraken-wallet-cryptoicons/src/gafi.svg';
import i662 from 'kraken-wallet-cryptoicons/src/gal.svg';
import i663 from 'kraken-wallet-cryptoicons/src/gala.svg';
import i664 from 'kraken-wallet-cryptoicons/src/gam.svg';
import i665 from 'kraken-wallet-cryptoicons/src/gamb.svg';
import i666 from 'kraken-wallet-cryptoicons/src/game.svg';
import i667 from 'kraken-wallet-cryptoicons/src/gamee.svg';
import i668 from 'kraken-wallet-cryptoicons/src/gari.svg';
import i669 from 'kraken-wallet-cryptoicons/src/gas.svg';
import i670 from 'kraken-wallet-cryptoicons/src/gbg.svg';
import i671 from 'kraken-wallet-cryptoicons/src/gbp.svg';
import i672 from 'kraken-wallet-cryptoicons/src/gbx.svg';
import i673 from 'kraken-wallet-cryptoicons/src/gbyte.svg';
import i674 from 'kraken-wallet-cryptoicons/src/gcr.svg';
import i675 from 'kraken-wallet-cryptoicons/src/gdc.svg';
import i676 from 'kraken-wallet-cryptoicons/src/gear.svg';
import i677 from 'kraken-wallet-cryptoicons/src/geeq.svg';
import i678 from 'kraken-wallet-cryptoicons/src/geist.svg';
import i679 from 'kraken-wallet-cryptoicons/src/gem.svg';
import i680 from 'kraken-wallet-cryptoicons/src/gen.svg';
import i681 from 'kraken-wallet-cryptoicons/src/gens.svg';
import i682 from 'kraken-wallet-cryptoicons/src/geo.svg';
import i683 from 'kraken-wallet-cryptoicons/src/gf.svg';
import i684 from 'kraken-wallet-cryptoicons/src/gfi.svg';
import i685 from 'kraken-wallet-cryptoicons/src/ggc.svg';
import i686 from 'kraken-wallet-cryptoicons/src/ggg.svg';
import i687 from 'kraken-wallet-cryptoicons/src/gho.svg';
import i688 from 'kraken-wallet-cryptoicons/src/ghst.svg';
import i689 from 'kraken-wallet-cryptoicons/src/ghx.svg';
import i690 from 'kraken-wallet-cryptoicons/src/gin.svg';
import i691 from 'kraken-wallet-cryptoicons/src/giv.svg';
import i692 from 'kraken-wallet-cryptoicons/src/glch.svg';
import i693 from 'kraken-wallet-cryptoicons/src/gld.svg';
import i694 from 'kraken-wallet-cryptoicons/src/glm.svg';
import i695 from 'kraken-wallet-cryptoicons/src/glmr.svg';
import i696 from 'kraken-wallet-cryptoicons/src/glq.svg';
import i697 from 'kraken-wallet-cryptoicons/src/gls.svg';
import i698 from 'kraken-wallet-cryptoicons/src/gmee.svg';
import i699 from 'kraken-wallet-cryptoicons/src/gmt.svg';
import i700 from 'kraken-wallet-cryptoicons/src/gmx.svg';
import i701 from 'kraken-wallet-cryptoicons/src/gno.svg';
import i702 from 'kraken-wallet-cryptoicons/src/gns.svg';
import i703 from 'kraken-wallet-cryptoicons/src/gnt.svg';
import i704 from 'kraken-wallet-cryptoicons/src/gnx.svg';
import i705 from 'kraken-wallet-cryptoicons/src/go.svg';
import i706 from 'kraken-wallet-cryptoicons/src/goc.svg';
import i707 from 'kraken-wallet-cryptoicons/src/gom2.svg';
import i708 from 'kraken-wallet-cryptoicons/src/got.svg';
import i709 from 'kraken-wallet-cryptoicons/src/govi.svg';
import i710 from 'kraken-wallet-cryptoicons/src/grail.svg';
import i711 from 'kraken-wallet-cryptoicons/src/grc.svg';
import i712 from 'kraken-wallet-cryptoicons/src/grg.svg';
import i713 from 'kraken-wallet-cryptoicons/src/grin.svg';
import i714 from 'kraken-wallet-cryptoicons/src/grow.svg';
import i715 from 'kraken-wallet-cryptoicons/src/grs.svg';
import i716 from 'kraken-wallet-cryptoicons/src/grt.svg';
import i717 from 'kraken-wallet-cryptoicons/src/gsc.svg';
import i718 from 'kraken-wallet-cryptoicons/src/gspi.svg';
import i719 from 'kraken-wallet-cryptoicons/src/gst.svg';
import i720 from 'kraken-wallet-cryptoicons/src/gswap.svg';
import i721 from 'kraken-wallet-cryptoicons/src/gt.svg';
import i722 from 'kraken-wallet-cryptoicons/src/gtc.svg';
import i723 from 'kraken-wallet-cryptoicons/src/gto.svg';
import i724 from 'kraken-wallet-cryptoicons/src/guild.svg';
import i725 from 'kraken-wallet-cryptoicons/src/gup.svg';
import i726 from 'kraken-wallet-cryptoicons/src/gusd.svg';
import i727 from 'kraken-wallet-cryptoicons/src/gvt.svg';
import i728 from 'kraken-wallet-cryptoicons/src/gxc.svg';
import i729 from 'kraken-wallet-cryptoicons/src/gxs.svg';
import i730 from 'kraken-wallet-cryptoicons/src/gyen.svg';
import i731 from 'kraken-wallet-cryptoicons/src/h3ro3s.svg';
import i732 from 'kraken-wallet-cryptoicons/src/hai.svg';
import i733 from 'kraken-wallet-cryptoicons/src/hair.svg';
import i734 from 'kraken-wallet-cryptoicons/src/haka.svg';
import i735 from 'kraken-wallet-cryptoicons/src/hakka.svg';
import i736 from 'kraken-wallet-cryptoicons/src/han.svg';
import i737 from 'kraken-wallet-cryptoicons/src/hanep.svg';
import i738 from 'kraken-wallet-cryptoicons/src/hapi.svg';
import i739 from 'kraken-wallet-cryptoicons/src/harambe.svg';
import i740 from 'kraken-wallet-cryptoicons/src/hard.svg';
import i741 from 'kraken-wallet-cryptoicons/src/hash.svg';
import i742 from 'kraken-wallet-cryptoicons/src/hav.svg';
import i743 from 'kraken-wallet-cryptoicons/src/hbar.svg';
import i744 from 'kraken-wallet-cryptoicons/src/hbb.svg';
import i745 from 'kraken-wallet-cryptoicons/src/hbtc.svg';
import i746 from 'kraken-wallet-cryptoicons/src/hc.svg';
import i747 from 'kraken-wallet-cryptoicons/src/heart.svg';
import i748 from 'kraken-wallet-cryptoicons/src/hedg.svg';
import i749 from 'kraken-wallet-cryptoicons/src/hegic.svg';
import i750 from 'kraken-wallet-cryptoicons/src/her.svg';
import i751 from 'kraken-wallet-cryptoicons/src/hero.svg';
import i752 from 'kraken-wallet-cryptoicons/src/hex.svg';
import i753 from 'kraken-wallet-cryptoicons/src/hft.svg';
import i754 from 'kraken-wallet-cryptoicons/src/hifi.svg';
import i755 from 'kraken-wallet-cryptoicons/src/high.svg';
import i756 from 'kraken-wallet-cryptoicons/src/hive.svg';
import i757 from 'kraken-wallet-cryptoicons/src/hmq.svg';
import i758 from 'kraken-wallet-cryptoicons/src/hmt.svg';
import i759 from 'kraken-wallet-cryptoicons/src/hns.svg';
import i760 from 'kraken-wallet-cryptoicons/src/hnt.svg';
import i761 from 'kraken-wallet-cryptoicons/src/hobbes.svg';
import i762 from 'kraken-wallet-cryptoicons/src/hod.svg';
import i763 from 'kraken-wallet-cryptoicons/src/hoge.svg';
import i764 from 'kraken-wallet-cryptoicons/src/hook.svg';
import i765 from 'kraken-wallet-cryptoicons/src/hop.svg';
import i766 from 'kraken-wallet-cryptoicons/src/hord.svg';
import i767 from 'kraken-wallet-cryptoicons/src/hot-x.svg';
import i768 from 'kraken-wallet-cryptoicons/src/hot.svg';
import i769 from 'kraken-wallet-cryptoicons/src/hotcross.svg';
import i770 from 'kraken-wallet-cryptoicons/src/hpb.svg';
import i771 from 'kraken-wallet-cryptoicons/src/hpo.svg';
import i772 from 'kraken-wallet-cryptoicons/src/hpp.svg';
import i773 from 'kraken-wallet-cryptoicons/src/hsr.svg';
import i774 from 'kraken-wallet-cryptoicons/src/ht.svg';
import i775 from 'kraken-wallet-cryptoicons/src/html.svg';
import i776 from 'kraken-wallet-cryptoicons/src/htr.svg';
import i777 from 'kraken-wallet-cryptoicons/src/hum.svg';
import i778 from 'kraken-wallet-cryptoicons/src/hunt.svg';
import i779 from 'kraken-wallet-cryptoicons/src/husd.svg';
import i780 from 'kraken-wallet-cryptoicons/src/hush.svg';
import i781 from 'kraken-wallet-cryptoicons/src/hvn.svg';
import i782 from 'kraken-wallet-cryptoicons/src/hxro.svg';
import i783 from 'kraken-wallet-cryptoicons/src/hydra.svg';
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
import i859 from 'kraken-wallet-cryptoicons/src/kcs.svg';
import i860 from 'kraken-wallet-cryptoicons/src/kda.svg';
import i861 from 'kraken-wallet-cryptoicons/src/kdon.svg';
import i862 from 'kraken-wallet-cryptoicons/src/keep.svg';
import i863 from 'kraken-wallet-cryptoicons/src/key.svg';
import i864 from 'kraken-wallet-cryptoicons/src/keycat.svg';
import i865 from 'kraken-wallet-cryptoicons/src/kick.svg';
import i866 from 'kraken-wallet-cryptoicons/src/kilt.svg';
import i867 from 'kraken-wallet-cryptoicons/src/kin.svg';
import i868 from 'kraken-wallet-cryptoicons/src/kint.svg';
import i869 from 'kraken-wallet-cryptoicons/src/kira.svg';
import i870 from 'kraken-wallet-cryptoicons/src/kiro.svg';
import i871 from 'kraken-wallet-cryptoicons/src/klay.svg';
import i872 from 'kraken-wallet-cryptoicons/src/klv.svg';
import i873 from 'kraken-wallet-cryptoicons/src/kma.svg';
import i874 from 'kraken-wallet-cryptoicons/src/kmd.svg';
import i875 from 'kraken-wallet-cryptoicons/src/knc.svg';
import i876 from 'kraken-wallet-cryptoicons/src/kndc.svg';
import i877 from 'kraken-wallet-cryptoicons/src/kok.svg';
import i878 from 'kraken-wallet-cryptoicons/src/kol.svg';
import i879 from 'kraken-wallet-cryptoicons/src/kono.svg';
import i880 from 'kraken-wallet-cryptoicons/src/kore.svg';
import i881 from 'kraken-wallet-cryptoicons/src/kp3r.svg';
import i882 from 'kraken-wallet-cryptoicons/src/krb.svg';
import i883 from 'kraken-wallet-cryptoicons/src/krl.svg';
import i884 from 'kraken-wallet-cryptoicons/src/krw.svg';
import i885 from 'kraken-wallet-cryptoicons/src/ksm.svg';
import i886 from 'kraken-wallet-cryptoicons/src/ksp.svg';
import i887 from 'kraken-wallet-cryptoicons/src/ktn.svg';
import i888 from 'kraken-wallet-cryptoicons/src/kub.svg';
import i889 from 'kraken-wallet-cryptoicons/src/kyl.svg';
import i890 from 'kraken-wallet-cryptoicons/src/la.svg';
import i891 from 'kraken-wallet-cryptoicons/src/lab.svg';
import i892 from 'kraken-wallet-cryptoicons/src/lace.svg';
import i893 from 'kraken-wallet-cryptoicons/src/ladys.svg';
import i894 from 'kraken-wallet-cryptoicons/src/lamb.svg';
import i895 from 'kraken-wallet-cryptoicons/src/land.svg';
import i896 from 'kraken-wallet-cryptoicons/src/layer.svg';
import i897 from 'kraken-wallet-cryptoicons/src/lazio.svg';
import i898 from 'kraken-wallet-cryptoicons/src/lba.svg';
import i899 from 'kraken-wallet-cryptoicons/src/lbc.svg';
import i900 from 'kraken-wallet-cryptoicons/src/lcc.svg';
import i901 from 'kraken-wallet-cryptoicons/src/lcdot.svg';
import i902 from 'kraken-wallet-cryptoicons/src/lcx.svg';
import i903 from 'kraken-wallet-cryptoicons/src/ldo.svg';
import i904 from 'kraken-wallet-cryptoicons/src/lend.svg';
import i905 from 'kraken-wallet-cryptoicons/src/leo.svg';
import i906 from 'kraken-wallet-cryptoicons/src/lever.svg';
import i907 from 'kraken-wallet-cryptoicons/src/lien.svg';
import i908 from 'kraken-wallet-cryptoicons/src/like.svg';
import i909 from 'kraken-wallet-cryptoicons/src/lina.svg';
import i910 from 'kraken-wallet-cryptoicons/src/link.svg';
import i911 from 'kraken-wallet-cryptoicons/src/lit.svg';
import i912 from 'kraken-wallet-cryptoicons/src/lith.svg';
import i913 from 'kraken-wallet-cryptoicons/src/lkk.svg';
import i914 from 'kraken-wallet-cryptoicons/src/lky.svg';
import i915 from 'kraken-wallet-cryptoicons/src/lmc.svg';
import i916 from 'kraken-wallet-cryptoicons/src/ln.svg';
import i917 from 'kraken-wallet-cryptoicons/src/lnchx.svg';
import i918 from 'kraken-wallet-cryptoicons/src/loc.svg';
import i919 from 'kraken-wallet-cryptoicons/src/locg.svg';
import i920 from 'kraken-wallet-cryptoicons/src/lode.svg';
import i921 from 'kraken-wallet-cryptoicons/src/loka.svg';
import i922 from 'kraken-wallet-cryptoicons/src/loki.svg';
import i923 from 'kraken-wallet-cryptoicons/src/lon.svg';
import i924 from 'kraken-wallet-cryptoicons/src/looks.svg';
import i925 from 'kraken-wallet-cryptoicons/src/loom.svg';
import i926 from 'kraken-wallet-cryptoicons/src/love.svg';
import i927 from 'kraken-wallet-cryptoicons/src/lpf.svg';
import i928 from 'kraken-wallet-cryptoicons/src/lpool.svg';
import i929 from 'kraken-wallet-cryptoicons/src/lpt.svg';
import i930 from 'kraken-wallet-cryptoicons/src/lqd.svg';
import i931 from 'kraken-wallet-cryptoicons/src/lqty.svg';
import i932 from 'kraken-wallet-cryptoicons/src/lrc.svg';
import i933 from 'kraken-wallet-cryptoicons/src/lrg.svg';
import i934 from 'kraken-wallet-cryptoicons/src/lsk.svg';
import i935 from 'kraken-wallet-cryptoicons/src/lss.svg';
import i936 from 'kraken-wallet-cryptoicons/src/ltc.svg';
import i937 from 'kraken-wallet-cryptoicons/src/lto.svg';
import i938 from 'kraken-wallet-cryptoicons/src/ltx.svg';
import i939 from 'kraken-wallet-cryptoicons/src/luca.svg';
import i940 from 'kraken-wallet-cryptoicons/src/lun.svg';
import i941 from 'kraken-wallet-cryptoicons/src/luna.svg';
import i942 from 'kraken-wallet-cryptoicons/src/lunc.svg';
import i943 from 'kraken-wallet-cryptoicons/src/lusd.svg';
import i944 from 'kraken-wallet-cryptoicons/src/lxt.svg';
import i945 from 'kraken-wallet-cryptoicons/src/lym.svg';
import i946 from 'kraken-wallet-cryptoicons/src/lyxe.svg';
import i947 from 'kraken-wallet-cryptoicons/src/maapl.svg';
import i948 from 'kraken-wallet-cryptoicons/src/maga.svg';
import i949 from 'kraken-wallet-cryptoicons/src/magic.svg';
import i950 from 'kraken-wallet-cryptoicons/src/maha.svg';
import i951 from 'kraken-wallet-cryptoicons/src/mai.svg';
import i952 from 'kraken-wallet-cryptoicons/src/maid.svg';
import i953 from 'kraken-wallet-cryptoicons/src/maki.svg';
import i954 from 'kraken-wallet-cryptoicons/src/man.svg';
import i955 from 'kraken-wallet-cryptoicons/src/mana.svg';
import i956 from 'kraken-wallet-cryptoicons/src/manta.svg';
import i957 from 'kraken-wallet-cryptoicons/src/map.svg';
import i958 from 'kraken-wallet-cryptoicons/src/maps.svg';
import i959 from 'kraken-wallet-cryptoicons/src/marsh.svg';
import i960 from 'kraken-wallet-cryptoicons/src/mask.svg';
import i961 from 'kraken-wallet-cryptoicons/src/mass.svg';
import i962 from 'kraken-wallet-cryptoicons/src/math.svg';
import i963 from 'kraken-wallet-cryptoicons/src/matic.svg';
import i964 from 'kraken-wallet-cryptoicons/src/maticx.svg';
import i965 from 'kraken-wallet-cryptoicons/src/matter.svg';
import i966 from 'kraken-wallet-cryptoicons/src/mb.svg';
import i967 from 'kraken-wallet-cryptoicons/src/mbc.svg';
import i968 from 'kraken-wallet-cryptoicons/src/mbl.svg';
import i969 from 'kraken-wallet-cryptoicons/src/mbox.svg';
import i970 from 'kraken-wallet-cryptoicons/src/mc.svg';
import i971 from 'kraken-wallet-cryptoicons/src/mcb.svg';
import i972 from 'kraken-wallet-cryptoicons/src/mco.svg';
import i973 from 'kraken-wallet-cryptoicons/src/mco2.svg';
import i974 from 'kraken-wallet-cryptoicons/src/mcx.svg';
import i975 from 'kraken-wallet-cryptoicons/src/mda.svg';
import i976 from 'kraken-wallet-cryptoicons/src/mdao.svg';
import i977 from 'kraken-wallet-cryptoicons/src/mds.svg';
import i978 from 'kraken-wallet-cryptoicons/src/mdt.svg';
import i979 from 'kraken-wallet-cryptoicons/src/mdx.svg';
import i980 from 'kraken-wallet-cryptoicons/src/med.svg';
import i981 from 'kraken-wallet-cryptoicons/src/medx.svg';
import i982 from 'kraken-wallet-cryptoicons/src/meetone.svg';
import i983 from 'kraken-wallet-cryptoicons/src/mem.svg';
import i984 from 'kraken-wallet-cryptoicons/src/meme.svg';
import i985 from 'kraken-wallet-cryptoicons/src/mer.svg';
import i986 from 'kraken-wallet-cryptoicons/src/met.svg';
import i987 from 'kraken-wallet-cryptoicons/src/meta.svg';
import i988 from 'kraken-wallet-cryptoicons/src/metano.svg';
import i989 from 'kraken-wallet-cryptoicons/src/metis.svg';
import i990 from 'kraken-wallet-cryptoicons/src/mew.svg';
import i991 from 'kraken-wallet-cryptoicons/src/mex.svg';
import i992 from 'kraken-wallet-cryptoicons/src/mfg.svg';
import i993 from 'kraken-wallet-cryptoicons/src/mft.svg';
import i994 from 'kraken-wallet-cryptoicons/src/mhc.svg';
import i995 from 'kraken-wallet-cryptoicons/src/mim.svg';
import i996 from 'kraken-wallet-cryptoicons/src/mimatic.svg';
import i997 from 'kraken-wallet-cryptoicons/src/mina.svg';
import i998 from 'kraken-wallet-cryptoicons/src/miota.svg';
import i999 from 'kraken-wallet-cryptoicons/src/mir.svg';
import i1000 from 'kraken-wallet-cryptoicons/src/mith.svg';
import i1001 from 'kraken-wallet-cryptoicons/src/mitx.svg';
import i1002 from 'kraken-wallet-cryptoicons/src/mjt.svg';
import i1003 from 'kraken-wallet-cryptoicons/src/mkr.svg';
import i1004 from 'kraken-wallet-cryptoicons/src/mlb.svg';
import i1005 from 'kraken-wallet-cryptoicons/src/mlk.svg';
import i1006 from 'kraken-wallet-cryptoicons/src/mln.svg';
import i1007 from 'kraken-wallet-cryptoicons/src/mmt.svg';
import i1008 from 'kraken-wallet-cryptoicons/src/mmxn.svg';
import i1009 from 'kraken-wallet-cryptoicons/src/mnde.svg';
import i1010 from 'kraken-wallet-cryptoicons/src/mnet.svg';
import i1011 from 'kraken-wallet-cryptoicons/src/mngo.svg';
import i1012 from 'kraken-wallet-cryptoicons/src/mns.svg';
import i1013 from 'kraken-wallet-cryptoicons/src/mnst.svg';
import i1014 from 'kraken-wallet-cryptoicons/src/mnt.svg';
import i1015 from 'kraken-wallet-cryptoicons/src/mntl.svg';
import i1016 from 'kraken-wallet-cryptoicons/src/mnw.svg';
import i1017 from 'kraken-wallet-cryptoicons/src/moac.svg';
import i1018 from 'kraken-wallet-cryptoicons/src/mob.svg';
import i1019 from 'kraken-wallet-cryptoicons/src/mochi.svg';
import i1020 from 'kraken-wallet-cryptoicons/src/mod.svg';
import i1021 from 'kraken-wallet-cryptoicons/src/modefi.svg';
import i1022 from 'kraken-wallet-cryptoicons/src/mof.svg';
import i1023 from 'kraken-wallet-cryptoicons/src/mog.svg';
import i1024 from 'kraken-wallet-cryptoicons/src/mom.svg';
import i1025 from 'kraken-wallet-cryptoicons/src/mona.svg';
import i1026 from 'kraken-wallet-cryptoicons/src/moni.svg';
import i1027 from 'kraken-wallet-cryptoicons/src/moon.svg';
import i1028 from 'kraken-wallet-cryptoicons/src/mot.svg';
import i1029 from 'kraken-wallet-cryptoicons/src/movez.svg';
import i1030 from 'kraken-wallet-cryptoicons/src/movr.svg';
import i1031 from 'kraken-wallet-cryptoicons/src/mph.svg';
import i1032 from 'kraken-wallet-cryptoicons/src/mpl.svg';
import i1033 from 'kraken-wallet-cryptoicons/src/msol.svg';
import i1034 from 'kraken-wallet-cryptoicons/src/msr.svg';
import i1035 from 'kraken-wallet-cryptoicons/src/mswap.svg';
import i1036 from 'kraken-wallet-cryptoicons/src/mta.svg';
import i1037 from 'kraken-wallet-cryptoicons/src/mtc.svg';
import i1038 from 'kraken-wallet-cryptoicons/src/mth.svg';
import i1039 from 'kraken-wallet-cryptoicons/src/mtl.svg';
import i1040 from 'kraken-wallet-cryptoicons/src/mtn.svg';
import i1041 from 'kraken-wallet-cryptoicons/src/mtrg.svg';
import i1042 from 'kraken-wallet-cryptoicons/src/mts.svg';
import i1043 from 'kraken-wallet-cryptoicons/src/mtv.svg';
import i1044 from 'kraken-wallet-cryptoicons/src/mue.svg';
import i1045 from 'kraken-wallet-cryptoicons/src/multi.svg';
import i1046 from 'kraken-wallet-cryptoicons/src/musd.svg';
import i1047 from 'kraken-wallet-cryptoicons/src/music.svg';
import i1048 from 'kraken-wallet-cryptoicons/src/mvc.svg';
import i1049 from 'kraken-wallet-cryptoicons/src/mvl.svg';
import i1050 from 'kraken-wallet-cryptoicons/src/mvp.svg';
import i1051 from 'kraken-wallet-cryptoicons/src/mwat.svg';
import i1052 from 'kraken-wallet-cryptoicons/src/mwc.svg';
import i1053 from 'kraken-wallet-cryptoicons/src/mx.svg';
import i1054 from 'kraken-wallet-cryptoicons/src/mxc.svg';
import i1055 from 'kraken-wallet-cryptoicons/src/mxm.svg';
import i1056 from 'kraken-wallet-cryptoicons/src/mxw.svg';
import i1057 from 'kraken-wallet-cryptoicons/src/myb.svg';
import i1058 from 'kraken-wallet-cryptoicons/src/myro.svg';
import i1059 from 'kraken-wallet-cryptoicons/src/myst.svg';
import i1060 from 'kraken-wallet-cryptoicons/src/naka.svg';
import i1061 from 'kraken-wallet-cryptoicons/src/nano.svg';
import i1062 from 'kraken-wallet-cryptoicons/src/nas.svg';
import i1063 from 'kraken-wallet-cryptoicons/src/nav.svg';
import i1064 from 'kraken-wallet-cryptoicons/src/nbs.svg';
import i1065 from 'kraken-wallet-cryptoicons/src/nbt.svg';
import i1066 from 'kraken-wallet-cryptoicons/src/ncash.svg';
import i1067 from 'kraken-wallet-cryptoicons/src/nct.svg';
import i1068 from 'kraken-wallet-cryptoicons/src/ndau.svg';
import i1069 from 'kraken-wallet-cryptoicons/src/near.svg';
import i1070 from 'kraken-wallet-cryptoicons/src/nebl.svg';
import i1071 from 'kraken-wallet-cryptoicons/src/nec.svg';
import i1072 from 'kraken-wallet-cryptoicons/src/nem.svg';
import i1073 from 'kraken-wallet-cryptoicons/src/neo.svg';
import i1074 from 'kraken-wallet-cryptoicons/src/neon.svg';
import i1075 from 'kraken-wallet-cryptoicons/src/neos.svg';
import i1076 from 'kraken-wallet-cryptoicons/src/neox.svg';
import i1077 from 'kraken-wallet-cryptoicons/src/nest.svg';
import i1078 from 'kraken-wallet-cryptoicons/src/neu.svg';
import i1079 from 'kraken-wallet-cryptoicons/src/new.svg';
import i1080 from 'kraken-wallet-cryptoicons/src/nex.svg';
import i1081 from 'kraken-wallet-cryptoicons/src/nexo.svg';
import i1082 from 'kraken-wallet-cryptoicons/src/nexxo.svg';
import i1083 from 'kraken-wallet-cryptoicons/src/nft.svg';
import i1084 from 'kraken-wallet-cryptoicons/src/nftb.svg';
import i1085 from 'kraken-wallet-cryptoicons/src/nftx.svg';
import i1086 from 'kraken-wallet-cryptoicons/src/ngc.svg';
import i1087 from 'kraken-wallet-cryptoicons/src/ngm.svg';
import i1088 from 'kraken-wallet-cryptoicons/src/nif.svg';
import i1089 from 'kraken-wallet-cryptoicons/src/nim.svg';
import i1090 from 'kraken-wallet-cryptoicons/src/niox.svg';
import i1091 from 'kraken-wallet-cryptoicons/src/nix.svg';
import i1092 from 'kraken-wallet-cryptoicons/src/nkn.svg';
import i1093 from 'kraken-wallet-cryptoicons/src/nlc2.svg';
import i1094 from 'kraken-wallet-cryptoicons/src/nlg.svg';
import i1095 from 'kraken-wallet-cryptoicons/src/nmc.svg';
import i1096 from 'kraken-wallet-cryptoicons/src/nmr.svg';
import i1097 from 'kraken-wallet-cryptoicons/src/noia.svg';
import i1098 from 'kraken-wallet-cryptoicons/src/nord.svg';
import i1099 from 'kraken-wallet-cryptoicons/src/normie.svg';
import i1100 from 'kraken-wallet-cryptoicons/src/normilio.svg';
import i1101 from 'kraken-wallet-cryptoicons/src/nox.svg';
import i1102 from 'kraken-wallet-cryptoicons/src/nper.svg';
import i1103 from 'kraken-wallet-cryptoicons/src/npxs.svg';
import i1104 from 'kraken-wallet-cryptoicons/src/nrg.svg';
import i1105 from 'kraken-wallet-cryptoicons/src/nrv.svg';
import i1106 from 'kraken-wallet-cryptoicons/src/nrve.svg';
import i1107 from 'kraken-wallet-cryptoicons/src/ntic.svg';
import i1108 from 'kraken-wallet-cryptoicons/src/ntrn.svg';
import i1109 from 'kraken-wallet-cryptoicons/src/ntvrk.svg';
import i1110 from 'kraken-wallet-cryptoicons/src/nu.svg';
import i1111 from 'kraken-wallet-cryptoicons/src/nuls.svg';
import i1112 from 'kraken-wallet-cryptoicons/src/num.svg';
import i1113 from 'kraken-wallet-cryptoicons/src/nusd.svg';
import i1114 from 'kraken-wallet-cryptoicons/src/nwc.svg';
import i1115 from 'kraken-wallet-cryptoicons/src/nxm.svg';
import i1116 from 'kraken-wallet-cryptoicons/src/nxs.svg';
import i1117 from 'kraken-wallet-cryptoicons/src/nxt.svg';
import i1118 from 'kraken-wallet-cryptoicons/src/nye.svg';
import i1119 from 'kraken-wallet-cryptoicons/src/nym.svg';
import i1120 from 'kraken-wallet-cryptoicons/src/oag.svg';
import i1121 from 'kraken-wallet-cryptoicons/src/oak.svg';
import i1122 from 'kraken-wallet-cryptoicons/src/oax.svg';
import i1123 from 'kraken-wallet-cryptoicons/src/ocean.svg';
import i1124 from 'kraken-wallet-cryptoicons/src/ocn.svg';
import i1125 from 'kraken-wallet-cryptoicons/src/oddz.svg';
import i1126 from 'kraken-wallet-cryptoicons/src/ode.svg';
import i1127 from 'kraken-wallet-cryptoicons/src/og.svg';
import i1128 from 'kraken-wallet-cryptoicons/src/ogn.svg';
import i1129 from 'kraken-wallet-cryptoicons/src/ogo.svg';
import i1130 from 'kraken-wallet-cryptoicons/src/ohm.svg';
import i1131 from 'kraken-wallet-cryptoicons/src/oil.svg';
import i1132 from 'kraken-wallet-cryptoicons/src/ok.svg';
import i1133 from 'kraken-wallet-cryptoicons/src/okb.svg';
import i1134 from 'kraken-wallet-cryptoicons/src/oks.svg';
import i1135 from 'kraken-wallet-cryptoicons/src/olt.svg';
import i1136 from 'kraken-wallet-cryptoicons/src/om.svg';
import i1137 from 'kraken-wallet-cryptoicons/src/omg.svg';
import i1138 from 'kraken-wallet-cryptoicons/src/omni.svg';
import i1139 from 'kraken-wallet-cryptoicons/src/ondo.svg';
import i1140 from 'kraken-wallet-cryptoicons/src/one.svg';
import i1141 from 'kraken-wallet-cryptoicons/src/ong.svg';
import i1142 from 'kraken-wallet-cryptoicons/src/onion.svg';
import i1143 from 'kraken-wallet-cryptoicons/src/onston.svg';
import i1144 from 'kraken-wallet-cryptoicons/src/ont.svg';
import i1145 from 'kraken-wallet-cryptoicons/src/ooe.svg';
import i1146 from 'kraken-wallet-cryptoicons/src/ooki.svg';
import i1147 from 'kraken-wallet-cryptoicons/src/oot.svg';
import i1148 from 'kraken-wallet-cryptoicons/src/op.svg';
import i1149 from 'kraken-wallet-cryptoicons/src/open.svg';
import i1150 from 'kraken-wallet-cryptoicons/src/opium.svg';
import i1151 from 'kraken-wallet-cryptoicons/src/opq.svg';
import i1152 from 'kraken-wallet-cryptoicons/src/ops.svg';
import i1153 from 'kraken-wallet-cryptoicons/src/opsec.svg';
import i1154 from 'kraken-wallet-cryptoicons/src/opul.svg';
import i1155 from 'kraken-wallet-cryptoicons/src/opx.svg';
import i1156 from 'kraken-wallet-cryptoicons/src/orai.svg';
import i1157 from 'kraken-wallet-cryptoicons/src/orbs.svg';
import i1158 from 'kraken-wallet-cryptoicons/src/orc.svg';
import i1159 from 'kraken-wallet-cryptoicons/src/orca.svg';
import i1160 from 'kraken-wallet-cryptoicons/src/orcat.svg';
import i1161 from 'kraken-wallet-cryptoicons/src/ordi.svg';
import i1162 from 'kraken-wallet-cryptoicons/src/orn.svg';
import i1163 from 'kraken-wallet-cryptoicons/src/osmo.svg';
import i1164 from 'kraken-wallet-cryptoicons/src/ost.svg';
import i1165 from 'kraken-wallet-cryptoicons/src/ouro.svg';
import i1166 from 'kraken-wallet-cryptoicons/src/ousd.svg';
import i1167 from 'kraken-wallet-cryptoicons/src/ovc.svg';
import i1168 from 'kraken-wallet-cryptoicons/src/oxen.svg';
import i1169 from 'kraken-wallet-cryptoicons/src/oxt.svg';
import i1170 from 'kraken-wallet-cryptoicons/src/oxy.svg';
import i1171 from 'kraken-wallet-cryptoicons/src/pac.svg';
import i1172 from 'kraken-wallet-cryptoicons/src/pai.svg';
import i1173 from 'kraken-wallet-cryptoicons/src/paint.svg';
import i1174 from 'kraken-wallet-cryptoicons/src/pal.svg';
import i1175 from 'kraken-wallet-cryptoicons/src/palm.svg';
import i1176 from 'kraken-wallet-cryptoicons/src/paper.svg';
import i1177 from 'kraken-wallet-cryptoicons/src/par.svg';
import i1178 from 'kraken-wallet-cryptoicons/src/part.svg';
import i1179 from 'kraken-wallet-cryptoicons/src/pasc.svg';
import i1180 from 'kraken-wallet-cryptoicons/src/pax.svg';
import i1181 from 'kraken-wallet-cryptoicons/src/paxg.svg';
import i1182 from 'kraken-wallet-cryptoicons/src/pay.svg';
import i1183 from 'kraken-wallet-cryptoicons/src/payx.svg';
import i1184 from 'kraken-wallet-cryptoicons/src/pazzi.svg';
import i1185 from 'kraken-wallet-cryptoicons/src/pbirb.svg';
import i1186 from 'kraken-wallet-cryptoicons/src/pbr.svg';
import i1187 from 'kraken-wallet-cryptoicons/src/pbtc.svg';
import i1188 from 'kraken-wallet-cryptoicons/src/pbx.svg';
import i1189 from 'kraken-wallet-cryptoicons/src/pchu.svg';
import i1190 from 'kraken-wallet-cryptoicons/src/pcx.svg';
import i1191 from 'kraken-wallet-cryptoicons/src/pdex.svg';
import i1192 from 'kraken-wallet-cryptoicons/src/pearl.svg';
import i1193 from 'kraken-wallet-cryptoicons/src/peas.svg';
import i1194 from 'kraken-wallet-cryptoicons/src/pel.svg';
import i1195 from 'kraken-wallet-cryptoicons/src/pendle.svg';
import i1196 from 'kraken-wallet-cryptoicons/src/pepe.svg';
import i1197 from 'kraken-wallet-cryptoicons/src/perl.svg';
import i1198 from 'kraken-wallet-cryptoicons/src/perp.svg';
import i1199 from 'kraken-wallet-cryptoicons/src/pha.svg';
import i1200 from 'kraken-wallet-cryptoicons/src/phb.svg';
import i1201 from 'kraken-wallet-cryptoicons/src/phnx.svg';
import i1202 from 'kraken-wallet-cryptoicons/src/phtk.svg';
import i1203 from 'kraken-wallet-cryptoicons/src/phx.svg';
import i1204 from 'kraken-wallet-cryptoicons/src/pickle.svg';
import i1205 from 'kraken-wallet-cryptoicons/src/pink.svg';
import i1206 from 'kraken-wallet-cryptoicons/src/pip.svg';
import i1207 from 'kraken-wallet-cryptoicons/src/pirl.svg';
import i1208 from 'kraken-wallet-cryptoicons/src/pivx.svg';
import i1209 from 'kraken-wallet-cryptoicons/src/pkb.svg';
import i1210 from 'kraken-wallet-cryptoicons/src/pla.svg';
import i1211 from 'kraken-wallet-cryptoicons/src/play.svg';
import i1212 from 'kraken-wallet-cryptoicons/src/plbt.svg';
import i1213 from 'kraken-wallet-cryptoicons/src/plc.svg';
import i1214 from 'kraken-wallet-cryptoicons/src/pldai.svg';
import i1215 from 'kraken-wallet-cryptoicons/src/plgr.svg';
import i1216 from 'kraken-wallet-cryptoicons/src/plr.svg';
import i1217 from 'kraken-wallet-cryptoicons/src/plt.svg';
import i1218 from 'kraken-wallet-cryptoicons/src/pltc.svg';
import i1219 from 'kraken-wallet-cryptoicons/src/plu.svg';
import i1220 from 'kraken-wallet-cryptoicons/src/plusdc.svg';
import i1221 from 'kraken-wallet-cryptoicons/src/pma.svg';
import i1222 from 'kraken-wallet-cryptoicons/src/pmgt.svg';
import i1223 from 'kraken-wallet-cryptoicons/src/pmon.svg';
import i1224 from 'kraken-wallet-cryptoicons/src/png.svg';
import i1225 from 'kraken-wallet-cryptoicons/src/pnk.svg';
import i1226 from 'kraken-wallet-cryptoicons/src/pnt.svg';
import i1227 from 'kraken-wallet-cryptoicons/src/poa.svg';
import i1228 from 'kraken-wallet-cryptoicons/src/poe.svg';
import i1229 from 'kraken-wallet-cryptoicons/src/pokt.svg';
import i1230 from 'kraken-wallet-cryptoicons/src/pol.svg';
import i1231 from 'kraken-wallet-cryptoicons/src/polc.svg';
import i1232 from 'kraken-wallet-cryptoicons/src/polis.svg';
import i1233 from 'kraken-wallet-cryptoicons/src/polk.svg';
import i1234 from 'kraken-wallet-cryptoicons/src/pols.svg';
import i1235 from 'kraken-wallet-cryptoicons/src/polx.svg';
import i1236 from 'kraken-wallet-cryptoicons/src/poly-2.svg';
import i1237 from 'kraken-wallet-cryptoicons/src/poly.svg';
import i1238 from 'kraken-wallet-cryptoicons/src/polyx.svg';
import i1239 from 'kraken-wallet-cryptoicons/src/pom.svg';
import i1240 from 'kraken-wallet-cryptoicons/src/pond.svg';
import i1241 from 'kraken-wallet-cryptoicons/src/ponke.svg';
import i1242 from 'kraken-wallet-cryptoicons/src/pont.svg';
import i1243 from 'kraken-wallet-cryptoicons/src/pool.svg';
import i1244 from 'kraken-wallet-cryptoicons/src/pop.svg';
import i1245 from 'kraken-wallet-cryptoicons/src/popcat.svg';
import i1246 from 'kraken-wallet-cryptoicons/src/pork.svg';
import i1247 from 'kraken-wallet-cryptoicons/src/porto.svg';
import i1248 from 'kraken-wallet-cryptoicons/src/pot.svg';
import i1249 from 'kraken-wallet-cryptoicons/src/potnoy.svg';
import i1250 from 'kraken-wallet-cryptoicons/src/power.svg';
import i1251 from 'kraken-wallet-cryptoicons/src/powr.svg';
import i1252 from 'kraken-wallet-cryptoicons/src/ppay.svg';
import i1253 from 'kraken-wallet-cryptoicons/src/ppc.svg';
import i1254 from 'kraken-wallet-cryptoicons/src/ppp.svg';
import i1255 from 'kraken-wallet-cryptoicons/src/ppt.svg';
import i1256 from 'kraken-wallet-cryptoicons/src/pre.svg';
import i1257 from 'kraken-wallet-cryptoicons/src/premia.svg';
import i1258 from 'kraken-wallet-cryptoicons/src/prime.svg';
import i1259 from 'kraken-wallet-cryptoicons/src/prl.svg';
import i1260 from 'kraken-wallet-cryptoicons/src/pro.svg';
import i1261 from 'kraken-wallet-cryptoicons/src/prom.svg';
import i1262 from 'kraken-wallet-cryptoicons/src/props.svg';
import i1263 from 'kraken-wallet-cryptoicons/src/pros.svg';
import i1264 from 'kraken-wallet-cryptoicons/src/prq.svg';
import i1265 from 'kraken-wallet-cryptoicons/src/psg.svg';
import i1266 from 'kraken-wallet-cryptoicons/src/psp.svg';
import i1267 from 'kraken-wallet-cryptoicons/src/pst.svg';
import i1268 from 'kraken-wallet-cryptoicons/src/pstake.svg';
import i1269 from 'kraken-wallet-cryptoicons/src/ptc.svg';
import i1270 from 'kraken-wallet-cryptoicons/src/ptoy.svg';
import i1271 from 'kraken-wallet-cryptoicons/src/pundix.svg';
import i1272 from 'kraken-wallet-cryptoicons/src/pups.svg';
import i1273 from 'kraken-wallet-cryptoicons/src/pyr.svg';
import i1274 from 'kraken-wallet-cryptoicons/src/pyth.svg';
import i1275 from 'kraken-wallet-cryptoicons/src/pyusd.svg';
import i1276 from 'kraken-wallet-cryptoicons/src/qash.svg';
import i1277 from 'kraken-wallet-cryptoicons/src/qbit.svg';
import i1278 from 'kraken-wallet-cryptoicons/src/qi.svg';
import i1279 from 'kraken-wallet-cryptoicons/src/qkc.svg';
import i1280 from 'kraken-wallet-cryptoicons/src/qlc.svg';
import i1281 from 'kraken-wallet-cryptoicons/src/qnt.svg';
import i1282 from 'kraken-wallet-cryptoicons/src/qqq.svg';
import i1283 from 'kraken-wallet-cryptoicons/src/qrdo.svg';
import i1284 from 'kraken-wallet-cryptoicons/src/qrl.svg';
import i1285 from 'kraken-wallet-cryptoicons/src/qsp.svg';
import i1286 from 'kraken-wallet-cryptoicons/src/qtum.svg';
import i1287 from 'kraken-wallet-cryptoicons/src/quick.svg';
import i1288 from 'kraken-wallet-cryptoicons/src/qun.svg';
import i1289 from 'kraken-wallet-cryptoicons/src/qwark.svg';
import i1290 from 'kraken-wallet-cryptoicons/src/r.svg';
import i1291 from 'kraken-wallet-cryptoicons/src/raca.svg';
import i1292 from 'kraken-wallet-cryptoicons/src/rad.svg';
import i1293 from 'kraken-wallet-cryptoicons/src/radar.svg';
import i1294 from 'kraken-wallet-cryptoicons/src/rads.svg';
import i1295 from 'kraken-wallet-cryptoicons/src/rae.svg';
import i1296 from 'kraken-wallet-cryptoicons/src/rai.svg';
import i1297 from 'kraken-wallet-cryptoicons/src/ramp.svg';
import i1298 from 'kraken-wallet-cryptoicons/src/ranker.svg';
import i1299 from 'kraken-wallet-cryptoicons/src/rare.svg';
import i1300 from 'kraken-wallet-cryptoicons/src/rari.svg';
import i1301 from 'kraken-wallet-cryptoicons/src/ray.svg';
import i1302 from 'kraken-wallet-cryptoicons/src/rbc.svg';
import i1303 from 'kraken-wallet-cryptoicons/src/rbn.svg';
import i1304 from 'kraken-wallet-cryptoicons/src/rbtc.svg';
import i1305 from 'kraken-wallet-cryptoicons/src/rby.svg';
import i1306 from 'kraken-wallet-cryptoicons/src/rcn.svg';
import i1307 from 'kraken-wallet-cryptoicons/src/rdd.svg';
import i1308 from 'kraken-wallet-cryptoicons/src/rdn.svg';
import i1309 from 'kraken-wallet-cryptoicons/src/rdnt.svg';
import i1310 from 'kraken-wallet-cryptoicons/src/reap.svg';
import i1311 from 'kraken-wallet-cryptoicons/src/reef.svg';
import i1312 from 'kraken-wallet-cryptoicons/src/rei.svg';
import i1313 from 'kraken-wallet-cryptoicons/src/ren.svg';
import i1314 from 'kraken-wallet-cryptoicons/src/renbtc.svg';
import i1315 from 'kraken-wallet-cryptoicons/src/render.svg';
import i1316 from 'kraken-wallet-cryptoicons/src/renfil.svg';
import i1317 from 'kraken-wallet-cryptoicons/src/rep.svg';
import i1318 from 'kraken-wallet-cryptoicons/src/req.svg';
import i1319 from 'kraken-wallet-cryptoicons/src/reth.svg';
import i1320 from 'kraken-wallet-cryptoicons/src/rev.svg';
import i1321 from 'kraken-wallet-cryptoicons/src/revo.svg';
import i1322 from 'kraken-wallet-cryptoicons/src/revu.svg';
import i1323 from 'kraken-wallet-cryptoicons/src/revv.svg';
import i1324 from 'kraken-wallet-cryptoicons/src/rfox.svg';
import i1325 from 'kraken-wallet-cryptoicons/src/rfr.svg';
import i1326 from 'kraken-wallet-cryptoicons/src/rfuel.svg';
import i1327 from 'kraken-wallet-cryptoicons/src/rfwsteth.svg';
import i1328 from 'kraken-wallet-cryptoicons/src/rgt.svg';
import i1329 from 'kraken-wallet-cryptoicons/src/rhoc.svg';
import i1330 from 'kraken-wallet-cryptoicons/src/rif.svg';
import i1331 from 'kraken-wallet-cryptoicons/src/rise.svg';
import i1332 from 'kraken-wallet-cryptoicons/src/rlc.svg';
import i1333 from 'kraken-wallet-cryptoicons/src/rly.svg';
import i1334 from 'kraken-wallet-cryptoicons/src/rmark.svg';
import i1335 from 'kraken-wallet-cryptoicons/src/rndr.svg';
import i1336 from 'kraken-wallet-cryptoicons/src/road.svg';
import i1337 from 'kraken-wallet-cryptoicons/src/roar.svg';
import i1338 from 'kraken-wallet-cryptoicons/src/ron.svg';
import i1339 from 'kraken-wallet-cryptoicons/src/roobee.svg';
import i1340 from 'kraken-wallet-cryptoicons/src/rook.svg';
import i1341 from 'kraken-wallet-cryptoicons/src/rose.svg';
import i1342 from 'kraken-wallet-cryptoicons/src/rosn.svg';
import i1343 from 'kraken-wallet-cryptoicons/src/route.svg';
import i1344 from 'kraken-wallet-cryptoicons/src/rpl.svg';
import i1345 from 'kraken-wallet-cryptoicons/src/rpx.svg';
import i1346 from 'kraken-wallet-cryptoicons/src/rsr.svg';
import i1347 from 'kraken-wallet-cryptoicons/src/rsv.svg';
import i1348 from 'kraken-wallet-cryptoicons/src/ruff.svg';
import i1349 from 'kraken-wallet-cryptoicons/src/rune.svg';
import i1350 from 'kraken-wallet-cryptoicons/src/rvn.svg';
import i1351 from 'kraken-wallet-cryptoicons/src/rvr.svg';
import i1352 from 'kraken-wallet-cryptoicons/src/ryo.svg';
import i1353 from 'kraken-wallet-cryptoicons/src/s.svg';
import i1354 from 'kraken-wallet-cryptoicons/src/safemoon.svg';
import i1355 from 'kraken-wallet-cryptoicons/src/sai.svg';
import i1356 from 'kraken-wallet-cryptoicons/src/saito.svg';
import i1357 from 'kraken-wallet-cryptoicons/src/salt.svg';
import i1358 from 'kraken-wallet-cryptoicons/src/samo.svg';
import i1359 from 'kraken-wallet-cryptoicons/src/san.svg';
import i1360 from 'kraken-wallet-cryptoicons/src/sand.svg';
import i1361 from 'kraken-wallet-cryptoicons/src/santos.svg';
import i1362 from 'kraken-wallet-cryptoicons/src/sapp.svg';
import i1363 from 'kraken-wallet-cryptoicons/src/sar.svg';
import i1364 from 'kraken-wallet-cryptoicons/src/savax.svg';
import i1365 from 'kraken-wallet-cryptoicons/src/sbd.svg';
import i1366 from 'kraken-wallet-cryptoicons/src/sbr.svg';
import i1367 from 'kraken-wallet-cryptoicons/src/sbtc.svg';
import i1368 from 'kraken-wallet-cryptoicons/src/sc.svg';
import i1369 from 'kraken-wallet-cryptoicons/src/sclp.svg';
import i1370 from 'kraken-wallet-cryptoicons/src/scrl.svg';
import i1371 from 'kraken-wallet-cryptoicons/src/scrt.svg';
import i1372 from 'kraken-wallet-cryptoicons/src/sd.svg';
import i1373 from 'kraken-wallet-cryptoicons/src/sdao.svg';
import i1374 from 'kraken-wallet-cryptoicons/src/sdl.svg';
import i1375 from 'kraken-wallet-cryptoicons/src/sdn.svg';
import i1376 from 'kraken-wallet-cryptoicons/src/sdt.svg';
import i1377 from 'kraken-wallet-cryptoicons/src/seele.svg';
import i1378 from 'kraken-wallet-cryptoicons/src/sefi.svg';
import i1379 from 'kraken-wallet-cryptoicons/src/sei.svg';
import i1380 from 'kraken-wallet-cryptoicons/src/sem.svg';
import i1381 from 'kraken-wallet-cryptoicons/src/senso.svg';
import i1382 from 'kraken-wallet-cryptoicons/src/seq.svg';
import i1383 from 'kraken-wallet-cryptoicons/src/sero.svg';
import i1384 from 'kraken-wallet-cryptoicons/src/seth.svg';
import i1385 from 'kraken-wallet-cryptoicons/src/seth2.svg';
import i1386 from 'kraken-wallet-cryptoicons/src/sfi.svg';
import i1387 from 'kraken-wallet-cryptoicons/src/sfm.svg';
import i1388 from 'kraken-wallet-cryptoicons/src/sfp-2.svg';
import i1389 from 'kraken-wallet-cryptoicons/src/sfp.svg';
import i1390 from 'kraken-wallet-cryptoicons/src/sfrxeth.svg';
import i1391 from 'kraken-wallet-cryptoicons/src/sfund.svg';
import i1392 from 'kraken-wallet-cryptoicons/src/sgb.svg';
import i1393 from 'kraken-wallet-cryptoicons/src/sha.svg';
import i1394 from 'kraken-wallet-cryptoicons/src/shdw.svg';
import i1395 from 'kraken-wallet-cryptoicons/src/shft.svg';
import i1396 from 'kraken-wallet-cryptoicons/src/shib.svg';
import i1397 from 'kraken-wallet-cryptoicons/src/shift.svg';
import i1398 from 'kraken-wallet-cryptoicons/src/shill.svg';
import i1399 from 'kraken-wallet-cryptoicons/src/ship.svg';
import i1400 from 'kraken-wallet-cryptoicons/src/shping.svg';
import i1401 from 'kraken-wallet-cryptoicons/src/shr.svg';
import i1402 from 'kraken-wallet-cryptoicons/src/shroom.svg';
import i1403 from 'kraken-wallet-cryptoicons/src/shx.svg';
import i1404 from 'kraken-wallet-cryptoicons/src/si.svg';
import i1405 from 'kraken-wallet-cryptoicons/src/sia.svg';
import i1406 from 'kraken-wallet-cryptoicons/src/sib.svg';
import i1407 from 'kraken-wallet-cryptoicons/src/silo.svg';
import i1408 from 'kraken-wallet-cryptoicons/src/skey.svg';
import i1409 from 'kraken-wallet-cryptoicons/src/skl.svg';
import i1410 from 'kraken-wallet-cryptoicons/src/sku.svg';
import i1411 from 'kraken-wallet-cryptoicons/src/sky.svg';
import i1412 from 'kraken-wallet-cryptoicons/src/sld.svg';
import i1413 from 'kraken-wallet-cryptoicons/src/slerf.svg';
import i1414 from 'kraken-wallet-cryptoicons/src/slim.svg';
import i1415 from 'kraken-wallet-cryptoicons/src/slink.svg';
import i1416 from 'kraken-wallet-cryptoicons/src/slp.svg';
import i1417 from 'kraken-wallet-cryptoicons/src/slr.svg';
import i1418 from 'kraken-wallet-cryptoicons/src/sls.svg';
import i1419 from 'kraken-wallet-cryptoicons/src/slt.svg';
import i1420 from 'kraken-wallet-cryptoicons/src/smart.svg';
import i1421 from 'kraken-wallet-cryptoicons/src/smog.svg';
import i1422 from 'kraken-wallet-cryptoicons/src/smurfcat.svg';
import i1423 from 'kraken-wallet-cryptoicons/src/snail.svg';
import i1424 from 'kraken-wallet-cryptoicons/src/snc.svg';
import i1425 from 'kraken-wallet-cryptoicons/src/sngls.svg';
import i1426 from 'kraken-wallet-cryptoicons/src/snm.svg';
import i1427 from 'kraken-wallet-cryptoicons/src/snow.svg';
import i1428 from 'kraken-wallet-cryptoicons/src/snt.svg';
import i1429 from 'kraken-wallet-cryptoicons/src/sntv.svg';
import i1430 from 'kraken-wallet-cryptoicons/src/snx.svg';
import i1431 from 'kraken-wallet-cryptoicons/src/sny.svg';
import i1432 from 'kraken-wallet-cryptoicons/src/soc.svg';
import i1433 from 'kraken-wallet-cryptoicons/src/sol.svg';
import i1434 from 'kraken-wallet-cryptoicons/src/solama.svg';
import i1435 from 'kraken-wallet-cryptoicons/src/solid.svg';
import i1436 from 'kraken-wallet-cryptoicons/src/solo.svg';
import i1437 from 'kraken-wallet-cryptoicons/src/solr.svg';
import i1438 from 'kraken-wallet-cryptoicons/src/solve.svg';
import i1439 from 'kraken-wallet-cryptoicons/src/sos.svg';
import i1440 from 'kraken-wallet-cryptoicons/src/soul.svg';
import i1441 from 'kraken-wallet-cryptoicons/src/sov.svg';
import i1442 from 'kraken-wallet-cryptoicons/src/spank.svg';
import i1443 from 'kraken-wallet-cryptoicons/src/sparta.svg';
import i1444 from 'kraken-wallet-cryptoicons/src/spell.svg';
import i1445 from 'kraken-wallet-cryptoicons/src/sphr.svg';
import i1446 from 'kraken-wallet-cryptoicons/src/sphtx.svg';
import i1447 from 'kraken-wallet-cryptoicons/src/spi.svg';
import i1448 from 'kraken-wallet-cryptoicons/src/spike.svg';
import i1449 from 'kraken-wallet-cryptoicons/src/spk.svg';
import i1450 from 'kraken-wallet-cryptoicons/src/spn.svg';
import i1451 from 'kraken-wallet-cryptoicons/src/spnd.svg';
import i1452 from 'kraken-wallet-cryptoicons/src/spr.svg';
import i1453 from 'kraken-wallet-cryptoicons/src/srm.svg';
import i1454 from 'kraken-wallet-cryptoicons/src/srn.svg';
import i1455 from 'kraken-wallet-cryptoicons/src/ssv.svg';
import i1456 from 'kraken-wallet-cryptoicons/src/stak.svg';
import i1457 from 'kraken-wallet-cryptoicons/src/stake.svg';
import i1458 from 'kraken-wallet-cryptoicons/src/stan.svg';
import i1459 from 'kraken-wallet-cryptoicons/src/starly.svg';
import i1460 from 'kraken-wallet-cryptoicons/src/start.svg';
import i1461 from 'kraken-wallet-cryptoicons/src/stc.svg';
import i1462 from 'kraken-wallet-cryptoicons/src/steem.svg';
import i1463 from 'kraken-wallet-cryptoicons/src/step.svg';
import i1464 from 'kraken-wallet-cryptoicons/src/steth-1.svg';
import i1465 from 'kraken-wallet-cryptoicons/src/steth.svg';
import i1466 from 'kraken-wallet-cryptoicons/src/stg.svg';
import i1467 from 'kraken-wallet-cryptoicons/src/stkaave.svg';
import i1468 from 'kraken-wallet-cryptoicons/src/stklyra.svg';
import i1469 from 'kraken-wallet-cryptoicons/src/stmatic.svg';
import i1470 from 'kraken-wallet-cryptoicons/src/stmx.svg';
import i1471 from 'kraken-wallet-cryptoicons/src/stnd.svg';
import i1472 from 'kraken-wallet-cryptoicons/src/storj.svg';
import i1473 from 'kraken-wallet-cryptoicons/src/storm.svg';
import i1474 from 'kraken-wallet-cryptoicons/src/stpt.svg';
import i1475 from 'kraken-wallet-cryptoicons/src/stq.svg';
import i1476 from 'kraken-wallet-cryptoicons/src/strat.svg';
import i1477 from 'kraken-wallet-cryptoicons/src/strax.svg';
import i1478 from 'kraken-wallet-cryptoicons/src/strk.svg';
import i1479 from 'kraken-wallet-cryptoicons/src/strong.svg';
import i1480 from 'kraken-wallet-cryptoicons/src/stx.svg';
import i1481 from 'kraken-wallet-cryptoicons/src/stz.svg';
import i1482 from 'kraken-wallet-cryptoicons/src/sub.svg';
import i1483 from 'kraken-wallet-cryptoicons/src/sui.svg';
import i1484 from 'kraken-wallet-cryptoicons/src/suku.svg';
import i1485 from 'kraken-wallet-cryptoicons/src/sumo.svg';
import i1486 from 'kraken-wallet-cryptoicons/src/sun.svg';
import i1487 from 'kraken-wallet-cryptoicons/src/super.svg';
import i1488 from 'kraken-wallet-cryptoicons/src/suqa.svg';
import i1489 from 'kraken-wallet-cryptoicons/src/sure.svg';
import i1490 from 'kraken-wallet-cryptoicons/src/surv.svg';
import i1491 from 'kraken-wallet-cryptoicons/src/susd.svg';
import i1492 from 'kraken-wallet-cryptoicons/src/sushi.svg';
import i1493 from 'kraken-wallet-cryptoicons/src/suter.svg';
import i1494 from 'kraken-wallet-cryptoicons/src/swap.svg';
import i1495 from 'kraken-wallet-cryptoicons/src/swash.svg';
import i1496 from 'kraken-wallet-cryptoicons/src/sweat.svg';
import i1497 from 'kraken-wallet-cryptoicons/src/swingby.svg';
import i1498 from 'kraken-wallet-cryptoicons/src/swp.svg';
import i1499 from 'kraken-wallet-cryptoicons/src/swrv.svg';
import i1500 from 'kraken-wallet-cryptoicons/src/swt.svg';
import i1501 from 'kraken-wallet-cryptoicons/src/swth.svg';
import i1502 from 'kraken-wallet-cryptoicons/src/sxdt.svg';
import i1503 from 'kraken-wallet-cryptoicons/src/sxp.svg';
import i1504 from 'kraken-wallet-cryptoicons/src/sylo.svg';
import i1505 from 'kraken-wallet-cryptoicons/src/syn.svg';
import i1506 from 'kraken-wallet-cryptoicons/src/synth.svg';
import i1507 from 'kraken-wallet-cryptoicons/src/synx.svg';
import i1508 from 'kraken-wallet-cryptoicons/src/sys.svg';
import i1509 from 'kraken-wallet-cryptoicons/src/t.svg';
import i1510 from 'kraken-wallet-cryptoicons/src/taas.svg';
import i1511 from 'kraken-wallet-cryptoicons/src/tara.svg';
import i1512 from 'kraken-wallet-cryptoicons/src/tau.svg';
import i1513 from 'kraken-wallet-cryptoicons/src/tbtc.svg';
import i1514 from 'kraken-wallet-cryptoicons/src/tbx.svg';
import i1515 from 'kraken-wallet-cryptoicons/src/tch.svg';
import i1516 from 'kraken-wallet-cryptoicons/src/tcp.svg';
import i1517 from 'kraken-wallet-cryptoicons/src/tct.svg';
import i1518 from 'kraken-wallet-cryptoicons/src/tel.svg';
import i1519 from 'kraken-wallet-cryptoicons/src/ten.svg';
import i1520 from 'kraken-wallet-cryptoicons/src/tera.svg';
import i1521 from 'kraken-wallet-cryptoicons/src/tern.svg';
import i1522 from 'kraken-wallet-cryptoicons/src/tfl.svg';
import i1523 from 'kraken-wallet-cryptoicons/src/tfuel.svg';
import i1524 from 'kraken-wallet-cryptoicons/src/thales.svg';
import i1525 from 'kraken-wallet-cryptoicons/src/thc.svg';
import i1526 from 'kraken-wallet-cryptoicons/src/thedao.svg';
import i1527 from 'kraken-wallet-cryptoicons/src/theta.svg';
import i1528 from 'kraken-wallet-cryptoicons/src/thr.svg';
import i1529 from 'kraken-wallet-cryptoicons/src/tia.svg';
import i1530 from 'kraken-wallet-cryptoicons/src/tidal.svg';
import i1531 from 'kraken-wallet-cryptoicons/src/time.svg';
import i1532 from 'kraken-wallet-cryptoicons/src/tio.svg';
import i1533 from 'kraken-wallet-cryptoicons/src/titan.svg';
import i1534 from 'kraken-wallet-cryptoicons/src/tix.svg';
import i1535 from 'kraken-wallet-cryptoicons/src/tkn.svg';
import i1536 from 'kraken-wallet-cryptoicons/src/tko.svg';
import i1537 from 'kraken-wallet-cryptoicons/src/tks.svg';
import i1538 from 'kraken-wallet-cryptoicons/src/tky.svg';
import i1539 from 'kraken-wallet-cryptoicons/src/tlm.svg';
import i1540 from 'kraken-wallet-cryptoicons/src/tlos.svg';
import i1541 from 'kraken-wallet-cryptoicons/src/tnb.svg';
import i1542 from 'kraken-wallet-cryptoicons/src/tnc.svg';
import i1543 from 'kraken-wallet-cryptoicons/src/tnd.svg';
import i1544 from 'kraken-wallet-cryptoicons/src/tnt.svg';
import i1545 from 'kraken-wallet-cryptoicons/src/toby.svg';
import i1546 from 'kraken-wallet-cryptoicons/src/toke.svg';
import i1547 from 'kraken-wallet-cryptoicons/src/toko.svg';
import i1548 from 'kraken-wallet-cryptoicons/src/tomb.svg';
import i1549 from 'kraken-wallet-cryptoicons/src/tomi.svg';
import i1550 from 'kraken-wallet-cryptoicons/src/tomo.svg';
import i1551 from 'kraken-wallet-cryptoicons/src/ton.svg';
import i1552 from 'kraken-wallet-cryptoicons/src/tonic.svg';
import i1553 from 'kraken-wallet-cryptoicons/src/tor.svg';
import i1554 from 'kraken-wallet-cryptoicons/src/torn.svg';
import i1555 from 'kraken-wallet-cryptoicons/src/toshi.svg';
import i1556 from 'kraken-wallet-cryptoicons/src/tower.svg';
import i1557 from 'kraken-wallet-cryptoicons/src/tox.svg';
import i1558 from 'kraken-wallet-cryptoicons/src/tpay.svg';
import i1559 from 'kraken-wallet-cryptoicons/src/tra.svg';
import i1560 from 'kraken-wallet-cryptoicons/src/trac.svg';
import i1561 from 'kraken-wallet-cryptoicons/src/trade.svg';
import i1562 from 'kraken-wallet-cryptoicons/src/trb.svg';
import i1563 from 'kraken-wallet-cryptoicons/src/tremp.svg';
import i1564 from 'kraken-wallet-cryptoicons/src/trias.svg';
import i1565 from 'kraken-wallet-cryptoicons/src/tribe.svg';
import i1566 from 'kraken-wallet-cryptoicons/src/trig.svg';
import i1567 from 'kraken-wallet-cryptoicons/src/troy.svg';
import i1568 from 'kraken-wallet-cryptoicons/src/trst.svg';
import i1569 from 'kraken-wallet-cryptoicons/src/trtl.svg';
import i1570 from 'kraken-wallet-cryptoicons/src/tru.svg';
import i1571 from 'kraken-wallet-cryptoicons/src/trump.svg';
import i1572 from 'kraken-wallet-cryptoicons/src/trvl.svg';
import i1573 from 'kraken-wallet-cryptoicons/src/trx.svg';
import i1574 from 'kraken-wallet-cryptoicons/src/try.svg';
import i1575 from 'kraken-wallet-cryptoicons/src/tryb.svg';
import i1576 from 'kraken-wallet-cryptoicons/src/tt.svg';
import i1577 from 'kraken-wallet-cryptoicons/src/ttc.svg';
import i1578 from 'kraken-wallet-cryptoicons/src/ttt.svg';
import i1579 from 'kraken-wallet-cryptoicons/src/tube.svg';
import i1580 from 'kraken-wallet-cryptoicons/src/tur.svg';
import i1581 from 'kraken-wallet-cryptoicons/src/tusd.svg';
import i1582 from 'kraken-wallet-cryptoicons/src/tvk.svg';
import i1583 from 'kraken-wallet-cryptoicons/src/twt.svg';
import i1584 from 'kraken-wallet-cryptoicons/src/txa.svg';
import i1585 from 'kraken-wallet-cryptoicons/src/tybg.svg';
import i1586 from 'kraken-wallet-cryptoicons/src/tyzen.svg';
import i1587 from 'kraken-wallet-cryptoicons/src/tzc.svg';
import i1588 from 'kraken-wallet-cryptoicons/src/ubi.svg';
import i1589 from 'kraken-wallet-cryptoicons/src/ubq.svg';
import i1590 from 'kraken-wallet-cryptoicons/src/ubsn.svg';
import i1591 from 'kraken-wallet-cryptoicons/src/ubt.svg';
import i1592 from 'kraken-wallet-cryptoicons/src/ubx.svg';
import i1593 from 'kraken-wallet-cryptoicons/src/ubxt.svg';
import i1594 from 'kraken-wallet-cryptoicons/src/udoo.svg';
import i1595 from 'kraken-wallet-cryptoicons/src/ufo.svg';
import i1596 from 'kraken-wallet-cryptoicons/src/uft.svg';
import i1597 from 'kraken-wallet-cryptoicons/src/ukg.svg';
import i1598 from 'kraken-wallet-cryptoicons/src/ult.svg';
import i1599 from 'kraken-wallet-cryptoicons/src/uma.svg';
import i1600 from 'kraken-wallet-cryptoicons/src/umb.svg';
import i1601 from 'kraken-wallet-cryptoicons/src/umee.svg';
import i1602 from 'kraken-wallet-cryptoicons/src/unb.svg';
import i1603 from 'kraken-wallet-cryptoicons/src/uncx.svg';
import i1604 from 'kraken-wallet-cryptoicons/src/unfi.svg';
import i1605 from 'kraken-wallet-cryptoicons/src/uni.svg';
import i1606 from 'kraken-wallet-cryptoicons/src/unic.svg';
import i1607 from 'kraken-wallet-cryptoicons/src/unidaieth.svg';
import i1608 from 'kraken-wallet-cryptoicons/src/unilendeth.svg';
import i1609 from 'kraken-wallet-cryptoicons/src/unilinketh.svg';
import i1610 from 'kraken-wallet-cryptoicons/src/unimkreth.svg';
import i1611 from 'kraken-wallet-cryptoicons/src/uniqo.svg';
import i1612 from 'kraken-wallet-cryptoicons/src/unisetheth.svg';
import i1613 from 'kraken-wallet-cryptoicons/src/uniusdceth.svg';
import i1614 from 'kraken-wallet-cryptoicons/src/unn.svg';
import i1615 from 'kraken-wallet-cryptoicons/src/uno.svg';
import i1616 from 'kraken-wallet-cryptoicons/src/uos.svg';
import i1617 from 'kraken-wallet-cryptoicons/src/up.svg';
import i1618 from 'kraken-wallet-cryptoicons/src/upi.svg';
import i1619 from 'kraken-wallet-cryptoicons/src/upp.svg';
import i1620 from 'kraken-wallet-cryptoicons/src/uqc.svg';
import i1621 from 'kraken-wallet-cryptoicons/src/usd+.svg';
import i1622 from 'kraken-wallet-cryptoicons/src/usd.svg';
import i1623 from 'kraken-wallet-cryptoicons/src/usdc.svg';
import i1624 from 'kraken-wallet-cryptoicons/src/usdce.svg';
import i1625 from 'kraken-wallet-cryptoicons/src/usdd.svg';
import i1626 from 'kraken-wallet-cryptoicons/src/usdj.svg';
import i1627 from 'kraken-wallet-cryptoicons/src/usdn.svg';
import i1628 from 'kraken-wallet-cryptoicons/src/usdp.svg';
import i1629 from 'kraken-wallet-cryptoicons/src/usds.svg';
import i1630 from 'kraken-wallet-cryptoicons/src/usdt.svg';
import i1631 from 'kraken-wallet-cryptoicons/src/ust.svg';
import i1632 from 'kraken-wallet-cryptoicons/src/ustc.svg';
import i1633 from 'kraken-wallet-cryptoicons/src/usx.svg';
import i1634 from 'kraken-wallet-cryptoicons/src/ut.svg';
import i1635 from 'kraken-wallet-cryptoicons/src/utk.svg';
import i1636 from 'kraken-wallet-cryptoicons/src/uuu.svg';
import i1637 from 'kraken-wallet-cryptoicons/src/vader.svg';
import i1638 from 'kraken-wallet-cryptoicons/src/vai.svg';
import i1639 from 'kraken-wallet-cryptoicons/src/value.svg';
import i1640 from 'kraken-wallet-cryptoicons/src/vee.svg';
import i1641 from 'kraken-wallet-cryptoicons/src/veed.svg';
import i1642 from 'kraken-wallet-cryptoicons/src/vega.svg';
import i1643 from 'kraken-wallet-cryptoicons/src/veil.svg';
import i1644 from 'kraken-wallet-cryptoicons/src/vekwenta.svg';
import i1645 from 'kraken-wallet-cryptoicons/src/vela.svg';
import i1646 from 'kraken-wallet-cryptoicons/src/velo.svg';
import i1647 from 'kraken-wallet-cryptoicons/src/vemp.svg';
import i1648 from 'kraken-wallet-cryptoicons/src/ven.svg';
import i1649 from 'kraken-wallet-cryptoicons/src/veri.svg';
import i1650 from 'kraken-wallet-cryptoicons/src/vest.svg';
import i1651 from 'kraken-wallet-cryptoicons/src/vet.svg';
import i1652 from 'kraken-wallet-cryptoicons/src/vgx.svg';
import i1653 from 'kraken-wallet-cryptoicons/src/via.svg';
import i1654 from 'kraken-wallet-cryptoicons/src/vib.svg';
import i1655 from 'kraken-wallet-cryptoicons/src/vibe.svg';
import i1656 from 'kraken-wallet-cryptoicons/src/vid.svg';
import i1657 from 'kraken-wallet-cryptoicons/src/vidt.svg';
import i1658 from 'kraken-wallet-cryptoicons/src/vikky.svg';
import i1659 from 'kraken-wallet-cryptoicons/src/vin.svg';
import i1660 from 'kraken-wallet-cryptoicons/src/vina.svg';
import i1661 from 'kraken-wallet-cryptoicons/src/vita.svg';
import i1662 from 'kraken-wallet-cryptoicons/src/vite.svg';
import i1663 from 'kraken-wallet-cryptoicons/src/viu.svg';
import i1664 from 'kraken-wallet-cryptoicons/src/vix.svg';
import i1665 from 'kraken-wallet-cryptoicons/src/vlx.svg';
import i1666 from 'kraken-wallet-cryptoicons/src/vnx.svg';
import i1667 from 'kraken-wallet-cryptoicons/src/vol.svg';
import i1668 from 'kraken-wallet-cryptoicons/src/voxel.svg';
import i1669 from 'kraken-wallet-cryptoicons/src/vr.svg';
import i1670 from 'kraken-wallet-cryptoicons/src/vra.svg';
import i1671 from 'kraken-wallet-cryptoicons/src/vrc.svg';
import i1672 from 'kraken-wallet-cryptoicons/src/vrm.svg';
import i1673 from 'kraken-wallet-cryptoicons/src/vrs.svg';
import i1674 from 'kraken-wallet-cryptoicons/src/vrsc.svg';
import i1675 from 'kraken-wallet-cryptoicons/src/vrt.svg';
import i1676 from 'kraken-wallet-cryptoicons/src/vsp.svg';
import i1677 from 'kraken-wallet-cryptoicons/src/vsys.svg';
import i1678 from 'kraken-wallet-cryptoicons/src/vtc.svg';
import i1679 from 'kraken-wallet-cryptoicons/src/vtho.svg';
import i1680 from 'kraken-wallet-cryptoicons/src/vtr.svg';
import i1681 from 'kraken-wallet-cryptoicons/src/vvs.svg';
import i1682 from 'kraken-wallet-cryptoicons/src/vxv.svg';
import i1683 from 'kraken-wallet-cryptoicons/src/wabi.svg';
import i1684 from 'kraken-wallet-cryptoicons/src/wan.svg';
import i1685 from 'kraken-wallet-cryptoicons/src/warp.svg';
import i1686 from 'kraken-wallet-cryptoicons/src/wassie.svg';
import i1687 from 'kraken-wallet-cryptoicons/src/wavax.svg';
import i1688 from 'kraken-wallet-cryptoicons/src/waves.svg';
import i1689 from 'kraken-wallet-cryptoicons/src/wax.svg';
import i1690 from 'kraken-wallet-cryptoicons/src/waxp.svg';
import i1691 from 'kraken-wallet-cryptoicons/src/wbnb.svg';
import i1692 from 'kraken-wallet-cryptoicons/src/wbtc.svg';
import i1693 from 'kraken-wallet-cryptoicons/src/wct.svg';
import i1694 from 'kraken-wallet-cryptoicons/src/web.svg';
import i1695 from 'kraken-wallet-cryptoicons/src/wemix.svg';
import i1696 from 'kraken-wallet-cryptoicons/src/wen.svg';
import i1697 from 'kraken-wallet-cryptoicons/src/west.svg';
import i1698 from 'kraken-wallet-cryptoicons/src/weth.svg';
import i1699 from 'kraken-wallet-cryptoicons/src/wexpoly.svg';
import i1700 from 'kraken-wallet-cryptoicons/src/wftm.svg';
import i1701 from 'kraken-wallet-cryptoicons/src/wgr.svg';
import i1702 from 'kraken-wallet-cryptoicons/src/wgro.svg';
import i1703 from 'kraken-wallet-cryptoicons/src/whale.svg';
import i1704 from 'kraken-wallet-cryptoicons/src/whoren.svg';
import i1705 from 'kraken-wallet-cryptoicons/src/wib.svg';
import i1706 from 'kraken-wallet-cryptoicons/src/wicc.svg';
import i1707 from 'kraken-wallet-cryptoicons/src/wif-1.svg';
import i1708 from 'kraken-wallet-cryptoicons/src/wild.svg';
import i1709 from 'kraken-wallet-cryptoicons/src/win.svg';
import i1710 from 'kraken-wallet-cryptoicons/src/wing.svg';
import i1711 from 'kraken-wallet-cryptoicons/src/wings.svg';
import i1712 from 'kraken-wallet-cryptoicons/src/wis.svg';
import i1713 from 'kraken-wallet-cryptoicons/src/wld.svg';
import i1714 from 'kraken-wallet-cryptoicons/src/wmatic.svg';
import i1715 from 'kraken-wallet-cryptoicons/src/wmp.svg';
import i1716 from 'kraken-wallet-cryptoicons/src/wmt.svg';
import i1717 from 'kraken-wallet-cryptoicons/src/wndr.svg';
import i1718 from 'kraken-wallet-cryptoicons/src/wnxm.svg';
import i1719 from 'kraken-wallet-cryptoicons/src/wom.svg';
import i1720 from 'kraken-wallet-cryptoicons/src/wone.svg';
import i1721 from 'kraken-wallet-cryptoicons/src/woo.svg';
import i1722 from 'kraken-wallet-cryptoicons/src/wopenx.svg';
import i1723 from 'kraken-wallet-cryptoicons/src/wowow.svg';
import i1724 from 'kraken-wallet-cryptoicons/src/wozx.svg';
import i1725 from 'kraken-wallet-cryptoicons/src/wpr.svg';
import i1726 from 'kraken-wallet-cryptoicons/src/wrx.svg';
import i1727 from 'kraken-wallet-cryptoicons/src/wsienna.svg';
import i1728 from 'kraken-wallet-cryptoicons/src/wsteth.svg';
import i1729 from 'kraken-wallet-cryptoicons/src/wtbt.svg';
import i1730 from 'kraken-wallet-cryptoicons/src/wtc.svg';
import i1731 from 'kraken-wallet-cryptoicons/src/wxt.svg';
import i1732 from 'kraken-wallet-cryptoicons/src/x2y2.svg';
import i1733 from 'kraken-wallet-cryptoicons/src/xai.svg';
import i1734 from 'kraken-wallet-cryptoicons/src/xas.svg';
import i1735 from 'kraken-wallet-cryptoicons/src/xaut.svg';
import i1736 from 'kraken-wallet-cryptoicons/src/xava.svg';
import i1737 from 'kraken-wallet-cryptoicons/src/xbc.svg';
import i1738 from 'kraken-wallet-cryptoicons/src/xby.svg';
import i1739 from 'kraken-wallet-cryptoicons/src/xcad.svg';
import i1740 from 'kraken-wallet-cryptoicons/src/xch.svg';
import i1741 from 'kraken-wallet-cryptoicons/src/xchf.svg';
import i1742 from 'kraken-wallet-cryptoicons/src/xcm.svg';
import i1743 from 'kraken-wallet-cryptoicons/src/xcn.svg';
import i1744 from 'kraken-wallet-cryptoicons/src/xcp.svg';
import i1745 from 'kraken-wallet-cryptoicons/src/xcur.svg';
import i1746 from 'kraken-wallet-cryptoicons/src/xdata.svg';
import i1747 from 'kraken-wallet-cryptoicons/src/xdb.svg';
import i1748 from 'kraken-wallet-cryptoicons/src/xdc.svg';
import i1749 from 'kraken-wallet-cryptoicons/src/xdfi.svg';
import i1750 from 'kraken-wallet-cryptoicons/src/xdn.svg';
import i1751 from 'kraken-wallet-cryptoicons/src/xec.svg';
import i1752 from 'kraken-wallet-cryptoicons/src/xed.svg';
import i1753 from 'kraken-wallet-cryptoicons/src/xel.svg';
import i1754 from 'kraken-wallet-cryptoicons/src/xem.svg';
import i1755 from 'kraken-wallet-cryptoicons/src/xft.svg';
import i1756 from 'kraken-wallet-cryptoicons/src/xhv.svg';
import i1757 from 'kraken-wallet-cryptoicons/src/xido.svg';
import i1758 from 'kraken-wallet-cryptoicons/src/xin.svg';
import i1759 from 'kraken-wallet-cryptoicons/src/xlm.svg';
import i1760 from 'kraken-wallet-cryptoicons/src/xln.svg';
import i1761 from 'kraken-wallet-cryptoicons/src/xlq.svg';
import i1762 from 'kraken-wallet-cryptoicons/src/xmark.svg';
import i1763 from 'kraken-wallet-cryptoicons/src/xmg.svg';
import i1764 from 'kraken-wallet-cryptoicons/src/xmr.svg';
import i1765 from 'kraken-wallet-cryptoicons/src/xmt.svg';
import i1766 from 'kraken-wallet-cryptoicons/src/xmx.svg';
import i1767 from 'kraken-wallet-cryptoicons/src/xmy.svg';
import i1768 from 'kraken-wallet-cryptoicons/src/xnc.svg';
import i1769 from 'kraken-wallet-cryptoicons/src/xnk.svg';
import i1770 from 'kraken-wallet-cryptoicons/src/xnl.svg';
import i1771 from 'kraken-wallet-cryptoicons/src/xno.svg';
import i1772 from 'kraken-wallet-cryptoicons/src/xns.svg';
import i1773 from 'kraken-wallet-cryptoicons/src/xor.svg';
import i1774 from 'kraken-wallet-cryptoicons/src/xp.svg';
import i1775 from 'kraken-wallet-cryptoicons/src/xpa.svg';
import i1776 from 'kraken-wallet-cryptoicons/src/xpm.svg';
import i1777 from 'kraken-wallet-cryptoicons/src/xpr.svg';
import i1778 from 'kraken-wallet-cryptoicons/src/xprt.svg';
import i1779 from 'kraken-wallet-cryptoicons/src/xrd.svg';
import i1780 from 'kraken-wallet-cryptoicons/src/xrp.svg';
import i1781 from 'kraken-wallet-cryptoicons/src/xrt.svg';
import i1782 from 'kraken-wallet-cryptoicons/src/xsg.svg';
import i1783 from 'kraken-wallet-cryptoicons/src/xsn.svg';
import i1784 from 'kraken-wallet-cryptoicons/src/xsr.svg';
import i1785 from 'kraken-wallet-cryptoicons/src/xst.svg';
import i1786 from 'kraken-wallet-cryptoicons/src/xsushi.svg';
import i1787 from 'kraken-wallet-cryptoicons/src/xt.svg';
import i1788 from 'kraken-wallet-cryptoicons/src/xtag.svg';
import i1789 from 'kraken-wallet-cryptoicons/src/xtm.svg';
import i1790 from 'kraken-wallet-cryptoicons/src/xtp.svg';
import i1791 from 'kraken-wallet-cryptoicons/src/xtz.svg';
import i1792 from 'kraken-wallet-cryptoicons/src/xuc.svg';
import i1793 from 'kraken-wallet-cryptoicons/src/xvc.svg';
import i1794 from 'kraken-wallet-cryptoicons/src/xvg.svg';
import i1795 from 'kraken-wallet-cryptoicons/src/xvs.svg';
import i1796 from 'kraken-wallet-cryptoicons/src/xwc.svg';
import i1797 from 'kraken-wallet-cryptoicons/src/xym.svg';
import i1798 from 'kraken-wallet-cryptoicons/src/xyo.svg';
import i1799 from 'kraken-wallet-cryptoicons/src/xyz.svg';
import i1800 from 'kraken-wallet-cryptoicons/src/xzc.svg';
import i1801 from 'kraken-wallet-cryptoicons/src/yfdai.svg';
import i1802 from 'kraken-wallet-cryptoicons/src/yfi.svg';
import i1803 from 'kraken-wallet-cryptoicons/src/yfii.svg';
import i1804 from 'kraken-wallet-cryptoicons/src/ygg.svg';
import i1805 from 'kraken-wallet-cryptoicons/src/yld.svg';
import i1806 from 'kraken-wallet-cryptoicons/src/yop.svg';
import i1807 from 'kraken-wallet-cryptoicons/src/youc.svg';
import i1808 from 'kraken-wallet-cryptoicons/src/yoyo.svg';
import i1809 from 'kraken-wallet-cryptoicons/src/yoyow.svg';
import i1810 from 'kraken-wallet-cryptoicons/src/zai.svg';
import i1811 from 'kraken-wallet-cryptoicons/src/zar.svg';
import i1812 from 'kraken-wallet-cryptoicons/src/zb.svg';
import i1813 from 'kraken-wallet-cryptoicons/src/zcl.svg';
import i1814 from 'kraken-wallet-cryptoicons/src/zco.svg';
import i1815 from 'kraken-wallet-cryptoicons/src/zcx.svg';
import i1816 from 'kraken-wallet-cryptoicons/src/zec.svg';
import i1817 from 'kraken-wallet-cryptoicons/src/zee.svg';
import i1818 from 'kraken-wallet-cryptoicons/src/zel.svg';
import i1819 from 'kraken-wallet-cryptoicons/src/zen.svg';
import i1820 from 'kraken-wallet-cryptoicons/src/zeon.svg';
import i1821 from 'kraken-wallet-cryptoicons/src/zeta.svg';
import i1822 from 'kraken-wallet-cryptoicons/src/zil.svg';
import i1823 from 'kraken-wallet-cryptoicons/src/zip.svg';
import i1824 from 'kraken-wallet-cryptoicons/src/zks.svg';
import i1825 from 'kraken-wallet-cryptoicons/src/zkt.svg';
import i1826 from 'kraken-wallet-cryptoicons/src/zlw.svg';
import i1827 from 'kraken-wallet-cryptoicons/src/znn.svg';
import i1828 from 'kraken-wallet-cryptoicons/src/zort.svg';
import i1829 from 'kraken-wallet-cryptoicons/src/zpay.svg';
import i1830 from 'kraken-wallet-cryptoicons/src/zrx.svg';
import i1831 from 'kraken-wallet-cryptoicons/src/zusd.svg';

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
  'bld': i214,
  'blitz': i215,
  'blk': i216,
  'bloc': i217,
  'block': i218,
  'blok': i219,
  'blt': i220,
  'blue': i221,
  'blur': i222,
  'blz': i223,
  'bmc': i224,
  'bmda': i225,
  'bmon': i226,
  'bmx': i227,
  'bnana': i228,
  'bnb': i229,
  'bnc': i230,
  'bnk': i231,
  'bns': i232,
  'bnt': i233,
  'bnty': i234,
  'bnx': i235,
  'boa': i236,
  'bob': i237,
  'bobo': i238,
  'boden': i239,
  'bolt': i240,
  'bome': i241,
  'bond-2': i242,
  'bond': i243,
  'bondly': i244,
  'bone': i245,
  'bonk': i246,
  'boo': i247,
  'bora': i248,
  'bos': i249,
  'boson': i250,
  'bot': i251,
  'botto': i252,
  'botx': i253,
  'box': i254,
  'bpt': i255,
  'bqx': i256,
  'brd': i257,
  'brett': i258,
  'brg': i259,
  'brise': i260,
  'briun': i261,
  'brk': i262,
  'brx': i263,
  'brz': i264,
  'bsd': i265,
  'bst': i266,
  'bsv': i267,
  'bsw': i268,
  'btc++': i269,
  'btc': i270,
  'btcb': i271,
  'btcd': i272,
  'btcp': i273,
  'btcst': i274,
  'btcz': i275,
  'btdx': i276,
  'btg': i277,
  'btm': i278,
  'btmx': i279,
  'bto': i280,
  'btr': i281,
  'btrst': i282,
  'bts': i283,
  'btt': i284,
  'btu': i285,
  'btx': i286,
  'bu': i287,
  'bunny': i288,
  'burger': i289,
  'burp': i290,
  'burst': i291,
  'busd': i292,
  'bux': i293,
  'buy': i294,
  'bwt': i295,
  'byc': i296,
  'bz': i297,
  'bznt': i298,
  'bzrx': i299,
  'c20': i300,
  'c98': i301,
  'cag': i302,
  'cake': i303,
  'canto': i304,
  'cap': i305,
  'capp': i306,
  'car': i307,
  'card': i308,
  'carr': i309,
  'cas': i310,
  'cbat': i311,
  'cbc': i312,
  'cbeth': i313,
  'cbt': i314,
  'cccx': i315,
  'cce': i316,
  'ccxx': i317,
  'cdai': i318,
  'cdt': i319,
  'cel': i320,
  'celo': i321,
  'celr': i322,
  'cennz': i323,
  'cere': i324,
  'cet': i325,
  'ceth': i326,
  'cfg': i327,
  'cfi': i328,
  'cfx': i329,
  'cgg': i330,
  'chai': i331,
  'chain': i332,
  'chat': i333,
  'chcb': i334,
  'chess': i335,
  'chi': i336,
  'chmb': i337,
  'cho': i338,
  'chp': i339,
  'chr': i340,
  'chsb': i341,
  'chz': i342,
  'cirus': i343,
  'city': i344,
  'cix100': i345,
  'ckb': i346,
  'clam': i347,
  'clh': i348,
  'clo': i349,
  'cloak': i350,
  'clout': i351,
  'club': i352,
  'clv': i353,
  'cmct': i354,
  'cmm': i355,
  'cmt': i356,
  'cnc': i357,
  'cnd': i358,
  'cnx': i359,
  'cob': i360,
  'coc': i361,
  'cocn': i362,
  'cocos': i363,
  'cofi': i364,
  'coinye': i365,
  'colx': i366,
  'comb': i367,
  'combo': i368,
  'comp': i369,
  'cone': i370,
  'coni': i371,
  'core': i372,
  'corgiai': i373,
  'cos': i374,
  'cosm': i375,
  'cost': i376,
  'coti': i377,
  'cov': i378,
  'cova': i379,
  'coval': i380,
  'cover': i381,
  'cpc': i382,
  'cpool': i383,
  'cpx': i384,
  'cqt': i385,
  'cra': i386,
  'crb': i387,
  'crd': i388,
  'cre': i389,
  'cream': i390,
  'cred': i391,
  'credi': i392,
  'crep': i393,
  'cro': i394,
  'crpt': i395,
  'crts': i396,
  'cru': i397,
  'crunch': i398,
  'crv': i399,
  'crw': i400,
  'cs': i401,
  'csai': i402,
  'csc': i403,
  'csp': i404,
  'cspr': i405,
  'ctc': i406,
  'cti': i407,
  'ctk': i408,
  'ctsi': i409,
  'ctx': i410,
  'ctxc': i411,
  'cube': i412,
  'cudos': i413,
  'cult': i414,
  'cusd': i415,
  'cusdc': i416,
  'cusdt-1': i417,
  'cusdt': i418,
  'cv': i419,
  'cvc': i420,
  'cvp': i421,
  'cvt': i422,
  'cvx': i423,
  'cwar': i424,
  'cwbtc': i425,
  'cweb': i426,
  'cws': i427,
  'cxo': i428,
  'cyber': i429,
  'czrx': i430,
  'dacc': i431,
  'dadi': i432,
  'dafi': i433,
  'dag': i434,
  'dai': i435,
  'dao': i436,
  'dappt': i437,
  'dappx': i438,
  'dar': i439,
  'dasc': i440,
  'dash': i441,
  'dat': i442,
  'data': i443,
  'datx': i444,
  'dawn': i445,
  'dbc': i446,
  'dcc': i447,
  'dcn': i448,
  'dcr': i449,
  'dct': i450,
  'ddd': i451,
  'ddj': i452,
  'ddx': i453,
  'defi': i454,
  'degen': i455,
  'dego': i456,
  'dent': i457,
  'dep': i458,
  'derc': i459,
  'deri': i460,
  'dero': i461,
  'deso': i462,
  'dexe': i463,
  'df': i464,
  'dfi': i465,
  'dft': i466,
  'dfyn': i467,
  'dgb': i468,
  'dgd': i469,
  'dgtx': i470,
  'dht': i471,
  'dia': i472,
  'dinero': i473,
  'dino': i474,
  'divi': i475,
  'dlt': i476,
  'dmd': i477,
  'dmg': i478,
  'dmt': i479,
  'dmtr': i480,
  'dnt': i481,
  'dock': i482,
  'dodo': i483,
  'dog': i484,
  'doge': i485,
  'doginme': i486,
  'dojo': i487,
  'dola': i488,
  'dome': i489,
  'dor': i490,
  'dora': i491,
  'dorkl': i492,
  'dot': i493,
  'dpi': i494,
  'dpr': i495,
  'dpx': i496,
  'drc': i497,
  'dreams': i498,
  'drep': i499,
  'drg': i500,
  'drgn': i501,
  'drop': i502,
  'drs': i503,
  'drt': i504,
  'dsla': i505,
  'dta': i506,
  'dth': i507,
  'dtr': i508,
  'dtx': i509,
  'dusk': i510,
  'dvf': i511,
  'dvi': i512,
  'dvpn': i513,
  'dx': i514,
  'dxd': i515,
  'dxt': i516,
  'dydx': i517,
  'dym': i518,
  'dyn': i519,
  'dypc': i520,
  'easy': i521,
  'ebst': i522,
  'eca': i523,
  'eco': i524,
  'edg': i525,
  'edge': i526,
  'edn': i527,
  'edo': i528,
  'edu': i529,
  'efi': i530,
  'efl': i531,
  'efx': i532,
  'egc': i533,
  'egld': i534,
  'egr': i535,
  'egt': i536,
  'ekg': i537,
  'ekt': i538,
  'ela': i539,
  'elan': i540,
  'elec': i541,
  'elf': i542,
  'elg': i543,
  'ella': i544,
  'elon': i545,
  'emc': i546,
  'emc2': i547,
  'eng': i548,
  'enj': i549,
  'enq': i550,
  'enrg': i551,
  'ens': i552,
  'eos': i553,
  'eosc': i554,
  'eosdac': i555,
  'epic': i556,
  'epik': i557,
  'epx': i558,
  'eqb': i559,
  'eqx': i560,
  'eqz': i561,
  'erc': i562,
  'erg': i563,
  'ern': i564,
  'ersdl': i565,
  'ertha': i566,
  'esbc': i567,
  'esd': i568,
  'esp': i569,
  'ess': i570,
  'etc': i571,
  'eth': i572,
  'eth2 v2': i573,
  'eth2': i574,
  'etha': i575,
  'ethdydx': i576,
  'etho': i577,
  'ethw': i578,
  'etn': i579,
  'etp': i580,
  'etz': i581,
  'eum': i582,
  'eur': i583,
  'euroc': i584,
  'eurs': i585,
  'eurt': i586,
  'evmos': i587,
  'evx': i588,
  'ewt': i589,
  'excl': i590,
  'exp': i591,
  'exrd': i592,
  'exrn': i593,
  'exy': i594,
  'ezy': i595,
  'fab': i596,
  'face': i597,
  'falcon': i598,
  'farm': i599,
  'fcon': i600,
  'fct': i601,
  'fdusd': i602,
  'fear': i603,
  'feed': i604,
  'fei': i605,
  'fet': i606,
  'fft': i607,
  'fida': i608,
  'fil': i609,
  'filda': i610,
  'fio': i611,
  'firo': i612,
  'fis': i613,
  'fitfi': i614,
  'fjc': i615,
  'fkx': i616,
  'flame': i617,
  'flash': i618,
  'flc': i619,
  'fldc': i620,
  'flex': i621,
  'flm': i622,
  'flo': i623,
  'floki': i624,
  'flow': i625,
  'flr': i626,
  'flux': i627,
  'fly': i628,
  'foam': i629,
  'fold': i630,
  'for': i631,
  'forestplus': i632,
  'form': i633,
  'forta': i634,
  'forth': i635,
  'fota': i636,
  'fox': i637,
  'fpi': i638,
  'fpis': i639,
  'frame': i640,
  'frax': i641,
  'fren': i642,
  'frm': i643,
  'front': i644,
  'frr': i645,
  'frxeth': i646,
  'fsn': i647,
  'fst': i648,
  'ft': i649,
  'ftc': i650,
  'ftg': i651,
  'ftm': i652,
  'ftt': i653,
  'fuel': i654,
  'fun': i655,
  'fuse': i656,
  'fx': i657,
  'fxc': i658,
  'fxs': i659,
  'fxt': i660,
  'gafi': i661,
  'gal': i662,
  'gala': i663,
  'gam': i664,
  'gamb': i665,
  'game': i666,
  'gamee': i667,
  'gari': i668,
  'gas': i669,
  'gbg': i670,
  'gbp': i671,
  'gbx': i672,
  'gbyte': i673,
  'gcr': i674,
  'gdc': i675,
  'gear': i676,
  'geeq': i677,
  'geist': i678,
  'gem': i679,
  'gen': i680,
  'gens': i681,
  'geo': i682,
  'gf': i683,
  'gfi': i684,
  'ggc': i685,
  'ggg': i686,
  'gho': i687,
  'ghst': i688,
  'ghx': i689,
  'gin': i690,
  'giv': i691,
  'glch': i692,
  'gld': i693,
  'glm': i694,
  'glmr': i695,
  'glq': i696,
  'gls': i697,
  'gmee': i698,
  'gmt': i699,
  'gmx': i700,
  'gno': i701,
  'gns': i702,
  'gnt': i703,
  'gnx': i704,
  'go': i705,
  'goc': i706,
  'gom2': i707,
  'got': i708,
  'govi': i709,
  'grail': i710,
  'grc': i711,
  'grg': i712,
  'grin': i713,
  'grow': i714,
  'grs': i715,
  'grt': i716,
  'gsc': i717,
  'gspi': i718,
  'gst': i719,
  'gswap': i720,
  'gt': i721,
  'gtc': i722,
  'gto': i723,
  'guild': i724,
  'gup': i725,
  'gusd': i726,
  'gvt': i727,
  'gxc': i728,
  'gxs': i729,
  'gyen': i730,
  'h3ro3s': i731,
  'hai': i732,
  'hair': i733,
  'haka': i734,
  'hakka': i735,
  'han': i736,
  'hanep': i737,
  'hapi': i738,
  'harambe': i739,
  'hard': i740,
  'hash': i741,
  'hav': i742,
  'hbar': i743,
  'hbb': i744,
  'hbtc': i745,
  'hc': i746,
  'heart': i747,
  'hedg': i748,
  'hegic': i749,
  'her': i750,
  'hero': i751,
  'hex': i752,
  'hft': i753,
  'hifi': i754,
  'high': i755,
  'hive': i756,
  'hmq': i757,
  'hmt': i758,
  'hns': i759,
  'hnt': i760,
  'hobbes': i761,
  'hod': i762,
  'hoge': i763,
  'hook': i764,
  'hop': i765,
  'hord': i766,
  'hot-x': i767,
  'hot': i768,
  'hotcross': i769,
  'hpb': i770,
  'hpo': i771,
  'hpp': i772,
  'hsr': i773,
  'ht': i774,
  'html': i775,
  'htr': i776,
  'hum': i777,
  'hunt': i778,
  'husd': i779,
  'hush': i780,
  'hvn': i781,
  'hxro': i782,
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
  'kcs': i859,
  'kda': i860,
  'kdon': i861,
  'keep': i862,
  'key': i863,
  'keycat': i864,
  'kick': i865,
  'kilt': i866,
  'kin': i867,
  'kint': i868,
  'kira': i869,
  'kiro': i870,
  'klay': i871,
  'klv': i872,
  'kma': i873,
  'kmd': i874,
  'knc': i875,
  'kndc': i876,
  'kok': i877,
  'kol': i878,
  'kono': i879,
  'kore': i880,
  'kp3r': i881,
  'krb': i882,
  'krl': i883,
  'krw': i884,
  'ksm': i885,
  'ksp': i886,
  'ktn': i887,
  'kub': i888,
  'kyl': i889,
  'la': i890,
  'lab': i891,
  'lace': i892,
  'ladys': i893,
  'lamb': i894,
  'land': i895,
  'layer': i896,
  'lazio': i897,
  'lba': i898,
  'lbc': i899,
  'lcc': i900,
  'lcdot': i901,
  'lcx': i902,
  'ldo': i903,
  'lend': i904,
  'leo': i905,
  'lever': i906,
  'lien': i907,
  'like': i908,
  'lina': i909,
  'link': i910,
  'lit': i911,
  'lith': i912,
  'lkk': i913,
  'lky': i914,
  'lmc': i915,
  'ln': i916,
  'lnchx': i917,
  'loc': i918,
  'locg': i919,
  'lode': i920,
  'loka': i921,
  'loki': i922,
  'lon': i923,
  'looks': i924,
  'loom': i925,
  'love': i926,
  'lpf': i927,
  'lpool': i928,
  'lpt': i929,
  'lqd': i930,
  'lqty': i931,
  'lrc': i932,
  'lrg': i933,
  'lsk': i934,
  'lss': i935,
  'ltc': i936,
  'lto': i937,
  'ltx': i938,
  'luca': i939,
  'lun': i940,
  'luna': i941,
  'lunc': i942,
  'lusd': i943,
  'lxt': i944,
  'lym': i945,
  'lyxe': i946,
  'maapl': i947,
  'maga': i948,
  'magic': i949,
  'maha': i950,
  'mai': i951,
  'maid': i952,
  'maki': i953,
  'man': i954,
  'mana': i955,
  'manta': i956,
  'map': i957,
  'maps': i958,
  'marsh': i959,
  'mask': i960,
  'mass': i961,
  'math': i962,
  'matic': i963,
  'maticx': i964,
  'matter': i965,
  'mb': i966,
  'mbc': i967,
  'mbl': i968,
  'mbox': i969,
  'mc': i970,
  'mcb': i971,
  'mco': i972,
  'mco2': i973,
  'mcx': i974,
  'mda': i975,
  'mdao': i976,
  'mds': i977,
  'mdt': i978,
  'mdx': i979,
  'med': i980,
  'medx': i981,
  'meetone': i982,
  'mem': i983,
  'meme': i984,
  'mer': i985,
  'met': i986,
  'meta': i987,
  'metano': i988,
  'metis': i989,
  'mew': i990,
  'mex': i991,
  'mfg': i992,
  'mft': i993,
  'mhc': i994,
  'mim': i995,
  'mimatic': i996,
  'mina': i997,
  'miota': i998,
  'mir': i999,
  'mith': i1000,
  'mitx': i1001,
  'mjt': i1002,
  'mkr': i1003,
  'mlb': i1004,
  'mlk': i1005,
  'mln': i1006,
  'mmt': i1007,
  'mmxn': i1008,
  'mnde': i1009,
  'mnet': i1010,
  'mngo': i1011,
  'mns': i1012,
  'mnst': i1013,
  'mnt': i1014,
  'mntl': i1015,
  'mnw': i1016,
  'moac': i1017,
  'mob': i1018,
  'mochi': i1019,
  'mod': i1020,
  'modefi': i1021,
  'mof': i1022,
  'mog': i1023,
  'mom': i1024,
  'mona': i1025,
  'moni': i1026,
  'moon': i1027,
  'mot': i1028,
  'movez': i1029,
  'movr': i1030,
  'mph': i1031,
  'mpl': i1032,
  'msol': i1033,
  'msr': i1034,
  'mswap': i1035,
  'mta': i1036,
  'mtc': i1037,
  'mth': i1038,
  'mtl': i1039,
  'mtn': i1040,
  'mtrg': i1041,
  'mts': i1042,
  'mtv': i1043,
  'mue': i1044,
  'multi': i1045,
  'musd': i1046,
  'music': i1047,
  'mvc': i1048,
  'mvl': i1049,
  'mvp': i1050,
  'mwat': i1051,
  'mwc': i1052,
  'mx': i1053,
  'mxc': i1054,
  'mxm': i1055,
  'mxw': i1056,
  'myb': i1057,
  'myro': i1058,
  'myst': i1059,
  'naka': i1060,
  'nano': i1061,
  'nas': i1062,
  'nav': i1063,
  'nbs': i1064,
  'nbt': i1065,
  'ncash': i1066,
  'nct': i1067,
  'ndau': i1068,
  'near': i1069,
  'nebl': i1070,
  'nec': i1071,
  'nem': i1072,
  'neo': i1073,
  'neon': i1074,
  'neos': i1075,
  'neox': i1076,
  'nest': i1077,
  'neu': i1078,
  'new': i1079,
  'nex': i1080,
  'nexo': i1081,
  'nexxo': i1082,
  'nft': i1083,
  'nftb': i1084,
  'nftx': i1085,
  'ngc': i1086,
  'ngm': i1087,
  'nif': i1088,
  'nim': i1089,
  'niox': i1090,
  'nix': i1091,
  'nkn': i1092,
  'nlc2': i1093,
  'nlg': i1094,
  'nmc': i1095,
  'nmr': i1096,
  'noia': i1097,
  'nord': i1098,
  'normie': i1099,
  'normilio': i1100,
  'nox': i1101,
  'nper': i1102,
  'npxs': i1103,
  'nrg': i1104,
  'nrv': i1105,
  'nrve': i1106,
  'ntic': i1107,
  'ntrn': i1108,
  'ntvrk': i1109,
  'nu': i1110,
  'nuls': i1111,
  'num': i1112,
  'nusd': i1113,
  'nwc': i1114,
  'nxm': i1115,
  'nxs': i1116,
  'nxt': i1117,
  'nye': i1118,
  'nym': i1119,
  'oag': i1120,
  'oak': i1121,
  'oax': i1122,
  'ocean': i1123,
  'ocn': i1124,
  'oddz': i1125,
  'ode': i1126,
  'og': i1127,
  'ogn': i1128,
  'ogo': i1129,
  'ohm': i1130,
  'oil': i1131,
  'ok': i1132,
  'okb': i1133,
  'oks': i1134,
  'olt': i1135,
  'om': i1136,
  'omg': i1137,
  'omni': i1138,
  'ondo': i1139,
  'one': i1140,
  'ong': i1141,
  'onion': i1142,
  'onston': i1143,
  'ont': i1144,
  'ooe': i1145,
  'ooki': i1146,
  'oot': i1147,
  'op': i1148,
  'open': i1149,
  'opium': i1150,
  'opq': i1151,
  'ops': i1152,
  'opsec': i1153,
  'opul': i1154,
  'opx': i1155,
  'orai': i1156,
  'orbs': i1157,
  'orc': i1158,
  'orca': i1159,
  'orcat': i1160,
  'ordi': i1161,
  'orn': i1162,
  'osmo': i1163,
  'ost': i1164,
  'ouro': i1165,
  'ousd': i1166,
  'ovc': i1167,
  'oxen': i1168,
  'oxt': i1169,
  'oxy': i1170,
  'pac': i1171,
  'pai': i1172,
  'paint': i1173,
  'pal': i1174,
  'palm': i1175,
  'paper': i1176,
  'par': i1177,
  'part': i1178,
  'pasc': i1179,
  'pax': i1180,
  'paxg': i1181,
  'pay': i1182,
  'payx': i1183,
  'pazzi': i1184,
  'pbirb': i1185,
  'pbr': i1186,
  'pbtc': i1187,
  'pbx': i1188,
  'pchu': i1189,
  'pcx': i1190,
  'pdex': i1191,
  'pearl': i1192,
  'peas': i1193,
  'pel': i1194,
  'pendle': i1195,
  'pepe': i1196,
  'perl': i1197,
  'perp': i1198,
  'pha': i1199,
  'phb': i1200,
  'phnx': i1201,
  'phtk': i1202,
  'phx': i1203,
  'pickle': i1204,
  'pink': i1205,
  'pip': i1206,
  'pirl': i1207,
  'pivx': i1208,
  'pkb': i1209,
  'pla': i1210,
  'play': i1211,
  'plbt': i1212,
  'plc': i1213,
  'pldai': i1214,
  'plgr': i1215,
  'plr': i1216,
  'plt': i1217,
  'pltc': i1218,
  'plu': i1219,
  'plusdc': i1220,
  'pma': i1221,
  'pmgt': i1222,
  'pmon': i1223,
  'png': i1224,
  'pnk': i1225,
  'pnt': i1226,
  'poa': i1227,
  'poe': i1228,
  'pokt': i1229,
  'pol': i1230,
  'polc': i1231,
  'polis': i1232,
  'polk': i1233,
  'pols': i1234,
  'polx': i1235,
  'poly-2': i1236,
  'poly': i1237,
  'polyx': i1238,
  'pom': i1239,
  'pond': i1240,
  'ponke': i1241,
  'pont': i1242,
  'pool': i1243,
  'pop': i1244,
  'popcat': i1245,
  'pork': i1246,
  'porto': i1247,
  'pot': i1248,
  'potnoy': i1249,
  'power': i1250,
  'powr': i1251,
  'ppay': i1252,
  'ppc': i1253,
  'ppp': i1254,
  'ppt': i1255,
  'pre': i1256,
  'premia': i1257,
  'prime': i1258,
  'prl': i1259,
  'pro': i1260,
  'prom': i1261,
  'props': i1262,
  'pros': i1263,
  'prq': i1264,
  'psg': i1265,
  'psp': i1266,
  'pst': i1267,
  'pstake': i1268,
  'ptc': i1269,
  'ptoy': i1270,
  'pundix': i1271,
  'pups': i1272,
  'pyr': i1273,
  'pyth': i1274,
  'pyusd': i1275,
  'qash': i1276,
  'qbit': i1277,
  'qi': i1278,
  'qkc': i1279,
  'qlc': i1280,
  'qnt': i1281,
  'qqq': i1282,
  'qrdo': i1283,
  'qrl': i1284,
  'qsp': i1285,
  'qtum': i1286,
  'quick': i1287,
  'qun': i1288,
  'qwark': i1289,
  'r': i1290,
  'raca': i1291,
  'rad': i1292,
  'radar': i1293,
  'rads': i1294,
  'rae': i1295,
  'rai': i1296,
  'ramp': i1297,
  'ranker': i1298,
  'rare': i1299,
  'rari': i1300,
  'ray': i1301,
  'rbc': i1302,
  'rbn': i1303,
  'rbtc': i1304,
  'rby': i1305,
  'rcn': i1306,
  'rdd': i1307,
  'rdn': i1308,
  'rdnt': i1309,
  'reap': i1310,
  'reef': i1311,
  'rei': i1312,
  'ren': i1313,
  'renbtc': i1314,
  'render': i1315,
  'renfil': i1316,
  'rep': i1317,
  'req': i1318,
  'reth': i1319,
  'rev': i1320,
  'revo': i1321,
  'revu': i1322,
  'revv': i1323,
  'rfox': i1324,
  'rfr': i1325,
  'rfuel': i1326,
  'rfwsteth': i1327,
  'rgt': i1328,
  'rhoc': i1329,
  'rif': i1330,
  'rise': i1331,
  'rlc': i1332,
  'rly': i1333,
  'rmark': i1334,
  'rndr': i1335,
  'road': i1336,
  'roar': i1337,
  'ron': i1338,
  'roobee': i1339,
  'rook': i1340,
  'rose': i1341,
  'rosn': i1342,
  'route': i1343,
  'rpl': i1344,
  'rpx': i1345,
  'rsr': i1346,
  'rsv': i1347,
  'ruff': i1348,
  'rune': i1349,
  'rvn': i1350,
  'rvr': i1351,
  'ryo': i1352,
  's': i1353,
  'safemoon': i1354,
  'sai': i1355,
  'saito': i1356,
  'salt': i1357,
  'samo': i1358,
  'san': i1359,
  'sand': i1360,
  'santos': i1361,
  'sapp': i1362,
  'sar': i1363,
  'savax': i1364,
  'sbd': i1365,
  'sbr': i1366,
  'sbtc': i1367,
  'sc': i1368,
  'sclp': i1369,
  'scrl': i1370,
  'scrt': i1371,
  'sd': i1372,
  'sdao': i1373,
  'sdl': i1374,
  'sdn': i1375,
  'sdt': i1376,
  'seele': i1377,
  'sefi': i1378,
  'sei': i1379,
  'sem': i1380,
  'senso': i1381,
  'seq': i1382,
  'sero': i1383,
  'seth': i1384,
  'seth2': i1385,
  'sfi': i1386,
  'sfm': i1387,
  'sfp-2': i1388,
  'sfp': i1389,
  'sfrxeth': i1390,
  'sfund': i1391,
  'sgb': i1392,
  'sha': i1393,
  'shdw': i1394,
  'shft': i1395,
  'shib': i1396,
  'shift': i1397,
  'shill': i1398,
  'ship': i1399,
  'shping': i1400,
  'shr': i1401,
  'shroom': i1402,
  'shx': i1403,
  'si': i1404,
  'sia': i1405,
  'sib': i1406,
  'silo': i1407,
  'skey': i1408,
  'skl': i1409,
  'sku': i1410,
  'sky': i1411,
  'sld': i1412,
  'slerf': i1413,
  'slim': i1414,
  'slink': i1415,
  'slp': i1416,
  'slr': i1417,
  'sls': i1418,
  'slt': i1419,
  'smart': i1420,
  'smog': i1421,
  'smurfcat': i1422,
  'snail': i1423,
  'snc': i1424,
  'sngls': i1425,
  'snm': i1426,
  'snow': i1427,
  'snt': i1428,
  'sntv': i1429,
  'snx': i1430,
  'sny': i1431,
  'soc': i1432,
  'sol': i1433,
  'solama': i1434,
  'solid': i1435,
  'solo': i1436,
  'solr': i1437,
  'solve': i1438,
  'sos': i1439,
  'soul': i1440,
  'sov': i1441,
  'spank': i1442,
  'sparta': i1443,
  'spell': i1444,
  'sphr': i1445,
  'sphtx': i1446,
  'spi': i1447,
  'spike': i1448,
  'spk': i1449,
  'spn': i1450,
  'spnd': i1451,
  'spr': i1452,
  'srm': i1453,
  'srn': i1454,
  'ssv': i1455,
  'stak': i1456,
  'stake': i1457,
  'stan': i1458,
  'starly': i1459,
  'start': i1460,
  'stc': i1461,
  'steem': i1462,
  'step': i1463,
  'steth-1': i1464,
  'steth': i1465,
  'stg': i1466,
  'stkaave': i1467,
  'stklyra': i1468,
  'stmatic': i1469,
  'stmx': i1470,
  'stnd': i1471,
  'storj': i1472,
  'storm': i1473,
  'stpt': i1474,
  'stq': i1475,
  'strat': i1476,
  'strax': i1477,
  'strk': i1478,
  'strong': i1479,
  'stx': i1480,
  'stz': i1481,
  'sub': i1482,
  'sui': i1483,
  'suku': i1484,
  'sumo': i1485,
  'sun': i1486,
  'super': i1487,
  'suqa': i1488,
  'sure': i1489,
  'surv': i1490,
  'susd': i1491,
  'sushi': i1492,
  'suter': i1493,
  'swap': i1494,
  'swash': i1495,
  'sweat': i1496,
  'swingby': i1497,
  'swp': i1498,
  'swrv': i1499,
  'swt': i1500,
  'swth': i1501,
  'sxdt': i1502,
  'sxp': i1503,
  'sylo': i1504,
  'syn': i1505,
  'synth': i1506,
  'synx': i1507,
  'sys': i1508,
  't': i1509,
  'taas': i1510,
  'tara': i1511,
  'tau': i1512,
  'tbtc': i1513,
  'tbx': i1514,
  'tch': i1515,
  'tcp': i1516,
  'tct': i1517,
  'tel': i1518,
  'ten': i1519,
  'tera': i1520,
  'tern': i1521,
  'tfl': i1522,
  'tfuel': i1523,
  'thales': i1524,
  'thc': i1525,
  'thedao': i1526,
  'theta': i1527,
  'thr': i1528,
  'tia': i1529,
  'tidal': i1530,
  'time': i1531,
  'tio': i1532,
  'titan': i1533,
  'tix': i1534,
  'tkn': i1535,
  'tko': i1536,
  'tks': i1537,
  'tky': i1538,
  'tlm': i1539,
  'tlos': i1540,
  'tnb': i1541,
  'tnc': i1542,
  'tnd': i1543,
  'tnt': i1544,
  'toby': i1545,
  'toke': i1546,
  'toko': i1547,
  'tomb': i1548,
  'tomi': i1549,
  'tomo': i1550,
  'ton': i1551,
  'tonic': i1552,
  'tor': i1553,
  'torn': i1554,
  'toshi': i1555,
  'tower': i1556,
  'tox': i1557,
  'tpay': i1558,
  'tra': i1559,
  'trac': i1560,
  'trade': i1561,
  'trb': i1562,
  'tremp': i1563,
  'trias': i1564,
  'tribe': i1565,
  'trig': i1566,
  'troy': i1567,
  'trst': i1568,
  'trtl': i1569,
  'tru': i1570,
  'trump': i1571,
  'trvl': i1572,
  'trx': i1573,
  'try': i1574,
  'tryb': i1575,
  'tt': i1576,
  'ttc': i1577,
  'ttt': i1578,
  'tube': i1579,
  'tur': i1580,
  'tusd': i1581,
  'tvk': i1582,
  'twt': i1583,
  'txa': i1584,
  'tybg': i1585,
  'tyzen': i1586,
  'tzc': i1587,
  'ubi': i1588,
  'ubq': i1589,
  'ubsn': i1590,
  'ubt': i1591,
  'ubx': i1592,
  'ubxt': i1593,
  'udoo': i1594,
  'ufo': i1595,
  'uft': i1596,
  'ukg': i1597,
  'ult': i1598,
  'uma': i1599,
  'umb': i1600,
  'umee': i1601,
  'unb': i1602,
  'uncx': i1603,
  'unfi': i1604,
  'uni': i1605,
  'unic': i1606,
  'unidaieth': i1607,
  'unilendeth': i1608,
  'unilinketh': i1609,
  'unimkreth': i1610,
  'uniqo': i1611,
  'unisetheth': i1612,
  'uniusdceth': i1613,
  'unn': i1614,
  'uno': i1615,
  'uos': i1616,
  'up': i1617,
  'upi': i1618,
  'upp': i1619,
  'uqc': i1620,
  'usd+': i1621,
  'usd': i1622,
  'usdc': i1623,
  'usdce': i1624,
  'usdd': i1625,
  'usdj': i1626,
  'usdn': i1627,
  'usdp': i1628,
  'usds': i1629,
  'usdt': i1630,
  'ust': i1631,
  'ustc': i1632,
  'usx': i1633,
  'ut': i1634,
  'utk': i1635,
  'uuu': i1636,
  'vader': i1637,
  'vai': i1638,
  'value': i1639,
  'vee': i1640,
  'veed': i1641,
  'vega': i1642,
  'veil': i1643,
  'vekwenta': i1644,
  'vela': i1645,
  'velo': i1646,
  'vemp': i1647,
  'ven': i1648,
  'veri': i1649,
  'vest': i1650,
  'vet': i1651,
  'vgx': i1652,
  'via': i1653,
  'vib': i1654,
  'vibe': i1655,
  'vid': i1656,
  'vidt': i1657,
  'vikky': i1658,
  'vin': i1659,
  'vina': i1660,
  'vita': i1661,
  'vite': i1662,
  'viu': i1663,
  'vix': i1664,
  'vlx': i1665,
  'vnx': i1666,
  'vol': i1667,
  'voxel': i1668,
  'vr': i1669,
  'vra': i1670,
  'vrc': i1671,
  'vrm': i1672,
  'vrs': i1673,
  'vrsc': i1674,
  'vrt': i1675,
  'vsp': i1676,
  'vsys': i1677,
  'vtc': i1678,
  'vtho': i1679,
  'vtr': i1680,
  'vvs': i1681,
  'vxv': i1682,
  'wabi': i1683,
  'wan': i1684,
  'warp': i1685,
  'wassie': i1686,
  'wavax': i1687,
  'waves': i1688,
  'wax': i1689,
  'waxp': i1690,
  'wbnb': i1691,
  'wbtc': i1692,
  'wct': i1693,
  'web': i1694,
  'wemix': i1695,
  'wen': i1696,
  'west': i1697,
  'weth': i1698,
  'wexpoly': i1699,
  'wftm': i1700,
  'wgr': i1701,
  'wgro': i1702,
  'whale': i1703,
  'whoren': i1704,
  'wib': i1705,
  'wicc': i1706,
  'wif-1': i1707,
  'wild': i1708,
  'win': i1709,
  'wing': i1710,
  'wings': i1711,
  'wis': i1712,
  'wld': i1713,
  'wmatic': i1714,
  'wmp': i1715,
  'wmt': i1716,
  'wndr': i1717,
  'wnxm': i1718,
  'wom': i1719,
  'wone': i1720,
  'woo': i1721,
  'wopenx': i1722,
  'wowow': i1723,
  'wozx': i1724,
  'wpr': i1725,
  'wrx': i1726,
  'wsienna': i1727,
  'wsteth': i1728,
  'wtbt': i1729,
  'wtc': i1730,
  'wxt': i1731,
  'x2y2': i1732,
  'xai': i1733,
  'xas': i1734,
  'xaut': i1735,
  'xava': i1736,
  'xbc': i1737,
  'xby': i1738,
  'xcad': i1739,
  'xch': i1740,
  'xchf': i1741,
  'xcm': i1742,
  'xcn': i1743,
  'xcp': i1744,
  'xcur': i1745,
  'xdata': i1746,
  'xdb': i1747,
  'xdc': i1748,
  'xdfi': i1749,
  'xdn': i1750,
  'xec': i1751,
  'xed': i1752,
  'xel': i1753,
  'xem': i1754,
  'xft': i1755,
  'xhv': i1756,
  'xido': i1757,
  'xin': i1758,
  'xlm': i1759,
  'xln': i1760,
  'xlq': i1761,
  'xmark': i1762,
  'xmg': i1763,
  'xmr': i1764,
  'xmt': i1765,
  'xmx': i1766,
  'xmy': i1767,
  'xnc': i1768,
  'xnk': i1769,
  'xnl': i1770,
  'xno': i1771,
  'xns': i1772,
  'xor': i1773,
  'xp': i1774,
  'xpa': i1775,
  'xpm': i1776,
  'xpr': i1777,
  'xprt': i1778,
  'xrd': i1779,
  'xrp': i1780,
  'xrt': i1781,
  'xsg': i1782,
  'xsn': i1783,
  'xsr': i1784,
  'xst': i1785,
  'xsushi': i1786,
  'xt': i1787,
  'xtag': i1788,
  'xtm': i1789,
  'xtp': i1790,
  'xtz': i1791,
  'xuc': i1792,
  'xvc': i1793,
  'xvg': i1794,
  'xvs': i1795,
  'xwc': i1796,
  'xym': i1797,
  'xyo': i1798,
  'xyz': i1799,
  'xzc': i1800,
  'yfdai': i1801,
  'yfi': i1802,
  'yfii': i1803,
  'ygg': i1804,
  'yld': i1805,
  'yop': i1806,
  'youc': i1807,
  'yoyo': i1808,
  'yoyow': i1809,
  'zai': i1810,
  'zar': i1811,
  'zb': i1812,
  'zcl': i1813,
  'zco': i1814,
  'zcx': i1815,
  'zec': i1816,
  'zee': i1817,
  'zel': i1818,
  'zen': i1819,
  'zeon': i1820,
  'zeta': i1821,
  'zil': i1822,
  'zip': i1823,
  'zks': i1824,
  'zkt': i1825,
  'zlw': i1826,
  'znn': i1827,
  'zort': i1828,
  'zpay': i1829,
  'zrx': i1830,
  'zusd': i1831,
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
