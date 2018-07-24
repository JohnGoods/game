// TypeScript file


function fontSetInit(){
    var fs_ins = IGlobal.fontSet;

	var defalutFontName = IGlobal.guiManager.getDefaultFontName();

    fs_ins.insertFont("ht_13_cc", defalutFontName, 13, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_13_rc_stroke", defalutFontName, 13, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 

    // fs_ins.insertFont("ht_14_cc", defalutFontName, 14, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	// fs_ins.insertFont("ht_14_lc", defalutFontName, 14, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	// fs_ins.insertFont("ht_14_rc", defalutFontName, 14, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_16_cc", defalutFontName, 16, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_16_lc", defalutFontName, 16, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_16_rc", defalutFontName, 16, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_16_cc_stroke", defalutFontName, 16, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_16_lc_stroke", defalutFontName, 16, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_16_rc_stroke", defalutFontName, 16, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_16_cc_stroke_zongse", defalutFontName, 16, gui.Color.ublack, gui.Color.zongse02, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_16_lc_stroke_zongse", defalutFontName, 16, gui.Color.ublack, gui.Color.zongse02, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_16_rc_stroke_zongse", defalutFontName, 16, gui.Color.ublack, gui.Color.zongse02, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_16_cc_stroke_fuchsia", defalutFontName, 16, gui.Color.ublack, gui.Color.fuchsia, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_16_cc_stroke_saddlebrown", defalutFontName, 16, gui.Color.ublack, gui.Color.saddlebrown, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	
	fs_ins.insertFont("ht_18_cc", defalutFontName, 18, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_18_lc", defalutFontName, 18, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_18_rc", defalutFontName, 18, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_18_cc_stroke", defalutFontName, 18, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_18_lc_stroke", defalutFontName, 18, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_18_rc_stroke", defalutFontName, 18, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_18_cc_stroke_zongse", defalutFontName, 18, gui.Color.ublack, gui.Color.zongse02, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_18_lc_stroke_zongse", defalutFontName, 18, gui.Color.ublack, gui.Color.zongse02, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	fs_ins.insertFont("ht_18_rc_stroke_zongse", defalutFontName, 18, gui.Color.ublack, gui.Color.zongse02, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 1, 0) 
	
	fs_ins.insertFont("ht_20_cc", defalutFontName, 20, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_20_lc", defalutFontName, 20, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_20_rc", defalutFontName, 20, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_20_cc_stroke", defalutFontName, 20, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_20_lc_stroke", defalutFontName, 20, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_20_rc_stroke", defalutFontName, 20, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_20_cc_stroke_zongse", defalutFontName, 20, gui.Color.ublack, gui.Color.zongse02, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_20_lc_stroke_zongse", defalutFontName, 20, gui.Color.ublack, gui.Color.zongse02, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_20_rc_stroke_zongse", defalutFontName, 20, gui.Color.ublack, gui.Color.zongse02, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_20_cc_stroke_saddlebrown", defalutFontName, 20, gui.Color.ublack, gui.Color.saddlebrown, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	
	fs_ins.insertFont("ht_22_cc", defalutFontName, 22, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_22_lc", defalutFontName, 22, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_22_rc", defalutFontName, 22, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_22_cc_stroke", defalutFontName, 22, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_22_lc_stroke", defalutFontName, 22, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_22_rc_stroke", defalutFontName, 22, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_22_cc_stroke_zongse", defalutFontName, 22, gui.Color.ublack, gui.Color.zongse02, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_22_lc_stroke_zongse", defalutFontName, 22, gui.Color.ublack, gui.Color.zongse02, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_22_rc_stroke_zongse", defalutFontName, 22, gui.Color.ublack, gui.Color.zongse02, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_22_cc_stroke_saddlebrown", defalutFontName, 22, gui.Color.ublack, gui.Color.saddlebrown, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	
	fs_ins.insertFont("ht_24_cc", defalutFontName, 24, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_24_lc", defalutFontName, 24, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_24_rc", defalutFontName, 24, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_24_cc_stroke", defalutFontName, 24, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_24_lc_stroke", defalutFontName, 24, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_24_rc_stroke", defalutFontName, 24, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_24_cc_stroke_zongse", defalutFontName, 24, gui.Color.ublack, gui.Color.zongse02, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_24_lc_stroke_zongse", defalutFontName, 24, gui.Color.ublack, gui.Color.zongse02, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_24_rc_stroke_zongse", defalutFontName, 24, gui.Color.ublack, gui.Color.zongse02, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_24_cc_stroke_saddlebrown", defalutFontName, 24, gui.Color.ublack, gui.Color.saddlebrown, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 


	fs_ins.insertFont("ht_26_cc", defalutFontName, 26, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_26_lc", defalutFontName, 26, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_26_rc", defalutFontName, 26, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_26_cc_stroke", defalutFontName, 26, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_26_lc_stroke", defalutFontName, 26, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_26_rc_stroke", defalutFontName, 26, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	
	fs_ins.insertFont("ht_28_cc", defalutFontName, 28, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_28_lc", defalutFontName, 28, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_28_rc", defalutFontName, 28, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_28_cc_stroke", defalutFontName, 28, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_28_lc_stroke", defalutFontName, 28, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_28_rc_stroke", defalutFontName, 28, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_28_cc_stroke_zongse", defalutFontName, 28, gui.Color.ublack, gui.Color.zongse02, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_28_lc_stroke_zongse", defalutFontName, 28, gui.Color.ublack, gui.Color.zongse02, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_28_rc_stroke_zongse", defalutFontName, 28, gui.Color.ublack, gui.Color.zongse02, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_28_cc_stroke_saddlebrown", defalutFontName, 28, gui.Color.ublack, gui.Color.saddlebrown, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 1, 2, 0) 
	
	fs_ins.insertFont("ht_30_cc", defalutFontName, 30, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_30_lc", defalutFontName, 30, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_30_rc", defalutFontName, 30, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER, 0, 0, 0, 0) 
	fs_ins.insertFont("ht_30_cc_stroke", defalutFontName, 30, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_30_lc_stroke", defalutFontName, 30, gui.Color.ublack, gui.Color.ublack, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_30_rc_stroke", defalutFontName, 30, gui.Color.ublack, gui.Color.ublack, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_30_cc_stroke_zongse", defalutFontName, 30, gui.Color.ublack, gui.Color.zongse02, gui.Flag.CENTER_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_30_lc_stroke_zongse", defalutFontName, 30, gui.Color.ublack, gui.Color.zongse02, gui.Flag.LEFT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 
	fs_ins.insertFont("ht_30_rc_stroke_zongse", defalutFontName, 30, gui.Color.ublack, gui.Color.zongse02, gui.Flag.RIGHT_CENTER + gui.FontFlag.STROKE, -1, 0, 2, 0) 


	fs_ins.insertFont("ht_title_font", defalutFontName, 30, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER, 0, 0, 0, 0) 
	
	//fs_ins.insertFont("ht_20_cc_underline_stroke_ublack", defalutFontName, 20, gui.Color.ublack, gui.Color.ublack, gui.Flag.CENTER_CENTER + gui.IFont.UNDER_LINE+ gui.FontFlag.STROKE, 0, 0, 1, 0)
}