/**
 * CopperLicht 3D Engine, Copyright by Nikolaus Gebhardt, Ambiera e.U.
 * For license details, see www.ambiera.com/copperlicht
 * For the full source, see http://www.ambiera.com/copperlicht/license.html#commercial
 *
 * Note: This library can be further minificated to less then 100 KB from the full source,
 * but it isn't here to make debugging easier.
 */
var CL3D = {};

CL3D.DebugOutput = function (d, a) {
	this.DebugRoot = null;

	$("#console").append('<div class="console header" id="loading-header">'+ new Date().toLocaleTimeString()+'&nbsp;&gt;</div>');
	this.DebugRoot = document.getElementById( "console" );
	if (this.DebugRoot) {
		this.LoadingRoot = document.createElement( "div" );
		this.LoadingRoot.id = "loading-console"
		this.LoadingRoot.className = "console log-loading";
		this.DebugRoot.appendChild(this.LoadingRoot);
		var b = document.createTextNode("Loading...");
		this.LoadingRootText = b;
		this.LoadingRoot.appendChild(b)
	}
	if (a) {
		this.enableFPSCounter()
	}
};
CL3D.DebugOutput.prototype.print = function (a) {
	if (CL3D.gCCDebugInfoEnabled == false) {
		return
	}
	console.error(a);
};
CL3D.DebugOutput.prototype.setLoadingText = function (a) {
	if (!this.LoadingRoot)
		return;

	if (a == null){
		this.LoadingRootText.nodeValue = "loading is complete! =D ";
		$(this.LoadingRoot).animate(
			{opacity : 0},
			7000,
			function(){
				if (this.parentElement)
					this.parentElement.removeChild(this)
			}
		);
		$("#loading-header").animate({opacity: 0}, 6000, function(){if (this.parentElement) this.parentElement.removeChild(this)});
		delete this.LoadingRoot;
		clearInterval(CL3D.LoadingTimer);
		CL3D.LoadingTimer = null;

		//if everything is loaded and all [extern] agent programs are ready
		if (_Ready){
			$("#playFrame").show().removeClass("no-events");
			if (_SAVE_STATS)
				$("#playBtn").mouseup();
		}
		$("#playFrame").animate({opacity : 1}, 1000);
	}
	else 
		this.LoadingRootText.nodeValue = a;
};
CL3D.DebugOutput.prototype.printError = function (b, a) {
	console.error(b);
};

CL3D.gCCDebugInfoEnabled = true;
CL3D.gCCDebugOutput = null;
CL3D.CCFileLoader = function (a) {
	this.FileToLoad = a;
	this.xmlhttp = false;

	if (!this.xmlhttp && typeof XMLHttpRequest != "undefined") {
		try {
			this.xmlhttp = new XMLHttpRequest()
		} catch (b) {
			this.xmlhttp = false
		}
	}
	if (!this.xmlhttp && window.createRequest) {
		try {
			this.xmlhttp = window.createRequest()
		} catch (b) {
			this.xmlhttp = false
		}
	}
	this.load = function (c) {
		if (this.xmlhttp == false) {
			CL3D.gCCDebugOutput.printError("Your browser doesn't support AJAX");
			return
		}
		var d = this;
		try {
			this.xmlhttp.open("GET", this.FileToLoad, true);
			if (this.FileToLoad.indexOf(".ccbjs"))
				this.xmlhttp.responseType = "arraybuffer";
		} catch (f) {
			CL3D.gCCDebugOutput.printError("Could not open file " + this.FileToLoad + ": " + f.message);
			return
		}
		/*this.xmlhttp.onreadystatechange = function () {
			if (d.xmlhttp.readyState == 4) {
				if (d.xmlhttp.status != 200 && d.xmlhttp.status != 0 && d.xmlhttp.status != null) {
					CL3D.gCCDebugOutput.printError("Could not open file " + d.FileToLoad + " (status:" + d.xmlhttp.status + ")")
				}
				c(d.xmlhttp.responseText)
			}
		};*/
		this.xmlhttp.onerror = function(evt){
			$("#loading-console").remove();
			$("#loading-header").remove();
			c([]);
		}
		this.xmlhttp.onload = function(){
			if (d.FileToLoad.indexOf(".ccbjs")){
				var arrayBuffer = new Uint8Array(d.xmlhttp.response)
				var response = new Array(arrayBuffer.length);

				if (arrayBuffer){
					for (var length = arrayBuffer.length, i= 0; i < length; ++i)
						response[i] = String.fromCharCode(arrayBuffer[i]);
					c(response.join(""));
				}else
					c([]);
			}else
				c(d.xmlhttp.responseText);
		}
		try {
			this.xmlhttp.send(null)
		} catch (f) {}
	};
	this.loadComplete = function (c) {
		alert("loaded :" + c)
	}
};
CL3D.PI = 3.14159265359;
CL3D.RECIPROCAL_PI = 1 / 3.14159265359;
CL3D.HALF_PI = 3.14159265359 / 2;
CL3D.PI64 = 3.141592653589793;
CL3D.DEGTORAD = 3.14159265359 / 180;
CL3D.RADTODEG = 180 / 3.14159265359;
CL3D.TOLERANCE = 1e-8;
CL3D.radToDeg = function (a) {
	return a * CL3D.RADTODEG
};
CL3D.degToRad = function (a) {
	return a * CL3D.DEGTORAD
};
CL3D.iszero = function (b) {
	return (b < 1e-8) && (b > -1e-8)
};
CL3D.isone = function (b) {
	return (b + 1e-8 >= 1) && (b - 1e-8 <= 1)
};
CL3D.equals = function (d, c) {
	return (d + 1e-8 >= c) && (d - 1e-8 <= c)
};
CL3D.clamp = function (c, a, b) {
	if (c < a) {
		return a
	}
	if (c > b) {
		return b
	}
	return c
};
CL3D.fract = function (a) {
	return a - Math.floor(a)
};
CL3D.max3 = function (e, d, f) {
	if (e > d) {
		if (e > f) {
			return e
		}
		return f
	}
	if (d > f) {
		return d
	}
	return f
};
CL3D.min3 = function (e, d, f) {
	if (e < d) {
		if (e < f) {
			return e
		}
		return f
	}
	if (d < f) {
		return d
	}
	return f
};
CL3D.getAlpha = function (a) {
	return ((a & 4278190080) >>> 24)
};
CL3D.getRed = function (a) {
	return ((a & 16711680) >> 16)
};
CL3D.getGreen = function (a) {
	return ((a & 65280) >> 8)
};
CL3D.getBlue = function (a) {
	return ((a & 255))
};
CL3D.createColor = function (d, f, e, c) {
	d = d & 255;
	f = f & 255;
	e = e & 255;
	c = c & 255;
	return (d << 24) | (f << 16) | (e << 8) | c
};

//Class ColorF
CL3D.ColorF = function () {
	this.A = 1;
	this.R = 1;
	this.G = 1;
	this.B = 1;
};
CL3D.ColorF.prototype.clone = function () { //clone functions shouldn't be used, they usually cause garbage collection
	var a = new CL3D.Light();
	a.A = this.A;
	a.R = this.R;
	a.G = this.G;
	a.B = this.B;
	return a
};
CL3D.ColorF.prototype.A = 1;
CL3D.ColorF.prototype.R = 1;
CL3D.ColorF.prototype.G = 1;
CL3D.ColorF.prototype.B = 1;
CL3D.CLTimer = function () {};
var _TIME = 0;
var timeElapsed;
var _oldTimeStamp = Date.now();
CL3D.CLTimer.getTime = function () {
	return _TIME;
};

//Class Vect3d
CL3D.Vect3d = function (a, c, b) {
	if (a != null) {
		this.X = a;
		this.Y = c;
		this.Z = b
	}
};
CL3D.Vect3d.prototype.X = 0;
CL3D.Vect3d.prototype.Y = 0;
CL3D.Vect3d.prototype.Z = 0;
CL3D.Vect3d.prototype.set = function (a, c, b) {
	this.X = a;
	this.Y = c;
	this.Z = b;

	return this;
};
/*CL3D.Vect3d.prototype.clone = function () { // this method shouldn't be used
	return new CL3D.Vect3d(this.X, this.Y, this.Z)
};*/
CL3D.Vect3d.prototype.copyTo = function (a) {
	a.X = this.X;
	a.Y = this.Y;
	a.Z = this.Z
};
CL3D.Vect3d.prototype.substractFromThis = function (a) {
	this.X -= a.X;
	this.Y -= a.Y;
	this.Z -= a.Z

	return this;
};
CL3D.Vect3d.prototype.addToThis = function (a) {
	this.X += a.X;
	this.Y += a.Y;
	this.Z += a.Z

	return this;
};
CL3D.Vect3d.prototype.normalize = function () {
	var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
	if (a > -1e-7 && a < 1e-7) {
		return
	}
	a = 1 / Math.sqrt(a);
	this.X *= a;
	this.Y *= a;
	this.Z *= a
};
CL3D.Vect3d.prototype.getNormalized = function () {
	var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
	if (a > -1e-7 && a < 1e-7) {
		return new CL3D.Vect3d(0, 0, 0)
	}
	a = 1 / Math.sqrt(a);
	return new CL3D.Vect3d(this.X * a, this.Y * a, this.Z * a)
};
CL3D.Vect3d.prototype.setLength = function (b) {
	var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z;
	if (a > -1e-7 && a < 1e-7) {
		return
	}
	a = b / Math.sqrt(a);
	this.X *= a;
	this.Y *= a;
	this.Z *= a
};
CL3D.Vect3d.prototype.setTo = function (a) {
	this.X = a.X;
	this.Y = a.Y;
	this.Z = a.Z

	return this;
};
CL3D.Vect3d.prototype.equals = function (a) {
	return CL3D.equals(this.X, a.X) && CL3D.equals(this.Y, a.Y) && CL3D.equals(this.Z, a.Z)
};
CL3D.Vect3d.prototype.equalsZero = function () {
	return CL3D.iszero(this.X) && CL3D.iszero(this.Y) && CL3D.iszero(this.Z)
};
CL3D.Vect3d.prototype.equalsByNumbers = function (a, c, b) {
	return CL3D.equals(this.X, a) && CL3D.equals(this.Y, c) && CL3D.equals(this.Z, b)
};
CL3D.Vect3d.prototype.isZero = function () {
	return this.X == 0 && this.Y == 0 && this.Z == 0
};
CL3D.Vect3d.prototype.getLength = function () {
	return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z)
};
CL3D.Vect3d.prototype.getDistanceTo = function (b) {
	var a = b.X - this.X;
	var d = b.Y - this.Y;
	var c = b.Z - this.Z;
	return Math.sqrt(a * a + d * d + c * c)
};
CL3D.Vect3d.prototype.getDistanceFromSQ = function (b) {
	var a = b.X - this.X;
	var d = b.Y - this.Y;
	var c = b.Z - this.Z;
	return a * a + d * d + c * c
};
CL3D.Vect3d.prototype.getLengthSQ = function () {
	return this.X * this.X + this.Y * this.Y + this.Z * this.Z
};
CL3D.Vect3d.prototype.multiplyThisWithScal = function (a) {
	this.X *= a;
	this.Y *= a;
	this.Z *= a;

	return this;
};
CL3D.Vect3d.prototype.multiplyThisWithVect = function (a) {
	this.X *= a.X;
	this.Y *= a.Y;
	this.Z *= a.Z

	return this;
};
CL3D.Vect3d.prototype.multiplyWithVect = function (a) {
	return new CL3D.Vect3d(this.X * a.X, this.Y * a.Y, this.Z * a.Z)
};
CL3D.Vect3d.prototype.divideThisThroughVect = function (a) {
	this.X /= a.X;
	this.Y /= a.Y;
	this.Z /= a.Z

	return this;
};
CL3D.Vect3d.prototype.divideThroughVect = function (a) {
	return new CL3D.Vect3d(this.X / a.X, this.Y / a.Y, this.Z / a.Z)
};
CL3D.Vect3d.prototype.crossProductTo = function (a) {
	this.set(this.Y * a.Z - this.Z * a.Y, this.Z * a.X - this.X * a.Z, this.X * a.Y - this.Y * a.X);
	return this;
};
CL3D.Vect3d.prototype.dotProduct = function (a) {
	return this.X * a.X + this.Y * a.Y + this.Z * a.Z
};
CL3D.Vect3d.prototype.getHorizontalAngle = function () {
	var b = new CL3D.Vect3d();
	b.Y = CL3D.radToDeg(Math.atan2(this.X, this.Z));
	if (b.Y < 0) {
		b.Y += 360
	}
	if (b.Y >= 360) {
		b.Y -= 360
	}
	var a = Math.sqrt(this.X * this.X + this.Z * this.Z);
	b.X = CL3D.radToDeg(Math.atan2(a, this.Y)) - 90;
	if (b.X < 0) {
		b.X += 360
	}
	if (b.X >= 360) {
		b.X -= 360
	}
	return b
};
CL3D.Vect3d.prototype.toString = function () {
	return "(x: " + this.X + " y:" + this.Y + " z:" + this.Z + ")"
};

var _tempV0 = new CL3D.Vect3d();
var _tempV1 = new CL3D.Vect3d();
var _tempV2 = new CL3D.Vect3d();
var _tempV3 = new CL3D.Vect3d();
var _tempV4 = new CL3D.Vect3d();
var _tempV5 = new CL3D.Vect3d();

//Class Line3d
CL3D.Line3d = function () {
	this.Start = new CL3D.Vect3d();
	this.End = new CL3D.Vect3d()
};
CL3D.Line3d.prototype.Start = null;
CL3D.Line3d.prototype.End = null;
CL3D.Line3d.prototype.getVector = function () {
	if (!this.Vector)
		this.Vector = new CL3D.Vector3d();

	this.Vector.setTo(this.End);
	this.Vector.substractFromThis(this.Start);
	return this.Vector;
};
CL3D.Line3d.prototype.getLength = function () {
	return this.getVector().getLength()
};

//Class Vect2d
CL3D.Vect2d = function (a, b) {
	if (a == null) {
		this.X = 0;
		this.Y = 0
	} else {
		this.X = a;
		this.Y = b
	}
};
CL3D.Vect2d.prototype.X = 0;
CL3D.Vect2d.prototype.Y = 0;

var _temp2V0 = new CL3D.Vect2d();

//Class Box3d
CL3D.Box3d = function () {
	this.MinEdge = new CL3D.Vect3d();
	this.MaxEdge = new CL3D.Vect3d();
};
CL3D.Box3d.prototype.MinEdge = null;
CL3D.Box3d.prototype.MaxEdge = null;
CL3D.Box3d.prototype.setTo = function (b) {
	this.MinEdge.setTo(b.MinEdge);
	this.MaxEdge.setTo(b.MaxEdge);
	return this;
};
/*CL3D.Box3d.prototype.clone = function () {
	var a = new CL3D.Box3d();
	a.MinEdge.setTo(this.MinEdge);
	a.MaxEdge.setTo(this.MaxEdge);
	return a
};*/
CL3D.Box3d.prototype.getCenter = function () {
	if (!this.Center)
		this.Center = new CL3D.Vect3d();

	this.Center.setTo(this.MinEdge);
	this.Center.addToThis(this.MaxEdge);
	this.Center.multiplyThisWithScal(0.5);
	return this.Center;
};
CL3D.Box3d.prototype.getExtent = function () {
	return this.MaxEdge.substract(this.MinEdge)
};
CL3D.Box3d.prototype.getEdges = function () {
	var b = this.getCenter();
	_tempV0.setTo(b).substractFromThis(this.MaxEdge);

	if (!this.Edges){
		this.Edges = new Array(8);

		for (var i= 0; i < 8; ++i)
			this.Edges[i] = new CL3D.Vect3d();
	}

	this.Edges[0].set(b.X + _tempV0.X, b.Y + _tempV0.Y, b.Z + _tempV0.Z);
	this.Edges[1].set(b.X + _tempV0.X, b.Y - _tempV0.Y, b.Z + _tempV0.Z);
	this.Edges[2].set(b.X + _tempV0.X, b.Y + _tempV0.Y, b.Z - _tempV0.Z);
	this.Edges[3].set(b.X + _tempV0.X, b.Y - _tempV0.Y, b.Z - _tempV0.Z);
	this.Edges[4].set(b.X - _tempV0.X, b.Y + _tempV0.Y, b.Z + _tempV0.Z);
	this.Edges[5].set(b.X - _tempV0.X, b.Y - _tempV0.Y, b.Z + _tempV0.Z);
	this.Edges[6].set(b.X - _tempV0.X, b.Y + _tempV0.Y, b.Z - _tempV0.Z);
	this.Edges[7].set(b.X - _tempV0.X, b.Y - _tempV0.Y, b.Z - _tempV0.Z);

	return this.Edges;
};
CL3D.Box3d.prototype.addInternalPoint = function (a, c, b) {
	if (a > this.MaxEdge.X) {
		this.MaxEdge.X = a
	}
	if (c > this.MaxEdge.Y) {
		this.MaxEdge.Y = c
	}
	if (b > this.MaxEdge.Z) {
		this.MaxEdge.Z = b
	}
	if (a < this.MinEdge.X) {
		this.MinEdge.X = a
	}
	if (c < this.MinEdge.Y) {
		this.MinEdge.Y = c
	}
	if (b < this.MinEdge.Z) {
		this.MinEdge.Z = b
	}
};
CL3D.Box3d.prototype.addInternalPointByVector = function (a) {
	this.addInternalPoint(a.X, a.Y, a.Z)
};
CL3D.Box3d.prototype.intersectsWithBox = function (a) {
	return this.MinEdge.X <= a.MaxEdge.X && this.MinEdge.Y <= a.MaxEdge.Y && this.MinEdge.Z <= a.MaxEdge.Z && this.MaxEdge.X >= a.MinEdge.X && this.MaxEdge.Y >= a.MinEdge.Y && this.MaxEdge.Z >= a.MinEdge.Z
};
CL3D.Box3d.prototype.isPointInside = function (a) {
	return a.X >= this.MinEdge.X && a.X <= this.MaxEdge.X && a.Y >= this.MinEdge.Y && a.Y <= this.MaxEdge.Y && a.Z >= this.MinEdge.Z && a.Z <= this.MaxEdge.Z
};
CL3D.Box3d.prototype.reset = function (a, c, b) {
	this.MaxEdge.set(a, c, b);
	this.MinEdge.set(a, c, b)
};

var _tempB0 = new CL3D.Box3d();
var _tempB1 = new CL3D.Box3d();
var _tempB2 = new CL3D.Box3d();

//Class Triangle3d
CL3D.Triangle3d = function (e, d, f) {
	if (e) {
		this.pointA = e
	} else {
		this.pointA = new CL3D.Vect3d()
	} if (d) {
		this.pointB = d
	} else {
		this.pointB = new CL3D.Vect3d()
	} if (f) {
		this.pointC = f
	} else {
		this.pointC = new CL3D.Vect3d()
	}
};
CL3D.Triangle3d.prototype.pointA = null;
CL3D.Triangle3d.prototype.pointB = null;
CL3D.Triangle3d.prototype.pointC = null;
CL3D.Triangle3d.prototype.clone = function () {
	return new CL3D.Triangle3d(this.pointA, this.pointB, this.pointC)
};
CL3D.Triangle3d.prototype.getPlane = function () {
	var a = new CL3D.Plane3d(false);
	a.setPlaneFrom3Points(this.pointA, this.pointB, this.pointC);
	return a
};
CL3D.Triangle3d.prototype.isPointInsideFast = function (j) {
	var l = this.pointB.substract(this.pointA);
	var k = this.pointC.substract(this.pointA);
	var u = l.dotProduct(l);
	var s = l.dotProduct(k);
	var q = k.dotProduct(k);
	var i = j.substract(this.pointA);
	var n = i.dotProduct(l);
	var m = i.dotProduct(k);
	var t = (n * q) - (m * s);
	var r = (m * u) - (n * s);
	var h = (u * q) - (s * s);
	var o = t + r - h;
	return (o < 0) && !((t < 0) || (r < 0))
};
CL3D.Triangle3d.prototype.isPointInside = function (a) {
	return (this.isOnSameSide(a, this.pointA, this.pointB, this.pointC) && this.isOnSameSide(a, this.pointB, this.pointA, this.pointC) && this.isOnSameSide(a, this.pointC, this.pointA, this.pointB))
};
CL3D.Triangle3d.prototype.isOnSameSide = function (i, g, d, c) {
	var e = c.substract(d);
	var h = e.crossProduct(i.substract(d));
	var f = e.crossProduct(g.substract(d));
	return (h.dotProduct(f) >= 0)
};
CL3D.Triangle3d.prototype.getNormal = function () {
	return this.pointB.substract(this.pointA).crossProduct(this.pointC.substract(this.pointA))
};
CL3D.Triangle3d.prototype.getIntersectionOfPlaneWithLine = function (c, f) {
	var e = this.getNormal();
	e.normalize();
	var b = e.dotProduct(f);
	if (CL3D.iszero(b)) {
		return null
	}
	var g = this.pointA.dotProduct(e);
	var a = -(e.dotProduct(c) - g) / b;
	return c.add(f.multiplyWithScal(a))
};
CL3D.Triangle3d.prototype.getIntersectionWithLine = function (b, c) {
	var a = this.getIntersectionOfPlaneWithLine(b, c);
	if (a == null) {
		return null
	}
	if (this.isPointInside(a)) {
		return a
	}
	return null
};
CL3D.Triangle3d.prototype.isTotalInsideBox = function (a) {
	return a.isPointInside(this.pointA) && a.isPointInside(this.pointB) && a.isPointInside(this.pointC)
};
CL3D.Triangle3d.prototype.copyTo = function (a) {
	this.pointA.copyTo(a.pointA);
	this.pointB.copyTo(a.pointB);
	this.pointC.copyTo(a.pointC)
};

//Class Matrix4
CL3D.Matrix4 = function (a) {
	if (a == null) {
		a = true
	}

	this.m00 = 0;
	this.m01 = 0;
	this.m02 = 0;
	this.m03 = 0;
	this.m04 = 0;
	this.m05 = 0;
	this.m06 = 0;
	this.m07 = 0;
	this.m08 = 0;
	this.m09 = 0;
	this.m10 = 0;
	this.m11 = 0;
	this.m12 = 0;
	this.m13 = 0;
	this.m14 = 0;
	this.m15 = 0;

	this.bIsIdentity = false;

	if (a) {
		this.m00 = 1;
		this.m05 = 1;
		this.m10 = 1;
		this.m15 = 1;
		this.bIsIdentity = true
	}
};
CL3D.Matrix4.prototype.setTo = function (a) {
	this.m00 = a.m00;
	this.m01 = a.m01;
	this.m02 = a.m02;
	this.m03 = a.m03;
	this.m04 = a.m04;
	this.m05 = a.m05;
	this.m06 = a.m06;
	this.m07 = a.m07;
	this.m08 = a.m08;
	this.m09 = a.m09;
	this.m10 = a.m10;
	this.m11 = a.m11;
	this.m12 = a.m12;
	this.m13 = a.m13;
	this.m14 = a.m14;
	this.m15 = a.m15;

	this.bIsIdentity = false;

	return this;
};
/*.Matrix4.prototype.clone = function () {// This function shudn't be used
	var a = new CL3D.Matrix4(false);
	this.copyTo(a);
	return a
};*/
CL3D.Matrix4.prototype.resetToZero = function (a) {
	this.m00 = 0;
	this.m01 = 0;
	this.m02 = 0;
	this.m03 = 0;
	this.m04 = 0;
	this.m05 = 0;
	this.m06 = 0;
	this.m07 = 0;
	this.m08 = 0;
	this.m09 = 0;
	this.m10 = 0;
	this.m11 = 0;
	this.m12 = 0;
	this.m13 = 0;
	this.m14 = 0;
	this.m15 = 0;

	return this;
};
CL3D.Matrix4.prototype.makeIdentity = function () {
	this.m00 = 1;
	this.m01 = 0;
	this.m02 = 0;
	this.m03 = 0;
	this.m04 = 0;
	this.m05 = 1;
	this.m06 = 0;
	this.m07 = 0;
	this.m08 = 0;
	this.m09 = 0;
	this.m10 = 1;
	this.m11 = 0;
	this.m12 = 0;
	this.m13 = 0;
	this.m14 = 0;
	this.m15 = 1;
	this.bIsIdentity = true
};
CL3D.Matrix4.prototype.isIdentity = function () {
	if (this.bIsIdentity) {
		return true
	}
	this.bIsIdentity = (CL3D.isone(this.m00) && CL3D.iszero(this.m01) && CL3D.iszero(this.m02) && CL3D.iszero(this.m03) && CL3D.iszero(this.m04) && CL3D.isone(this.m05) && CL3D.iszero(this.m06) && CL3D.iszero(this.m07) && CL3D.iszero(this.m08) && CL3D.iszero(this.m09) && CL3D.isone(this.m10) && CL3D.iszero(this.m11) && CL3D.iszero(this.m12) && CL3D.iszero(this.m13) && CL3D.iszero(this.m14) && CL3D.isone(this.m15));
	return this.bIsIdentity
};
CL3D.Matrix4.prototype.isTranslateOnly = function () {
	if (this.bIsIdentity) {
		return true
	}
	return (CL3D.isone(this.m00) && CL3D.iszero(this.m01) && CL3D.iszero(this.m02) && CL3D.iszero(this.m03) && CL3D.iszero(this.m04) && CL3D.isone(this.m05) && CL3D.iszero(this.m06) && CL3D.iszero(this.m07) && CL3D.iszero(this.m08) && CL3D.iszero(this.m09) && CL3D.isone(this.m10) && CL3D.iszero(this.m11) && CL3D.isone(this.m15))
};
CL3D.Matrix4.prototype.equals = function (a) {
	return CL3D.equals(this.m00, a.m00) && CL3D.equals(this.m01, a.m01) && CL3D.equals(this.m02, a.m02) && CL3D.equals(this.m03, a.m03) && CL3D.equals(this.m04, a.m04) && CL3D.equals(this.m05, a.m05) && CL3D.equals(this.m06, a.m06) && CL3D.equals(this.m07, a.m07) && CL3D.equals(this.m08, a.m08) && CL3D.equals(this.m09, a.m09) && CL3D.equals(this.m10, a.m10) && CL3D.equals(this.m11, a.m11) && CL3D.equals(this.m12, a.m12) && CL3D.equals(this.m13, a.m13) && CL3D.equals(this.m14, a.m14) && CL3D.equals(this.m15, a.m15)
};
CL3D.Matrix4.prototype.getTranslation = function () {
	if (!this.Translation)
		this.Translation = new CL3D.Vect3d();

	this.Translation.set(this.m12, this.m13, this.m14);
	return this.Translation;
};
CL3D.Matrix4.prototype.getScale = function () {
	return new CL3D.Vect3d(this.m00, this.m05, this.m10) //SS: may be optimizad (as well as every function which returns a new object)
};
CL3D.Matrix4.prototype.rotateVect = function (a) {
	var b = a.clone();
	a.X = b.X * this.m00 + b.Y * this.m04 + b.Z * this.m08;
	a.Y = b.X * this.m01 + b.Y * this.m05 + b.Z * this.m09;
	a.Z = b.X * this.m02 + b.Y * this.m06 + b.Z * this.m10
};
CL3D.Matrix4.prototype.rotateVect2 = function (a, b) {
	a.X = b.X * this.m00 + b.Y * this.m04 + b.Z * this.m08;
	a.Y = b.X * this.m01 + b.Y * this.m05 + b.Z * this.m09;
	a.Z = b.X * this.m02 + b.Y * this.m06 + b.Z * this.m10
};
CL3D.Matrix4.prototype.getRotatedVect = function (a) {
	return new CL3D.Vect3d(a.X * this.m00 + a.Y * this.m04 + a.Z * this.m08, a.X * this.m01 + a.Y * this.m05 + a.Z * this.m09, a.X * this.m02 + a.Y * this.m06 + a.Z * this.m10)
};
CL3D.Matrix4.prototype.getTransformedVect = function (a) {
	return new CL3D.Vect3d(a.X * this.m00 + a.Y * this.m04 + a.Z * this.m08 + this.m12, a.X * this.m01 + a.Y * this.m05 + a.Z * this.m09 + this.m13, a.X * this.m02 + a.Y * this.m06 + a.Z * this.m10 + this.m14)
};
CL3D.Matrix4.prototype.transformVect = function (c) {
	var b = c.X * this.m00 + c.Y * this.m04 + c.Z * this.m08 + this.m12;
	var a = c.X * this.m01 + c.Y * this.m05 + c.Z * this.m09 + this.m13;
	var d = c.X * this.m02 + c.Y * this.m06 + c.Z * this.m10 + this.m14;
	c.X = b;
	c.Y = a;
	c.Z = d
};
CL3D.Matrix4.prototype.transformVect2 = function (a, b) {
	a.X = b.X * this.m00 + b.Y * this.m04 + b.Z * this.m08 + this.m12;
	a.Y = b.X * this.m01 + b.Y * this.m05 + b.Z * this.m09 + this.m13;
	a.Z = b.X * this.m02 + b.Y * this.m06 + b.Z * this.m10 + this.m14
};
CL3D.Matrix4.prototype.getTranslatedVect = function (a) {
	return new CL3D.Vect3d(a.X + this.m12, a.Y + this.m13, a.Z + this.m14)
};
CL3D.Matrix4.prototype.translateVect = function (a) {
	a.X = a.X + this.m12;
	a.Y = a.Y + this.m13;
	a.Z = a.Z + this.m14
};
CL3D.Matrix4.prototype.transformPlane = function (a) {
	var d = a.getMemberPoint();
	this.transformVect(d);
	var b = a.Normal.clone();
	b.normalize();
	var c = this.getScale();
	if (!CL3D.equals(c.X, 0) && !CL3D.equals(c.Y, 0) && !CL3D.equals(c.Z, 0) && (!CL3D.equals(c.X, 1) || !CL3D.equals(c.Y, 1) || !CL3D.equals(c.Z, 1))) {
		b.X *= 1 / (c.X * c.X);
		b.Y *= 1 / (c.Y * c.Y);
		b.Z *= 1 / (c.Z * c.Z)
	}
	this.rotateVect(b);
	b.normalize();
	a.setPlane(d, b)
};
CL3D.Matrix4.prototype.multiplyThisWith = function (a) {
	if (this.bIsIdentity) {
		a.copyTo(this);
		return this;
	}
	if (a.bIsIdentity) 
		return this;

	if (!this.b)
		this.b = new CL3D.Matrix4(false);

	this.b.m00 = this.m00 * a.m00 + this.m04 * a.m01 + this.m08 * a.m02 + this.m12 * a.m03;
	this.b.m01 = this.m01 * a.m00 + this.m05 * a.m01 + this.m09 * a.m02 + this.m13 * a.m03;
	this.b.m02 = this.m02 * a.m00 + this.m06 * a.m01 + this.m10 * a.m02 + this.m14 * a.m03;
	this.b.m03 = this.m03 * a.m00 + this.m07 * a.m01 + this.m11 * a.m02 + this.m15 * a.m03;
	this.b.m04 = this.m00 * a.m04 + this.m04 * a.m05 + this.m08 * a.m06 + this.m12 * a.m07;
	this.b.m05 = this.m01 * a.m04 + this.m05 * a.m05 + this.m09 * a.m06 + this.m13 * a.m07;
	this.b.m06 = this.m02 * a.m04 + this.m06 * a.m05 + this.m10 * a.m06 + this.m14 * a.m07;
	this.b.m07 = this.m03 * a.m04 + this.m07 * a.m05 + this.m11 * a.m06 + this.m15 * a.m07;
	this.b.m08 = this.m00 * a.m08 + this.m04 * a.m09 + this.m08 * a.m10 + this.m12 * a.m11;
	this.b.m09 = this.m01 * a.m08 + this.m05 * a.m09 + this.m09 * a.m10 + this.m13 * a.m11;
	this.b.m10 = this.m02 * a.m08 + this.m06 * a.m09 + this.m10 * a.m10 + this.m14 * a.m11;
	this.b.m11 = this.m03 * a.m08 + this.m07 * a.m09 + this.m11 * a.m10 + this.m15 * a.m11;
	this.b.m12 = this.m00 * a.m12 + this.m04 * a.m13 + this.m08 * a.m14 + this.m12 * a.m15;
	this.b.m13 = this.m01 * a.m12 + this.m05 * a.m13 + this.m09 * a.m14 + this.m13 * a.m15;
	this.b.m14 = this.m02 * a.m12 + this.m06 * a.m13 + this.m10 * a.m14 + this.m14 * a.m15;
	this.b.m15 = this.m03 * a.m12 + this.m07 * a.m13 + this.m11 * a.m14 + this.m15 * a.m15;

	this.m00 = this.b.m00;
	this.m01 = this.b.m01;
	this.m02 = this.b.m02;
	this.m03 = this.b.m03;
	this.m04 = this.b.m04;
	this.m05 = this.b.m05;
	this.m06 = this.b.m06;
	this.m07 = this.b.m07;
	this.m08 = this.b.m08;
	this.m09 = this.b.m09;
	this.m10 = this.b.m10;
	this.m11 = this.b.m11;
	this.m12 = this.b.m12;
	this.m13 = this.b.m13;
	this.m14 = this.b.m14;
	this.m15 = this.b.m15;
	return this;
};
CL3D.Matrix4.prototype.multiplyWith1x4Matrix = function (a) {
	_tempV0.setTo(a);
	_tempV0.W = a.W;
	a.X = _tempV0.X * this.m00 + _tempV0.Y * this.m04 + _tempV0.Z * this.m08 + _tempV0.W * this.m12;
	a.Y = _tempV0.X * this.m01 + _tempV0.Y * this.m05 + _tempV0.Z * this.m09 + _tempV0.W * this.m13;
	a.Z = _tempV0.X * this.m02 + _tempV0.Y * this.m06 + _tempV0.Z * this.m10 + _tempV0.W * this.m14;
	a.W = _tempV0.X * this.m03 + _tempV0.Y * this.m07 + _tempV0.Z * this.m11 + _tempV0.W * this.m15
};
CL3D.Matrix4.prototype.getInverse = function (a) {
	if (this.bIsIdentity) {
		this.copyTo(a);
		return true
	}
	var b = (this.m00 * this.m05 - this.m01 * this.m04) * (this.m10 * this.m15 - this.m11 * this.m14) - (this.m00 * this.m06 - this.m02 * this.m04) * (this.m09 * this.m15 - this.m11 * this.m13) + (this.m00 * this.m07 - this.m03 * this.m04) * (this.m09 * this.m14 - this.m10 * this.m13) + (this.m01 * this.m06 - this.m02 * this.m05) * (this.m08 * this.m15 - this.m11 * this.m12) - (this.m01 * this.m07 - this.m03 * this.m05) * (this.m08 * this.m14 - this.m10 * this.m12) + (this.m02 * this.m07 - this.m03 * this.m06) * (this.m08 * this.m13 - this.m09 * this.m12);
	if (b > -1e-7 && b < 1e-7) {
		return false
	}
	b = 1 / b;
	a.m00 = b * (this.m05 * (this.m10 * this.m15 - this.m11 * this.m14) + this.m06 * (this.m11 * this.m13 - this.m09 * this.m15) + this.m07 * (this.m09 * this.m14 - this.m10 * this.m13));
	a.m01 = b * (this.m09 * (this.m02 * this.m15 - this.m03 * this.m14) + this.m10 * (this.m03 * this.m13 - this.m01 * this.m15) + this.m11 * (this.m01 * this.m14 - this.m02 * this.m13));
	a.m02 = b * (this.m13 * (this.m02 * this.m07 - this.m03 * this.m06) + this.m14 * (this.m03 * this.m05 - this.m01 * this.m07) + this.m15 * (this.m01 * this.m06 - this.m02 * this.m05));
	a.m03 = b * (this.m01 * (this.m07 * this.m10 - this.m06 * this.m11) + this.m02 * (this.m05 * this.m11 - this.m07 * this.m09) + this.m03 * (this.m06 * this.m09 - this.m05 * this.m10));
	a.m04 = b * (this.m06 * (this.m08 * this.m15 - this.m11 * this.m12) + this.m07 * (this.m10 * this.m12 - this.m08 * this.m14) + this.m04 * (this.m11 * this.m14 - this.m10 * this.m15));
	a.m05 = b * (this.m10 * (this.m00 * this.m15 - this.m03 * this.m12) + this.m11 * (this.m02 * this.m12 - this.m00 * this.m14) + this.m08 * (this.m03 * this.m14 - this.m02 * this.m15));
	a.m06 = b * (this.m14 * (this.m00 * this.m07 - this.m03 * this.m04) + this.m15 * (this.m02 * this.m04 - this.m00 * this.m06) + this.m12 * (this.m03 * this.m06 - this.m02 * this.m07));
	a.m07 = b * (this.m02 * (this.m07 * this.m08 - this.m04 * this.m11) + this.m03 * (this.m04 * this.m10 - this.m06 * this.m08) + this.m00 * (this.m06 * this.m11 - this.m07 * this.m10));
	a.m08 = b * (this.m07 * (this.m08 * this.m13 - this.m09 * this.m12) + this.m04 * (this.m09 * this.m15 - this.m11 * this.m13) + this.m05 * (this.m11 * this.m12 - this.m08 * this.m15));
	a.m09 = b * (this.m11 * (this.m00 * this.m13 - this.m01 * this.m12) + this.m08 * (this.m01 * this.m15 - this.m03 * this.m13) + this.m09 * (this.m03 * this.m12 - this.m00 * this.m15));
	a.m10 = b * (this.m15 * (this.m00 * this.m05 - this.m01 * this.m04) + this.m12 * (this.m01 * this.m07 - this.m03 * this.m05) + this.m13 * (this.m03 * this.m04 - this.m00 * this.m07));
	a.m11 = b * (this.m03 * (this.m05 * this.m08 - this.m04 * this.m09) + this.m00 * (this.m07 * this.m09 - this.m05 * this.m11) + this.m01 * (this.m04 * this.m11 - this.m07 * this.m08));
	a.m12 = b * (this.m04 * (this.m10 * this.m13 - this.m09 * this.m14) + this.m05 * (this.m08 * this.m14 - this.m10 * this.m12) + this.m06 * (this.m09 * this.m12 - this.m08 * this.m13));
	a.m13 = b * (this.m08 * (this.m02 * this.m13 - this.m01 * this.m14) + this.m09 * (this.m00 * this.m14 - this.m02 * this.m12) + this.m10 * (this.m01 * this.m12 - this.m00 * this.m13));
	a.m14 = b * (this.m12 * (this.m02 * this.m05 - this.m01 * this.m06) + this.m13 * (this.m00 * this.m06 - this.m02 * this.m04) + this.m14 * (this.m01 * this.m04 - this.m00 * this.m05));
	a.m15 = b * (this.m00 * (this.m05 * this.m10 - this.m06 * this.m09) + this.m01 * (this.m06 * this.m08 - this.m04 * this.m10) + this.m02 * (this.m04 * this.m09 - this.m05 * this.m08));
	a.bIsIdentity = this.bIsIdentity;
	return true
};
CL3D.Matrix4.prototype.makeInverse = function () {
	_tempM2.resetToZero();
	if (this.getInverse(_tempM2)) {
		_tempM2.copyTo(this);
		return true
	}
	return false
};
CL3D.Matrix4.prototype.getTransposed = function () {
	var a = new CL3D.Matrix4(false);
	a.m00 = this.m00;
	a.m01 = this.m04;
	a.m02 = this.m08;
	a.m03 = this.m12;
	a.m04 = this.m01;
	a.m05 = this.m05;
	a.m06 = this.m09;
	a.m07 = this.m13;
	a.m08 = this.m02;
	a.m09 = this.m06;
	a.m10 = this.m10;
	a.m11 = this.m14;
	a.m12 = this.m03;
	a.m13 = this.m07;
	a.m14 = this.m11;
	a.m15 = this.m15;
	a.bIsIdentity = this.bIsIdentity;
	return a
};
CL3D.Matrix4.prototype.asArray = function () {

	if(!this.Array)
		this.Array = new Array(16);

	this.Array[0] = this.m00;
	this.Array[1] = this.m01;
	this.Array[2] = this.m02;
	this.Array[3] = this.m03;
	this.Array[4] = this.m04;
	this.Array[5] = this.m05;
	this.Array[6] = this.m06;
	this.Array[7] = this.m07;
	this.Array[8] = this.m08;
	this.Array[9] = this.m09;
	this.Array[10] = this.m10;
	this.Array[11] = this.m11;
	this.Array[12] = this.m12;
	this.Array[13] = this.m13;
	this.Array[14] = this.m14;
	this.Array[15] = this.m15;

	return this.Array;
};
CL3D.Matrix4.prototype.setByIndex = function (a, b) {
	this.bIsIdentity = false;
	switch (a) {
	case 0:
		this.m00 = b;
		break;
	case 1:
		this.m01 = b;
		break;
	case 2:
		this.m02 = b;
		break;
	case 3:
		this.m03 = b;
		break;
	case 4:
		this.m04 = b;
		break;
	case 5:
		this.m05 = b;
		break;
	case 6:
		this.m06 = b;
		break;
	case 7:
		this.m07 = b;
		break;
	case 8:
		this.m08 = b;
		break;
	case 9:
		this.m09 = b;
		break;
	case 10:
		this.m10 = b;
		break;
	case 11:
		this.m11 = b;
		break;
	case 12:
		this.m12 = b;
		break;
	case 13:
		this.m13 = b;
		break;
	case 14:
		this.m14 = b;
		break;
	case 15:
		this.m15 = b;
		break
	}
};
CL3D.Matrix4.prototype.copyTo = function (a) {
	a.m00 = this.m00;
	a.m01 = this.m01;
	a.m02 = this.m02;
	a.m03 = this.m03;
	a.m04 = this.m04;
	a.m05 = this.m05;
	a.m06 = this.m06;
	a.m07 = this.m07;
	a.m08 = this.m08;
	a.m09 = this.m09;
	a.m10 = this.m10;
	a.m11 = this.m11;
	a.m12 = this.m12;
	a.m13 = this.m13;
	a.m14 = this.m14;
	a.m15 = this.m15;
	a.bIsIdentity = this.bIsIdentity
};
CL3D.Matrix4.prototype.buildProjectionMatrixPerspectiveFovLH = function (e, d, f, c) {
	var b = 1 / Math.tan(e / 2);
	var a = (b / d);
	this.m00 = a;
	this.m01 = 0;
	this.m02 = 0;
	this.m03 = 0;
	this.m04 = 0;
	this.m05 = b;
	this.m06 = 0;
	this.m07 = 0;
	this.m08 = 0;
	this.m09 = 0;
	this.m10 = (c / (c - f));
	this.m11 = 1;
	this.m12 = 0;
	this.m13 = 0;
	this.m14 = (-f * c / (c - f));
	this.m15 = 0;
	this.bIsIdentity = false
};
CL3D.Matrix4.prototype.buildCameraLookAtMatrixLH = function (b, e, d) {
	//a
	_tempV0.setTo(e);
	_tempV0.substractFromThis(b);
	_tempV0.normalize();

	//f
	_tempV1.setTo(d);
	_tempV1.crossProductTo(_tempV0);
	_tempV1.normalize();

	//c
	_tempV2.setTo(_tempV0);
	_tempV2.crossProductTo(_tempV1);

	this.m00 = _tempV1.X;
	this.m01 = _tempV2.X;
	this.m02 = _tempV0.X;
	this.m03 = 0;
	this.m04 = _tempV1.Y;
	this.m05 = _tempV2.Y;
	this.m06 = _tempV0.Y;
	this.m07 = 0;
	this.m08 = _tempV1.Z;
	this.m09 = _tempV2.Z;
	this.m10 = _tempV0.Z;
	this.m11 = 0;
	this.m12 = -_tempV1.dotProduct(b);
	this.m13 = -_tempV2.dotProduct(b);
	this.m14 = -_tempV0.dotProduct(b);
	this.m15 = 1;
	this.bIsIdentity = false
};
CL3D.Matrix4.prototype.setRotationDegrees = function (a) {
	_tempV0.setTo(a).multiplyThisWithScal(CL3D.DEGTORAD);
	this.setRotationRadians(_tempV0);
};
CL3D.Matrix4.prototype.setRotationRadians = function (i) {
	var e = Math.cos(i.X);
	var a = Math.sin(i.X);
	var f = Math.cos(i.Y);
	var c = Math.sin(i.Y);
	var d = Math.cos(i.Z);
	var g = Math.sin(i.Z);

	this.m00 = (f * d);
	this.m01 = (f * g);
	this.m02 = (-c);

	var h = a * c;
	var b = e * c;

	this.m04 = (h * d - e * g);
	this.m05 = (h * g + e * d);
	this.m06 = (a * f);
	this.m08 = (b * d + a * g);
	this.m09 = (b * g - a * d);
	this.m10 = (e * f);

	this.bIsIdentity = false
};
CL3D.Matrix4.prototype.getRotationDegrees = function () {
	var f = -Math.asin(this.m02);
	var e = Math.cos(f);
	f *= CL3D.RADTODEG;
	var c;
	var a;
	var g;
	var d;
	if (Math.abs(e) > 1e-8) {
		var b = (1 / e);
		c = this.m10 * b;
		a = this.m06 * b;
		g = Math.atan2(a, c) * CL3D.RADTODEG;
		c = this.m00 * b;
		a = this.m01 * b;
		d = Math.atan2(a, c) * CL3D.RADTODEG
	} else {
		g = 0;
		c = this.m05;
		a = -this.m04;
		d = Math.atan2(a, c) * CL3D.RADTODEG
	} if (g < 0) {
		g += 360
	}
	if (f < 0) {
		f += 360
	}
	if (d < 0) {
		d += 360
	}

	if (!this.RotationDegrees)
		this.RotationDegrees = new CL3D.Vect3d();

	return this.RotationDegrees.set(g, f, d);
};
CL3D.Matrix4.prototype.setTranslation = function (a) {
	this.m12 = a.X;
	this.m13 = a.Y;
	this.m14 = a.Z;
	this.bIsIdentity = false
};
CL3D.Matrix4.prototype.setScale = function (a) {
	this.m00 = a.X;
	this.m05 = a.Y;
	this.m10 = a.Z;
	this.bIsIdentity = false
};
CL3D.Matrix4.prototype.setScaleXYZ = function (a, c, b) {
	this.m00 = a;
	this.m05 = c;
	this.m10 = b;
	this.bIsIdentity = false
};
CL3D.Matrix4.prototype.transformBoxEx = function (d) {
	var b = d.getEdges();
	var c;
	for (c = 0; c < 8; ++c) {
		this.transformVect(b[c])
	}
	var a = b[0];
	d.MinEdge.setTo(a);
	d.MaxEdge.setTo(a);
	for (c = 1; c < 8; ++c) {
		d.addInternalPointByVector(b[c])
	}
};
CL3D.Matrix4.prototype.toString = function () {
	return this.m00 + " " + this.m01 + " " + this.m02 + " " + this.m03 + "\n" + this.m04 + " " + this.m05 + " " + this.m06 + " " + this.m07 + "\n" + this.m08 + " " + this.m09 + " " + this.m10 + " " + this.m11 + "\n" + this.m12 + " " + this.m13 + " " + this.m14 + " " + this.m15
};

var _tempM0 = new CL3D.Matrix4();
var _tempM1 = new CL3D.Matrix4();
var _tempM2 = new CL3D.Matrix4();

//Class Quaternion
CL3D.Quaternion = function (a, d, c, b) {
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
	this.W = 1;

	if (a != null) {
		this.X = a
	}
	if (d != null) {
		this.Y = d
	}
	if (c != null) {
		this.Z = c
	}
	if (b != null) {
		this.W = b
	}
};
CL3D.Quaternion.prototype.X = 0;
CL3D.Quaternion.prototype.Y = 0;
CL3D.Quaternion.prototype.Z = 0;
CL3D.Quaternion.prototype.W = 0;
CL3D.Quaternion.prototype.set = function (x, y, z, w) {
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
	this.W = 1;

	if (x != null) {
		this.X = x
	}
	if (y != null) {
		this.Y = y
	}
	if (z != null) {
		this.Z = z
	}
	if (w != null) {
		this.W = w
	}

	return this;
};
CL3D.Quaternion.prototype.setTo = function (a) {
	this.X = a.X;
	this.Y = a.Y;
	this.Z = a.Z;
	this.W = a.W;

	return this;
};
CL3D.Quaternion.prototype.copyTo = function (a) {
	a.X = this.X;
	a.Y = this.Y;
	a.Z = this.Z;
	a.W = this.W
};
CL3D.Quaternion.prototype.multiplyThisWith = function (a) {
	this.X = this.X * a;
	this.Y = this.Y * a;
	this.Z = this.Z * a;
	this.W = this.W * a;

	return this;
};
CL3D.Quaternion.prototype.addToThis = function (a) {
	this.X += a.X;
	this.Y += a.Y;
	this.Z += a.Z;
	this.W += a.W;

	return this
};
CL3D.Quaternion.prototype.slerp = function (g, f, b) {
	var c = g.dotProduct(f);
	if (c < 0) {
		g.multiplyThisWith(-1);
		c *= -1
	}
	var d;
	var e;
	if ((c + 1) > 0.05) {
		if ((1 - c) >= 0.05) {
			var a = Math.acos(c);
			var i = 1 / Math.sin(a);
			d = Math.sin(a * (1 - b)) * i;
			e = Math.sin(a * b) * i
		} else {
			d = 1 - b;
			e = b
		}
	} else {
		f.set(-g.Y, g.X, -g.W, g.Z);
		d = Math.sin(CL3D.PI * (0.5 - b));
		e = Math.sin(CL3D.PI * b)
	}
	_tempQ0.setTo(f);
	_tempQ1.setTo(g).multiplyThisWith(d).addToThis(_tempQ0.multiplyThisWith(e));

	this.X = _tempQ1.X;
	this.Y = _tempQ1.Y;
	this.Z = _tempQ1.Z;
	this.W = _tempQ1.W
};
CL3D.Quaternion.prototype.dotProduct = function (a) {
	return (this.X * a.X) + (this.Y * a.Y) + (this.Z * a.Z) + (this.W * a.W)
};
CL3D.Quaternion.prototype.getMatrix = function () {
	if (!this.Matrix)
		this.Matrix = new CL3D.Matrix4();

	this.getMatrix_transposed(this.Matrix );

	return this.Matrix;
};
CL3D.Quaternion.prototype.getMatrix_transposed = function (b) {
	var e = this.X;
	var d = this.Y;
	var c = this.Z;
	var a = this.W;
	b.m00 = 1 - 2 * d * d - 2 * c * c;
	b.m04 = 2 * e * d + 2 * c * a;
	b.m08 = 2 * e * c - 2 * d * a;
	b.m12 = 0;
	b.m01 = 2 * e * d - 2 * c * a;
	b.m05 = 1 - 2 * e * e - 2 * c * c;
	b.m09 = 2 * c * d + 2 * e * a;
	b.m13 = 0;
	b.m02 = 2 * e * c + 2 * d * a;
	b.m06 = 2 * c * d - 2 * e * a;
	b.m10 = 1 - 2 * e * e - 2 * d * d;
	b.m14 = 0;
	b.m03 = 0;
	b.m07 = 0;
	b.m11 = 0;
	b.m15 = 1;
	b.bIsIdentity = false
};
CL3D.Quaternion.prototype.toEuler = function (a) {
	var e = this.W * this.W;
	var d = this.X * this.X;
	var c = this.Y * this.Y;
	var b = this.Z * this.Z;
	a.Z = (Math.atan2(2 * (this.X * this.Y + this.Z * this.W), (d - c - b + e)));
	a.X = (Math.atan2(2 * (this.Y * this.Z + this.X * this.W), (-d - c + b + e)));
	a.Y = Math.asin(CL3D.clamp(-2 * (this.X * this.Z - this.Y * this.W), -1, 1))
};
CL3D.Quaternion.prototype.setFromEuler = function (m, l, i) {
	var f = m * 0.5;
	var a = Math.sin(f);
	var g = Math.cos(f);
	f = l * 0.5;
	var c = Math.sin(f);
	var j = Math.cos(f);
	f = i * 0.5;
	var k = Math.sin(f);
	var e = Math.cos(f);
	var n = j * e;
	var h = c * e;
	var d = j * k;
	var b = c * k;
	this.X = (a * n - g * b);
	this.Y = (g * h + a * d);
	this.Z = (g * d - a * h);
	this.W = (g * n + a * b);
	this.normalize()
};
CL3D.Quaternion.prototype.normalize = function () {
	var a = this.X * this.X + this.Y * this.Y + this.Z * this.Z + this.W * this.W;
	if (a == 1) {
		return
	}
	a = 1 / Math.sqrt(a);
	this.multiplyThisWith(a)
};
CL3D.Quaternion.prototype.toString = function () {
	return "(x: " + this.X + " y:" + this.Y + " z:" + this.Z + " w:" + this.W + ")"
};

var _tempQ0 = new CL3D.Quaternion();
var _tempQ1 = new CL3D.Quaternion();
var _tempQ2 = new CL3D.Quaternion();

//Class Vertex3D
CL3D.Vertex3D = function (a) {
	if (a) {
		this.Pos = new CL3D.Vect3d();
		this.Normal = new CL3D.Vect3d();
		this.Color = 4294967295;
		this.TCoords = new CL3D.Vect2d();
		this.TCoords2 = new CL3D.Vect2d()
	}
};
CL3D.Vertex3D.prototype.Pos = null;
CL3D.Vertex3D.prototype.Normal = null;
CL3D.Vertex3D.prototype.Color = 0;
CL3D.Vertex3D.prototype.TCoords = null;
CL3D.Vertex3D.prototype.TCoords2 = null;
CL3D.Texture = function () {
	this.Name = "";
	this.Loaded = false;
	this.Image = null;
	this.Texture = null;
	this.CachedWidth = null;
	this.CachedHeight = null;
	this.OriginalWidth = null;
	this.OriginalHeight = null
};
CL3D.Texture.prototype.getImage = function () {
	return this.Image
};
CL3D.Texture.prototype.getWebGLTexture = function () {
	return this.Texture
};
CL3D.Texture.prototype.getWidth = function () {
	if (this.Image) {
		return this.Image.width
	}
	if (this.CachedWidth != null) {
		return this.CachedWidth
	}
	return 0
};
CL3D.Texture.prototype.getHeight = function () {
	if (this.Image) {
		return this.Image.height
	}
	if (this.CachedHeight != null) {
		return this.CachedHeight
	}
	return 0
};
CL3D.Texture.prototype.getURL = function () {
	return this.Name
};
CL3D.Texture.prototype.isLoaded = function () {
	return this.Loaded
};

//Class Action
CL3D.Action = function () {};
CL3D.Action.prototype.execute = function (a, b) {};
CL3D.Action.SetOverlayText = function () {
	this.Text = "";
	this.SceneNodeToChange = null;
	this.ChangeCurrentSceneNode = false;
	this.Type = "SetOverlayText"
};
CL3D.Action.SetOverlayText.prototype.execute = function (a, h) {
	if (!a || !h) {
		return
	}
	var j = null;
	if (this.ChangeCurrentSceneNode) {
		j = a
	} else {
		if (this.SceneNodeToChange != -1) {
			j = h.getSceneNodeFromId(this.SceneNodeToChange)
		}
	} if (j && j.setText) {
		var g = this.Text.indexOf("$");
		if (g != -1) {
			var c = this.Text;
			var e = 0;
			var k = true;
			while (k) {
				k = false;
				g = c.indexOf("$", e);
				if (g != -1) {
					e = g + 1;
					var d = c.indexOf("$", g + 1);
					if (d != -1) {
						k = true;
						var b = c.substr(g + 1, d - (g + 1));
						var i = CL3D.CopperCubeVariable.getVariable(b, false, h);
						if (i) {
							var f = c.substr(0, g);
							f += i.getValueAsString();
							e = f.length + 1;
							f += c.substr(d + 1, c.length - d);
							c = f
						}
					}
				}
			}
			j.setText(c)
		} else {
			j.setText(this.Text)
		}
	}
};
CL3D.Action.MakeSceneNodeInvisible = function () {
	this.InvisibleMakeType = 0;
	this.SceneNodeToMakeInvisible = null;
	this.ChangeCurrentSceneNode = false;
	this.Type = "MakeSceneNodeInvisible"
};
CL3D.Action.MakeSceneNodeInvisible.prototype.execute = function (c, b) {
	if (!c || !b) {
		return
	}
	var a = null;
	if (this.ChangeCurrentSceneNode) {
		a = c
	} else {
		if (this.SceneNodeToMakeInvisible != -1) {
			a = b.getSceneNodeFromId(this.SceneNodeToMakeInvisible)
		}
	} if (a) {
		switch (this.InvisibleMakeType) {
		case 0:
			a.setVisible(false);
			break;
		case 1:
			a.setVisible(true);
			break;
		case 2:
			a.setVisible(!a.getVisible());
			break
		}
	}
};
CL3D.Action.ChangeSceneNodeTexture = function () {
	this.Type = "ChangeSceneNodeTexture"
};
CL3D.Action.ChangeSceneNodeTexture.prototype.execute = function (e, d) {
	if (!e || !d) {
		return
	}
	var a = null;
	if (this.ChangeCurrentSceneNode) {
		a = e
	} else {
		if (this.SceneNodeToChange != -1) {
			a = d.getSceneNodeFromId(this.SceneNodeToChange)
		}
	} if (a) {
		if (a.getType() == "2doverlay") {
			a.setShowImage(this.TheTexture)
		} else {
			var f = a.getMaterialCount();
			if (this.TextureChangeType == 0) {
				for (var c = 0; c < f; ++c) {
					var b = a.getMaterial(c);
					b.Tex1 = this.TheTexture
				}
			} else {
				if (this.TextureChangeType == 1) {
					var b = a.getMaterial(this.IndexToChange);
					b.Tex1 = this.TheTexture
				}
			}
		}
	}
};
CL3D.Action.ExecuteJavaScript = function () {
	this.Type = "ExecuteJavaScript"
};
CL3D.Action.ExecuteJavaScript.prototype.execute = function (currentNode, sceneManager) {
	eval(this.JScript)
};
CL3D.Action.OpenWebpage = function () {
	this.Type = "OpenWebpage"
};
CL3D.Action.OpenWebpage.prototype.execute = function (b, a) {
	window.open(this.Webpage, this.Target)
};
CL3D.Action.SetSceneNodeAnimation = function () {
	this.Type = "SetSceneNodeAnimation"
};
CL3D.Action.SetSceneNodeAnimation.prototype.execute = function (e, d) {
	if (!e || !d) {
		return
	}
	var a = null;
	if (this.ChangeCurrentSceneNode) {
		a = e
	} else {
		if (this.SceneNodeToChangeAnim != -1) {
			a = d.getSceneNodeFromId(this.SceneNodeToChangeAnim)
		}
	} if (a) {
		var c = a;
		if (c.getType() != "animatedmesh") {
			return
		}
		var g = c.Mesh;
		if (!g) {
			return
		}
		var b = g.getNamedAnimationRangeByName(this.AnimName);
		if (b) {
			c.setFrameLoop(b.Begin, b.End);
			if (b.FPS != 0) {
				c.setAnimationSpeed(b.FPS)
			}
			c.setLoopMode(this.Loop)
		} else {
			if (this.AnimName) {
				var f = this.AnimName.toLowerCase();
				if (f == "all") {
					c.setFrameLoop(0, g.getFrameCount());
					if (g.DefaultFPS != 0) {
						c.setAnimationSpeed(g.DefaultFPS)
					}
					c.setLoopMode(this.Loop)
				} else {
					if (f == "none") {
						c.setFrameLoop(0, 0);
						c.setLoopMode(this.Loop)
					}
				}
			}
		}
	}
};
CL3D.Action.SwitchToScene = function (a) {
	this.Engine = a;
	this.Type = "SwitchToScene"
};
CL3D.Action.SwitchToScene.prototype.execute = function (b, a) {
	if (this.Engine) {
		this.Engine.gotoSceneByName(this.SceneName, true)
	}
};
CL3D.Action.SetActiveCamera = function (a) {
	this.Engine = a;
	this.Type = "SetActiveCamera"
};
CL3D.Action.SetActiveCamera.prototype.execute = function (c, b) {
	if (!c || !b) {
		return
	}
	var a = null;
	if (this.CameraToSetActive != -1) {
		a = b.getSceneNodeFromId(this.CameraToSetActive)
	}
	if (a != null) {
		if (a.getType() == "camera") {
			if (this.Engine) {
				this.Engine.setActiveCameraNextFrame(a)
			}
		}
	}
};
CL3D.Action.SetOrChangeAVariable = function () {
	this.Type = "SetOrChangeAVariable"
};
CL3D.Action.SetOrChangeAVariable.prototype.execute = function (d, c) {
	if (!d || !c) {
		return
	}
	if (this.VariableName == null) {
		return
	}
	var f = CL3D.CopperCubeVariable.getVariable(this.VariableName, true, c);
	if (f == null) {
		return
	}
	var e = null;
	if (this.ValueType == 1) {
		e = CL3D.CopperCubeVariable.getVariable(this.Value, false, c);
		if (e == null) {
			return
		}
	}
	if (e == null) {
		e = new CL3D.CopperCubeVariable();
		e.setValueAsString(this.Value)
	}
	switch (this.Operation) {
	case 0:
		f.setAsCopy(e);
		break;
	case 1:
		f.setValueAsFloat(f.getValueAsFloat() + e.getValueAsFloat());
		break;
	case 2:
		f.setValueAsFloat(f.getValueAsFloat() - e.getValueAsFloat());
		break;
	case 3:
		var b = e.getValueAsFloat();
		f.setValueAsFloat((b != 0) ? (f.getValueAsFloat() / b) : 0);
		break;
	case 4:
		var a = e.getValueAsFloat();
		f.setValueAsInt((a != 0) ? Math.floor(f.getValueAsFloat() / a) : 0);
		break;
	case 5:
		f.setValueAsFloat(f.getValueAsFloat() * e.getValueAsFloat());
		break;
	case 6:
		f.setValueAsInt(Math.floor(f.getValueAsFloat() * e.getValueAsFloat()));
		break
	}
	CL3D.CopperCubeVariable.saveContentOfPotentialTemporaryVariableIntoSource(f, c)
};
CL3D.Action.IfVariable = function () {
	this.Type = "IfVariable"
};
CL3D.Action.IfVariable.prototype.execute = function (b, a) {
	if (!b || !a) {
		return
	}
	if (this.VariableName == null) {
		return
	}
	var e = CL3D.CopperCubeVariable.getVariable(this.VariableName, true, a);
	if (e == null) {
		return
	}
	var d = null;
	if (this.ValueType == 1) {
		d = CL3D.CopperCubeVariable.getVariable(this.Value, false, a);
		if (d == null) {
			return
		}
	}
	if (d == null) {
		d = new CL3D.CopperCubeVariable();
		d.setValueAsString(this.Value)
	}
	var c = false;
	switch (this.ComparisonType) {
	case 0:
	case 1:
		if (e.isString() && d.isString()) {
			c = e.getValueAsString() == d.getValueAsString()
		} else {
			c = CL3D.equals(e.getValueAsFloat(), d.getValueAsFloat())
		} if (this.ComparisonType == 1) {
			c = !c
		}
		break;
	case 2:
		c = e.getValueAsFloat() > d.getValueAsFloat();
		break;
	case 3:
		c = e.getValueAsFloat() < d.getValueAsFloat();
		break
	}
	if (c) {
		if (this.TheActionHandler) {
			this.TheActionHandler.execute(b)
		}
	}
};
CL3D.Action.RestartBehaviors = function () {
	this.SceneNodeToRestart = null;
	this.ChangeCurrentSceneNode = false;
	this.Type = "RestartBehaviors"
};
CL3D.Action.RestartBehaviors.prototype.execute = function (f, e) {
	if (!f || !e) {
		return
	}
	var b = null;
	if (this.ChangeCurrentSceneNode) {
		b = f
	} else {
		if (this.SceneNodeToRestart != -1) {
			b = e.getSceneNodeFromId(this.SceneNodeToRestart)
		}
	} if (b) {
		for (var d = 0; d < b.Animators.length; ++d) {
			var c = b.Animators[d];
			if (c != null) {
				c.reset()
			}
		}
	}
};
CL3D.Action.ActionPlaySound = function () {
	this.Type = "PlaySound"
};
CL3D.Action.ActionPlaySound.prototype.execute = function (b, a) {
	if (a == null || this.TheSound == null) {
		return
	}
	if (this.PlayAs2D || true) {
		this.PlayingSound = CL3D.gSoundManager.play2D(this.TheSound)
	}
};
CL3D.Action.ActionStopSound = function () {
	this.Type = "StopSound"
};
CL3D.Action.ActionStopSound.prototype.execute = function (b, a) {
	CL3D.gSoundManager.stopAll()
};
CL3D.Action.ActionStoreLoadVariable = function () {
	this.Type = "StoreLoadVariable"
};
CL3D.Action.ActionStoreLoadVariable.prototype.setCookie = function (e, c, a) {
	var b = new Date();
	b.setDate(b.getDate() + a);
	var d = escape(c) + ("; expires=" + b.toUTCString());
	document.cookie = e + "=" + d
};
CL3D.Action.ActionStoreLoadVariable.prototype.getCookie = function (f) {
	var d = document.cookie.split(";");
	for (var c = 0; c < d.length; ++c) {
		var b = d[c];
		var e = b.indexOf("=");
		var a = b.substr(0, e);
		a = a.replace(/^\s+|\s+$/g, "");
		if (a == f) {
			return unescape(b.substr(e + 1))
		}
	}
};
CL3D.Action.ActionStoreLoadVariable.prototype.execute = function (b, a) {
	if (this.VariableName == null || this.VariableName == "") {
		return
	}
	var d = CL3D.CopperCubeVariable.getVariable(this.VariableName, this.Load, a);
	if (d != null) {
		try {
			if (this.Load) {
				d.setValueAsString(this.getCookie(d.getName()))
			} else {
				this.setCookie(d.getName(), d.getValueAsString(), 99)
			}
		} catch (c) {}
	}
};
CL3D.ActionHandler = function (a) {
	this.Actions = new Array();
	this.SMGr = a
};
CL3D.ActionHandler.prototype.execute = function (b, c) {
	for (var a = 0; a < this.Actions.length; ++a) {
		this.Actions[a].execute(b, this.SMGr)
	}
};
CL3D.ActionHandler.prototype.addAction = function (b) {
	if (b == null) {
		return
	}
	this.Actions.push(b)
};
CL3D.ActionHandler.prototype.findAction = function (d) {
	for (var c = 0; c < this.Actions.length; ++c) {
		var b = this.Actions[c];
		if (b.Type == d) {
			return b
		}
	}
	return null
};
CL3D.Action.ActionRestartScene = function (a) {
	this.Engine = a;
	this.Type = "RestartScene"
};
CL3D.Action.ActionRestartScene.prototype.execute = function (b, a) {
	if (this.Engine) {
		this.Engine.reloadScene(this.SceneName)
	}
};

//Class Material
CL3D.Material = function () {
	this.Type = 0;
	this.Tex1 = null;
	this.Tex2 = null;
	this.ZWriteEnabled = true;
	this.ClampTexture1 = false;
	this.Lighting = false;
	this.BackfaceCulling = true
};
CL3D.Material.prototype.setFrom = function (a) {
	if (!a) {
		return
	}
	this.Type = a.Type;
	this.ZWriteEnabled = a.ZWriteEnabled;
	this.Tex1 = a.Tex1;
	this.Tex2 = a.Tex2;
	this.ClampTexture1 = a.ClampTexture1;
	this.Lighting = a.Lighting;
	this.BackfaceCulling = a.BackfaceCulling
};
CL3D.Material.prototype.clone = function () {
	var a = new CL3D.Material();
	a.Type = this.Type;
	a.ZReadEnabled = this.ZReadEnabled;
	a.ZWriteEnabled = this.ZWriteEnabled;
	a.Tex1 = this.Tex1;
	a.Tex2 = this.Tex2;
	a.ClampTexture1 = this.ClampTexture1;
	a.Lighting = this.Lighting;
	a.BackfaceCulling = this.BackfaceCulling;
	return a
};
CL3D.Material.prototype.isTransparent = function () {
	return this.Type == CL3D.Material.EMT_TRANSPARENT_ADD_COLOR || this.Type == CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL || this.Type == CL3D.Material.EMT_TRANSPARENT_REFLECTION_2_LAYER
};
CL3D.Material.prototype.Type = 0;
CL3D.Material.prototype.Tex1 = null;
CL3D.Material.prototype.Tex2 = null;
CL3D.Material.prototype.ZWriteEnabled = true;
CL3D.Material.prototype.ZReadEnabled = true;
CL3D.Material.prototype.ClampTexture1 = false;
CL3D.Material.prototype.BackfaceCulling = true;
CL3D.Material.prototype.Lighting = false;
CL3D.Material.EMT_SOLID = 0;
CL3D.Material.EMT_LIGHTMAP = 2;
CL3D.Material.EMT_REFLECTION_2_LAYER = 11;
CL3D.Material.EMT_TRANSPARENT_ADD_COLOR = 12;
CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL = 13;
CL3D.Material.EMT_TRANSPARENT_REFLECTION_2_LAYER = 16;

//Class MeshBuffer
CL3D.MeshBuffer = function () {
	this.Box = new CL3D.Box3d();
	this.Mat = new CL3D.Material();
	this.Indices = new Array();
	this.Vertices = new Array();
	this.RendererNativeArray = null;
	this.OnlyPositionsChanged = false
};
CL3D.MeshBuffer.prototype.Box = null;
CL3D.MeshBuffer.prototype.Mat = null;
CL3D.MeshBuffer.prototype.Indices = null;
CL3D.MeshBuffer.prototype.Vertices = null;
CL3D.MeshBuffer.prototype.RendererNativeArray = null;
CL3D.MeshBuffer.prototype.update = function (a) {
	if (a) {
		this.OnlyPositionsChanged = true
	} else {
		this.RendererNativeArray = null
	}
};
CL3D.MeshBuffer.prototype.freeNativeArray = function () {
	var a = this.RendererNativeArray;
	if (a && a.gl) {
		if (a.positionBuffer) {
			a.gl.deleteBuffer(a.positionBuffer)
		}
		if (a.positionsArray) {
			delete a.positionsArray
		}
		if (a.texcoordsBuffer) {
			a.gl.deleteBuffer(a.texcoordsBuffer)
		}
		if (a.texcoordsBuffer2) {
			a.gl.deleteBuffer(a.texcoordsBuffer2)
		}
		if (a.normalBuffer) {
			a.gl.deleteBuffer(a.normalBuffer)
		}
		if (a.colorBuffer) {
			a.gl.deleteBuffer(a.colorBuffer)
		}
		if (a.indexBuffer) {
			a.gl.deleteBuffer(a.colorBuffer)
		}
	}
	delete this.RendererNativeArray
};
CL3D.MeshBuffer.prototype.recalculateBoundingBox = function () {
	if (!this.Vertices || this.Vertices.length == 0) {
		this.Box.reset(0, 0, 0)
	} else {
		var a = this.Vertices[0];
		this.Box.MinEdge.setTo(a.Pos);
		this.Box.MaxEdge.setTo(a.Pos);
		for (var b = 1; b < this.Vertices.length; ++b) {
			a = this.Vertices[b];
			this.Box.addInternalPointByVector(a.Pos)
		}
	}
};

//Class Mesh
CL3D.Mesh = function () {
	this.Box = new CL3D.Box3d();
	this.MeshBuffers = new Array()
};
CL3D.Mesh.prototype.AddMeshBuffer = function (a) {
	this.MeshBuffers.push(a)
};
CL3D.Mesh.prototype.GetMeshBuffers = function () {
	return this.MeshBuffers
};
CL3D.Mesh.prototype.GetPolyCount = function () {
	var b = 0;
	if (this.MeshBuffers) {
		for (var a = 0; a < this.MeshBuffers.length; ++a) {
			if (this.MeshBuffers[a].Indices) {
				b += this.MeshBuffers[a].Indices.length
			}
		}
	}
	return b / 3
};

//Class MeshCache
CL3D.MeshCache = function () {
	this.Meshes = new Array()
};
CL3D.MeshCache.prototype.getMeshFromName = function (a) {
	for (var c = 0; c < this.Meshes.length; ++c) {
		var b = this.Meshes[c];
		if (b.Name == a) {
			return b
		}
	}
	return null
};
CL3D.MeshCache.prototype.addMesh = function (a) {
	if (a != null) {
		this.Meshes.push(a)
	}
};

//Class SkinnedMeshJoint
CL3D.SkinnedMeshJoint = function () {
	this.Name = "";
	this.LocalMatrix = new CL3D.Matrix4();
	this.Children = new Array();
	this.AttachedMeshes = new Array();
	this.PositionKeys = new Array();
	this.ScaleKeys = new Array();
	this.RotationKeys = new Array();
	this.Weights = new Array();
	this.GlobalMatrix = new CL3D.Matrix4();
	this.GlobalAnimatedMatrix = new CL3D.Matrix4();
	this.LocalAnimatedMatrix = new CL3D.Matrix4();
	this.Animatedposition = new CL3D.Vect3d(0, 0, 0);
	this.Animatedscale = new CL3D.Vect3d(1, 1, 1);
	this.Animatedrotation = new CL3D.Quaternion();
	this.GlobalInversedMatrix = new CL3D.Matrix4();
	this.GlobalSkinningSpace = false;
	this.positionHint = -1;
	this.scaleHint = -1;
	this.rotationHint = -1
};
var _zeroVector = new CL3D.Vect3d(); //Const Zero vector
CL3D.SkinnedMeshWeight = function () {
	this.buffer_id = 0;
	this.vertex_id = 0;
	this.strength = 0;
	this.StaticPos = _zeroVector;
	this.StaticNormal = _zeroVector
};
CL3D.SkinnedMeshScaleKey = function () {
	this.frame = 0;
	this.scale = new CL3D.Vect3d()
};
CL3D.SkinnedMeshPositionKey = function () {
	this.frame = 0;
	this.position = new CL3D.Vect3d()
};
CL3D.SkinnedMeshRotationKey = function () {
	this.frame = 0;
	this.rotation = new CL3D.Quaternion()
};
CL3D.NamedAnimationRange = function () {
	this.Name = "";
	this.Begin = 0;
	this.End = 0;
	this.FPS = 0
};
CL3D.NamedAnimationRange.prototype.Name = "";
CL3D.NamedAnimationRange.prototype.Begin = 0;
CL3D.NamedAnimationRange.prototype.End = 0;
CL3D.NamedAnimationRange.prototype.FPS = 0;

//Class SkineedMesh
CL3D.SkinnedMesh = function () {
	this.Name = "";
	this.AnimatedMeshesToLink = new Array();
	this.AnimationFrames = 0;
	this.LocalBuffers = new Array();
	this.AllJoints = new Array();
	this.RootJoints = new Array();
	this.DefaultFPS = 0;
	this.HasAnimation = false;
	this.PreparedForSkinning = false;
	this.LastAnimatedFrame = 0;
	this.LastSkinnedFrame = 0;
	this.BoneControlUsed = 0;
	this.BoundingBox = new CL3D.Box3d();
	this.InterpolationMode = 1;
	this.Vertices_Moved = new Array();
	this.NamedAnimationRanges = new Array()
};
CL3D.SkinnedMesh.prototype.AddMeshBuffer = function (a) {
	this.LocalBuffers.push(a)
};
CL3D.SkinnedMesh.prototype.getFrameCount = function () {
	return Math.floor(this.AnimationFrames)
};
CL3D.SkinnedMesh.prototype.getBoundingBox = function () {
	return this.BoundingBox
};
CL3D.SkinnedMesh.prototype.finalize = function () {
	this.LastAnimatedFrame = -1;
	this.LastSkinnedFrame = -1;
	var g = 0;
	var f = 0;
	var h;
	var d;
	for (var k = 0; k < this.AllJoints.length; ++k) {
		var m = false;
		for (g = 0; g < this.AllJoints.length; ++g) {
			d = this.AllJoints[g];
			for (var c = 0; c < d.Children.length; ++c) {
				if (d.Children[c] === this.AllJoints[k]) {
					m = true
				}
			}
		}
		if (!m) {
			this.RootJoints.push(this.AllJoints[k])
		}
	}
	for (g = 0; g < this.LocalBuffers.length; ++g) {
		var b = new Array();
		this.Vertices_Moved.push(b);
		h = this.LocalBuffers[g];
		var a = h.Vertices.length;
		for (var l = 0; l < a; ++l) {
			b.push(false)
		}
	}
	this.checkForAnimation();
	this.CalculateGlobalMatrices(null, null);
	for (g = 0; g < this.AllJoints.length; ++g) {
		d = this.AllJoints[g];
		for (f = 0; f < d.AttachedMeshes.length; ++f) {
			h = this.LocalBuffers[d.AttachedMeshes[f]];
			h.Transformation = new CL3D.Matrix4().setTo(d.GlobalAnimatedMatrix);
		}
	}
	if (this.LocalBuffers.length == 0) {
		this.BoundingBox.MinEdge.set(0, 0, 0);
		this.BoundingBox.MaxEdge.set(0, 0, 0)
	} else {
		h = this.LocalBuffers[0];
		this.BoundingBox.MinEdge.setTo(h.Box.MinEdge);
		this.BoundingBox.MaxEdge.setTo(h.Box.MaxEdge);
		for (g = 1; g < this.LocalBuffers.length; ++g) {
			h = this.LocalBuffers[g];
			if (h.Transformation == null) {
				this.BoundingBox.addInternalPointByVector(h.Box.MinEdge);
				this.BoundingBox.addInternalPointByVector(h.Box.MaxEdge)
			} else {
				_tempB0.setTo(h.Box);
				h.Transformation.transformBoxEx(_tempB0);
				this.BoundingBox.addInternalPointByVector(_tempB0.MinEdge);
				this.BoundingBox.addInternalPointByVector(_tempB0.MaxEdge)
			}
		}
	}
};
CL3D.SkinnedMesh.prototype.checkForAnimation = function () {
	this.HasAnimation = false;
	var f = 0;
	var e = 0;
	var g;
	var c;
	for (f = 0; f < this.AllJoints.length; ++f) {
		c = this.AllJoints[f];
		if (c.PositionKeys.length || c.ScaleKeys.length || c.RotationKeys.length || c.Weights.length) {
			this.HasAnimation = true;
			break
		}
	}
	if (this.HasAnimation) {
		this.AnimationFrames = 0;
		for (f = 0; f < this.AllJoints.length; ++f) {
			c = this.AllJoints[f];
			if (c.PositionKeys.length) {
				var h = c.PositionKeys[c.PositionKeys.length - 1];
				if (h.frame > this.AnimationFrames) {
					this.AnimationFrames = h.frame
				}
			}
			if (c.ScaleKeys.length) {
				var l = c.ScaleKeys[c.ScaleKeys.length - 1];
				if (l.frame > this.AnimationFrames) {
					this.AnimationFrames = l.frame
				}
			}
			if (c.RotationKeys.length) {
				var m = c.RotationKeys[c.RotationKeys.length - 1];
				if (m.frame > this.AnimationFrames) {
					this.AnimationFrames = m.frame
				}
			}
		}
	}
	if (this.HasAnimation && !this.PreparedForSkinning) {
		this.PreparedForSkinning = true;
		for (f = 0; f < this.AllJoints.length; ++f) {
			c = this.AllJoints[f];
			for (e = 0; e < c.Weights.length; ++e) {
				var k = c.Weights[e];
				var d = k.buffer_id;
				var b = k.vertex_id;
				g = this.LocalBuffers[d];
				var a = g.Vertices[b];

				k.StaticPos = new CL3D.Vect3d(a.Pos.X, a.Pos.Y, a.Pos.Z);
				k.StaticNormal.setTo(a.Normal)
			}
		}
	}
};
CL3D.SkinnedMesh.prototype.CalculateGlobalMatrices = function (d, c) {
	if (d == null && c != null) {
		return
	}
	if (d == null) {
		for (var b = 0; b < this.RootJoints.length; ++b) {
			this.CalculateGlobalMatrices(this.RootJoints[b], null)
		}
		return
	}
	if (c == null) {
		d.GlobalMatrix.setTo(d.LocalMatrix)
	} else {
		d.GlobalMatrix.setTo(c.GlobalMatrix).multiplyThisWith(d.LocalMatrix)
	}
	d.LocalAnimatedMatrix.setTo(d.LocalMatrix);
	d.GlobalAnimatedMatrix.setTo(d.GlobalMatrix);
	if (d.GlobalInversedMatrix.isIdentity()) {
		d.GlobalInversedMatrix.setTo(d.GlobalMatrix);
		d.GlobalInversedMatrix.makeInverse()
	}
	for (var a = 0; a < d.Children.length; ++a) {
		this.CalculateGlobalMatrices(d.Children[a], d)
	}
};
CL3D.SkinnedMesh.prototype.animateMesh = function (g, b) {
	if (b == null) {
		b = 1
	}
	if (!this.HasAnimation || this.LastAnimatedFrame == g) {
		return false
	}
	this.LastAnimatedFrame = g;
	if (b <= 0) {
		return false
	}
	for (var d = 0; d < this.AllJoints.length; ++d) {
		var e = this.AllJoints[d];
		_tempV5.setTo(e.Animatedposition);
		_tempV4.setTo(e.Animatedscale);
		_tempQ2.setTo(e.Animatedrotation);
		this.getFrameData(g, e, _tempV5, e.positionHint, _tempV4, e.scaleHint, _tempQ2, e.rotationHint);
		e.Animatedposition.setTo(_tempV5);
		e.Animatedscale.setTo(_tempV4);
		e.Animatedrotation.setTo(_tempQ2);
	}
	this.buildAll_LocalAnimatedMatrices();
	return true
};
CL3D.SkinnedMesh.prototype.getFrameData = function (n, x, v, l, w, r, o, h) {
	var s = -1;
	var m = -1;
	var d = -1;
	var c = x.PositionKeys;
	var t = x.ScaleKeys;
	var a = x.RotationKeys;
	var g;
	var b;
	var q;
	var p;
	var k;
	var j;
	if (c.length) {
		s = -1;
		if (s == -1) {
			for (p = 0; p < c.length; ++p) {
				g = c[p];
				if (g.frame >= n) {
					s = p;
					l = p;
					break
				}
			}
		}
		if (s != -1) {
			if (this.InterpolationMode == 0 || s == 0) {
				g = c[s];
				v.setTo(g.position);
			} else {
				if (this.InterpolationMode == 1) {
					g = c[s];
					var f = c[s - 1];
					k = n - g.frame;
					j = f.frame - n;
					v.setTo(f.position).substractFromThis(g.position).multiplyThisWithScal(1 / (k + j)).multiplyThisWithScal(k).addToThis(g.position);
				}
			}
		}
	}
	if (t.length) {
		m = -1;
		if (m == -1) {
			for (p = 0; p < t.length; ++p) {
				b = t[p];
				if (b.frame >= n) {
					m = p;
					r = p;
					break
				}
			}
		}
		if (m != -1) {
			if (this.InterpolationMode == 0 || m == 0) {
				b = t[m];
				w.setTo(b.scale)
			} else {
				if (this.InterpolationMode == 1) {
					b = t[m];
					var u = t[m - 1];
					k = n - b.frame;
					j = u.frame - n;
					w.setTo(u.scale).substractFromThis(b.scale).multiplyThisWithScal(1 / (k + j)).multiplyThisWithScal(k).addToThis(b.scale);
				}
			}
		}
	}
	if (a.length) {
		d = -1;
		if (d == -1) {
			for (p = 0; p < a.length; ++p) {
				q = a[p];
				if (q.frame >= n) {
					d = p;
					h = p;
					break
				}
			}
		}
		if (d != -1) {
			if (this.InterpolationMode == 0 || d == 0) {
				q = a[d];
				o.setTo(q.rotation);
			} else {
				if (this.InterpolationMode == 1) {
					q = a[d];
					var e = a[d - 1];
					k = n - q.frame;
					j = e.frame - n;
					o.slerp(q.rotation, e.rotation, k / (k + j))
				}
			}
		}
	}
};
CL3D.SkinnedMesh.prototype.buildAll_LocalAnimatedMatrices = function () {
	for (var b = 0; b < this.AllJoints.length; ++b) {
		var d = this.AllJoints[b];
		if (d.PositionKeys.length || d.ScaleKeys.length || d.RotationKeys.length) {
			if (!d.Animatedrotation) {
				d.Animatedrotation = new CL3D.Quaternion()
			}
			if (!d.Animatedposition) {
				d.Animatedposition = new CL3D.Vect3d()
			}
			d.LocalAnimatedMatrix = d.Animatedrotation.getMatrix();
			var a = d.LocalAnimatedMatrix;
			var c = d.Animatedposition;
			a.m00 += c.X * a.m03;
			a.m01 += c.Y * a.m03;
			a.m02 += c.Z * a.m03;
			a.m04 += c.X * a.m07;
			a.m05 += c.Y * a.m07;
			a.m06 += c.Z * a.m07;
			a.m08 += c.X * a.m11;
			a.m09 += c.Y * a.m11;
			a.m10 += c.Z * a.m11;
			a.m12 += c.X * a.m15;
			a.m13 += c.Y * a.m15;
			a.m14 += c.Z * a.m15;
			a.bIsIdentity = false;
			d.GlobalSkinningSpace = false;
			if (d.ScaleKeys.length && d.Animatedscale && !d.Animatedscale.equalsByNumbers(1, 1, 1)) {
				c = d.Animatedscale;
				a.m00 *= c.X;
				a.m01 *= c.X;
				a.m02 *= c.X;
				a.m03 *= c.X;
				a.m04 *= c.Y;
				a.m05 *= c.Y;
				a.m06 *= c.Y;
				a.m07 *= c.Y;
				a.m08 *= c.Z;
				a.m09 *= c.Z;
				a.m10 *= c.Z;
				a.m11 *= c.Z
			}
		} else {
			d.LocalAnimatedMatrix.setTo(d.LocalMatrix);
		}
	}
};
CL3D.SkinnedMesh.prototype.updateBoundingBox = function () {
	this.BoundingBox.MinEdge.set(0, 0, 0);
	this.BoundingBox.MaxEdge.set(0, 0, 0);
	if (this.LocalBuffers.length) {
		var a = this.LocalBuffers[0];
		a.recalculateBoundingBox();
		this.BoundingBox.MinEdge.setTo(a.Box.MinEdge);
		this.BoundingBox.MaxEdge.setTo(a.Box.MaxEdge);
		for (var c = 1; c < this.LocalBuffers.length; ++c) {
			a = this.LocalBuffers[c];
			a.recalculateBoundingBox();
			if (a.Transformation == null) {
				this.BoundingBox.addInternalPointByVector(a.Box.MinEdge);
				this.BoundingBox.addInternalPointByVector(a.Box.MaxEdge)
			} else {
				_tempB0.setTo(a.Box);
				a.Transformation.transformBoxEx(_tempB0);
				this.BoundingBox.addInternalPointByVector(_tempB0.MinEdge);
				this.BoundingBox.addInternalPointByVector(_tempB0.MaxEdge)
			}
		}
	}
};
CL3D.SkinnedMesh.prototype.buildAll_GlobalAnimatedMatrices = function (e, d) {
	if (e == null) {
		for (var c = 0; c < this.RootJoints.length; ++c) {
			var a = this.RootJoints[c];
			this.buildAll_GlobalAnimatedMatrices(a, null)
		}
		return
	} else {
		if (d == null || e.GlobalSkinningSpace) {
			e.GlobalAnimatedMatrix.setTo(e.LocalAnimatedMatrix);
		} else {
			e.GlobalAnimatedMatrix.setTo(d.GlobalAnimatedMatrix).multiplyThisWith(e.LocalAnimatedMatrix);
		}
	}
	for (var b = 0; b < e.Children.length; ++b) {
		this.buildAll_GlobalAnimatedMatrices(e.Children[b], e)
	}
};
CL3D.SkinnedMesh.prototype.skinMesh = function () {
	if (!this.HasAnimation) {
		return
	}
	this.buildAll_GlobalAnimatedMatrices(null, null);
	var e = 0;
	var d = 0;
	for (e = 0; e < this.AllJoints.length; ++e) {
		var f = this.AllJoints[e];
		for (d = 0; d < f.AttachedMeshes.length; ++d) {
			if (!this.LocalBuffers[f.AttachedMeshes[d]].Transformation)
				this.LocalBuffers[f.AttachedMeshes[d]].Transformation = new CL3D.Matrix4();

			this.LocalBuffers[f.AttachedMeshes[d]].Transformation.setTo(f.GlobalAnimatedMatrix);
		}
	}
	for (e = 0; e < this.LocalBuffers.length; ++e) {
		var c = this.Vertices_Moved[e];
		for (d = 0; d < c.length; ++d) {
			c[d] = false
		}
	}
	for (e = 0; e < this.RootJoints.length; ++e) {
		var a = this.RootJoints[e];
		this.skinJoint(a, null)
	}
};
CL3D.SkinnedMesh.prototype.skinJoint = function (e, b) {
	if (e.Weights.length) {
		var f = this.LocalBuffers;
		var l;
		var a;
		_tempM0.setTo(e.GlobalAnimatedMatrix).multiplyThisWith(e.GlobalInversedMatrix);
		for (var h = 0; h < e.Weights.length; ++h) {
			var k = e.Weights[h];
			_tempM0.transformVect2(_tempV0, k.StaticPos);
			l = f[k.buffer_id];
			a = l.Vertices[k.vertex_id];
			if (!this.Vertices_Moved[k.buffer_id][k.vertex_id]) {
				this.Vertices_Moved[k.buffer_id][k.vertex_id] = true;
				a.Pos.setTo(_tempV0.multiplyThisWithScal(k.strength));
			} else {
				a.Pos.addToThis(_tempV0.multiplyThisWithScal(k.strength))
			}
		}
	}
	for (var g = 0; g < e.Children.length; ++g) {
		this.skinJoint(e.Children[g], e)
	}
};
CL3D.SkinnedMesh.prototype.getNamedAnimationRangeByName = function (e) {
	if (!e) {
		return null
	}
	var b = this.NamedAnimationRanges.length;
	var c = e.toLowerCase();
	for (var a = 0; a < b; ++a) {
		var d = this.NamedAnimationRanges[a];
		if (d.Name && d.Name.toLowerCase() == c) {
			return d
		}
	}
	return null
};
CL3D.SkinnedMesh.prototype.addNamedAnimationRange = function (a) {
	this.NamedAnimationRanges.push(a)
};
CL3D.TextureManager = function () {
	this.Textures = new Array();
	this.TheRenderer = null;
	this.PathRoot = ""
};
CL3D.TextureManager.prototype.getTexture = function (b, a) {
	if (b == null || b == "") {
		return null
	}
	var c = this.getTextureFromName(b);
	if (c != null) {
		return c
	}
	if (a) {
		c = new CL3D.Texture();
		c.Name = b;
		this.addTexture(c);
		var d = this;
		c.Image = new Image();
		c.Image.onload = function () {
			d.onTextureLoaded(c)
		};
		c.Image.onerror = function () {
			console.error("Error: couldn't download texture '"+c.Name+"'\n(if your Internet connection is slow, try reloading the page)");
		};
		c.Image.src = c.Name;
		return c
	}
	return null
};
CL3D.TextureManager.prototype.getTextureCount = function () {
	return this.Textures.length
};
CL3D.TextureManager.prototype.onTextureLoaded = function (a) {
	var b = this.TheRenderer;
	if (b == null) {
		return
	}
	b.finalizeLoadedImageTexture(a);
	a.Loaded = true
};
CL3D.TextureManager.prototype.getCountOfTexturesToLoad = function () {
	var a = 0;
	for (var c = 0; c < this.Textures.length; ++c) {
		var b = this.Textures[c];
		if (b.Loaded == false) {
			++a
		}
	}
	return a
};
CL3D.TextureManager.prototype.getTextureFromName = function (a) {
	for (var c = 0; c < this.Textures.length; ++c) {
		var b = this.Textures[c];
		if (b.Name == a) {
			return b
		}
	}
	return null
};
CL3D.TextureManager.prototype.addTexture = function (a) {
	if (a != null) {
		if (this.getTextureFromName(a.Name) != null) {
			CL3D.gCCDebugOutput.print("ERROR! Cannot add the texture multiple times: " + a.Name)
		}
		this.Textures.push(a)
	}
};
CL3D.BinaryStream = function (a) {
	this._buffer = a;
	this._length = a.length;
	this._offset = 0;
	this._bitBuffer = null;
	this._bitOffset = 8;
	this.bigEndian = false
};
CL3D.BinaryStream.prototype.bytesAvailable = function () {
	return this._length - this._offset
};
CL3D.BinaryStream.prototype.getPosition = function () {
	return this._offset
};
CL3D.BinaryStream.prototype.readInt = function () {
	return this.readSI32()
};
CL3D.BinaryStream.prototype.readByte = function () {
	return this.readSI8()
};
CL3D.BinaryStream.prototype.readByteAt = function (a) {
	return this._buffer.charCodeAt(a) & 255
};
CL3D.BinaryStream.prototype.readBoolean = function () {
	return this.readSI8() != 0
};
CL3D.BinaryStream.prototype.readShort = function () {
	return this.readUnsignedShort()
};
CL3D.BinaryStream.prototype.readNumber = function (a) {
	var c = 0;
	var d = this._offset;
	var b = d + a;
	while (b > d) {
		c = c * 256 + this.readByteAt(--b)
	}
	this._offset += a;
	return c
};
CL3D.BinaryStream.prototype.readSNumber = function (b) {
	var c = this.readNumber(b);
	var a = 1 << (b * 8 - 1);
	if (c & a) {
		c = (~c + 1) * -1
	}
	return c
};
CL3D.BinaryStream.prototype.readUnsignedShort = function () {
	return this.readUI16()
};
CL3D.BinaryStream.prototype.readUnsignedInt = function () {
	return this.readUI32()
};
CL3D.BinaryStream.prototype.readSI8 = function () {
	return this.readSNumber(1)
};
CL3D.BinaryStream.prototype.readSI16 = function () {
	return this.readSNumber(2)
};
CL3D.BinaryStream.prototype.readSI32 = function () {
	return this.readSNumber(4)
};
CL3D.BinaryStream.prototype.readUI8 = function () {
	return this.readNumber(1)
};
CL3D.BinaryStream.prototype.readUI16 = function () {
	return this.readNumber(2)
};
CL3D.BinaryStream.prototype.readUI24 = function () {
	return this.readNumber(3)
};
CL3D.BinaryStream.prototype.readUI32 = function () {
	return this.readNumber(4)
};
CL3D.BinaryStream.prototype.readFixed = function () {
	return this._readFixedPoint(32, 16)
};
CL3D.BinaryStream.prototype.readFixed8 = function () {
	return this._readFixedPoint(16, 8)
};
CL3D.BinaryStream.prototype._readFixedPoint = function (c, a) {
	var b = this.readSB(c);
	b = b * Math.pow(2, -a);
	return b
};
CL3D.BinaryStream.prototype.readFloat16 = function () {
	return this.decodeFloat32fast(5, 10)
};
CL3D.BinaryStream.prototype.readFloat = function () {
	var a = this.decodeFloat32fast(this._buffer, this._offset);
	this._offset += 4;
	return a
};
CL3D.BinaryStream.prototype.readDouble = function () {
	var a = this._buffer.substring(this._offset, this._offset + 8);
	var b = this.decodeFloat(a, 52, 11);
	this._offset += 8;
	return b
};
CL3D.BinaryStream.prototype.decodeFloat32fast = function (d, c) {
	var h = d.charCodeAt(c + 3) & 255,
		g = d.charCodeAt(c + 2) & 255,
		f = d.charCodeAt(c + 1) & 255,
		e = d.charCodeAt(c + 0) & 255;
	var a = 1 - (2 * (h >> 7));
	var b = (((h << 1) & 255) | (g >> 7)) - 127;
	var i = ((g & 127) << 16) | (f << 8) | e;
	if (i == 0 && b == -127) {
		return 0
	}
	return a * (1 + i * Math.pow(2, -23)) * Math.pow(2, b)
};
CL3D.BinaryStream.prototype.decodeFloat = function (f, c, n) {
	var l = ((l = new this.Buffer(this.bigEndian, f)), l),
		g = Math.pow(2, n - 1) - 1,
		j = l.readBits(c + n, 1),
		k = l.readBits(c, n),
		i = 0,
		d = 2,
		a = l.buffer.length + (-c >> 3) - 1,
		e, h, m;
	do {
		for (e = l.buffer[++a], h = c % 8 || 8, m = 1 << h; m >>= 1;
			(e & m) && (i += 1 / d), d *= 2) {}
	} while (c -= h);
	return k == (g << 1) + 1 ? i ? NaN : j ? -Infinity : +Infinity : (1 + j * -2) * (k || i ? !k ? Math.pow(2, -g + 1) * i : Math.pow(2, k - g) * (1 + i) : 0)
};
CL3D.BinaryStream.prototype.Buffer = function (b, a) {
	this.bigEndian = b || 0, this.buffer = [], this.setBuffer(a)
};
CL3D.BinaryStream.prototype.Buffer.prototype.readBits = function (b, d) {
	function c(k, j) {
		for (++j; --j; k = ((k %= 2147483647 + 1) & 1073741824) == 1073741824 ? k * 2 : (k - 1073741824) * 2 + 2147483647 + 1) {}
		return k
	}
	if (b < 0 || d <= 0) {
		return 0
	}
	for (var e, f = b % 8, a = this.buffer.length - (b >> 3) - 1, i = this.buffer.length + (-(b + d) >> 3), h = a - i, g = ((this.buffer[a] >> f) & ((1 << (h ? 8 - f : d)) - 1)) + (h && (e = (b + d) % 8) ? (this.buffer[i++] & ((1 << e) - 1)) << (h-- << 3) - f : 0); h; g += c(this.buffer[i++], (h-- << 3) - f)) {}
	return g
};
CL3D.BinaryStream.prototype.Buffer.prototype.setBuffer = function (e) {
	if (e) {
		for (var c, d = c = e.length, a = this.buffer = new Array(c); d; a[c - d] = e.charCodeAt(--d)) {}
		this.bigEndian && a.reverse()
	}
};
CL3D.BinaryStream.prototype.Buffer.prototype.hasNeededBits = function (a) {
	return this.buffer.length >= -(-a >> 3)
};
CL3D.BinaryStream.prototype.readSB = function (c) {
	var b = this.readUB(c);
	var a = 1 << (c - 1);
	if (b & a) {
		b -= Math.pow(2, c)
	}
	return b
};
CL3D.BinaryStream.prototype.readUB = function (e) {
	var d = 0;
	var c = this;
	var b = e;
	while (b--) {
		if (c._bitOffset == 8) {
			c._bitBuffer = c.readUI8();
			c._bitOffset = 0
		}
		var a = 128 >> c._bitOffset;
		d = d * 2 + (c._bitBuffer & a ? 1 : 0);
		c._bitOffset++
	}
	return d
};
CL3D.BinaryStream.prototype.readFB = function (a) {
	return this._readFixedPoint(a, 16)
};
CL3D.BinaryStream.prototype.readString = function (d) {
	var c = [];
	var a = d || this._length - this._offset;
	while (a--) {
		var b = this.readNumber(1);
		if (d || b) {
			c.push(String.fromCharCode(b))
		} else {
			break
		}
	}
	return c.join("")
};
CL3D.BinaryStream.prototype.readBool = function (a) {
	return !!this.readUB(a || 1)
};
CL3D.BinaryStream.prototype.tell = function () {
	return this._offset
};
CL3D.BinaryStream.prototype.seek = function (a, b) {
	this._offset = (b ? 0 : this._offset) + a;
	return this
};
CL3D.BinaryStream.prototype.reset = function () {
	this._offset = 0;
	return this
};
CL3D.Renderer = function () {
	this.canvas = null;
	this.gl = null;
	this.width = 0;
	this.height = 0;
	this.textureWasLoadedFlag = false;
	this.Projection = new CL3D.Matrix4();
	this.View = new CL3D.Matrix4();
	this.World = new CL3D.Matrix4();
	this.AmbientLight = new CL3D.ColorF();
	this.AmbientLight.R = 0;
	this.AmbientLight.G = 0;
	this.AmbientLight.B = 0;
	this.programStandardMaterial = null;
	this.programLightmapMaterial = null;
	this.MaterialPrograms = new Array();
	this.MaterialProgramsWithLight = new Array();
	this.MinExternalMaterialTypeId = 20;
	this.Program2DDrawingColorOnly = null;
	this.Program2DDrawingTextureOnly = null;
	this.Program2DDrawingCanvasFontColor = null;
	this.OnChangeMaterial = null;
	this.StaticBillboardMeshBuffer = null;
	this.Lights = new Array();
	this.currentGLProgram = null;
	this.firefox5BugPrinted = false
};
CL3D.Renderer.prototype.OnChangeMaterial = null;
CL3D.Renderer.prototype.getWidth = function () {
	return this.width
};
CL3D.Renderer.prototype.getAndResetTextureWasLoadedFlag = function () {
	var a = this.textureWasLoadedFlag;
	this.textureWasLoadedFlag = false;
	return a
};
CL3D.Renderer.prototype.getWebGL = function () {
	return this.gl
};
CL3D.Renderer.prototype.getHeight = function () {
	return this.height
};
CL3D.Renderer.prototype.registerFrame = function () {};
CL3D.Renderer.prototype.drawMesh = function (c) {
	if (c == null) {
		return
	}
	for (var b = 0; b < c.MeshBuffers.length; ++b) {
		var a = c.MeshBuffers[b];
		this.setMaterial(a.Mat);
		this.drawMeshBuffer(a)
	}
};
CL3D.Renderer.prototype.setMaterial = function (b) {
	if (b == null) {
		return
	}
	var d = this.gl;
	if (d == null) {
		return
	}
	var a = null;
	try {
		if (b.Lighting) {
			a = this.MaterialProgramsWithLight[b.Type]
		} else {
			a = this.MaterialPrograms[b.Type]
		}
	} catch (c) {}
	if (a == null) {
		return
	}
	this.currentGLProgram = a;
	d.useProgram(a);
	if (this.OnChangeMaterial != null) {
		try {
			this.OnChangeMaterial(b.Type)
		} catch (c) {}
	}
	if (a.blendenabled) {
		d.enable(d.BLEND);
		d.blendFunc(a.blendsfactor, a.blenddfactor)
	} else {
		d.disable(d.BLEND)
	} if (!b.ZWriteEnabled || b.isTransparent()) {
		d.depthMask(false)
	} else {
		d.depthMask(true)
	} if (b.ZReadEnabled) {
		d.enable(d.DEPTH_TEST)
	} else {
		d.disable(d.DEPTH_TEST)
	} if (b.BackfaceCulling) {
		d.enable(d.CULL_FACE)
	} else {
		d.disable(d.CULL_FACE)
	} if (b.Tex1 && b.Tex1.Loaded) {
		d.activeTexture(d.TEXTURE0);
		d.bindTexture(d.TEXTURE_2D, b.Tex1.Texture);
		d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_S, b.ClampTexture1 ? d.CLAMP_TO_EDGE : d.REPEAT);
		d.texParameteri(d.TEXTURE_2D, d.TEXTURE_WRAP_T, b.ClampTexture1 ? d.CLAMP_TO_EDGE : d.REPEAT)
	} else {
		d.activeTexture(d.TEXTURE0);
		d.bindTexture(d.TEXTURE_2D, null)
	}
	d.uniform1i(d.getUniformLocation(a, "texture1"), 0);
	if (b.Tex2 && b.Tex2.Loaded) {
		d.activeTexture(d.TEXTURE1);
		d.bindTexture(d.TEXTURE_2D, b.Tex2.Texture)
	} else {
		d.activeTexture(d.TEXTURE1);
		d.bindTexture(d.TEXTURE_2D, null)
	}
	d.uniform1i(d.getUniformLocation(a, "texture2"), 1)
};
CL3D.Renderer.prototype.drawMeshBuffer = function (a) {
	if (a == null || this.gl == null) {
		return
	}

	if (a.RendererNativeArray == null) {
		this.createRendererNativeArray(a)
	} else {
		if (a.OnlyPositionsChanged) {
			this.updatePositionsInRendererNativeArray(a)
		}
	}

	this.drawWebGlStaticGeometry(a.RendererNativeArray)
};
CL3D.Renderer.prototype.updatePositionsInRendererNativeArray = function (c) {
	if (c.RendererNativeArray != null) {
		var f = this.gl;
		var a = c.Vertices.length;
		var e = c.RendererNativeArray.positionsArray;
		var d = a;
		var b;
		while (d--) {
			b = c.Vertices[d].Pos;
			e[d * 3 + 0] = b.X;
			e[d * 3 + 1] = b.Y;
			e[d * 3 + 2] = b.Z
		}
		f.bindBuffer(f.ARRAY_BUFFER, c.RendererNativeArray.positionBuffer);
		f.bufferSubData(f.ARRAY_BUFFER, 0, e)
	}
};
CL3D.Renderer.prototype.createRendererNativeArray = function (a) {
	if (a.RendererNativeArray == null) {
		var g = this.gl;
		var f = new Object();
		var h = a.Vertices.length;
		var k = new Float32Array(h * 3);

		if (!a.b){
			a.b = new Float32Array(h * 3);
			a.l = new Float32Array(h * 2);
			a.c = new Float32Array(h * 2);
			a.p = new Float32Array(h * 3);
			a.n = new WebGLUnsignedShortArray(a.Indices.length);
		}

		for (var e = 0; e < h; ++e) {
			var o = a.Vertices[e];
			k[e * 3 + 0] = o.Pos.X;
			k[e * 3 + 1] = o.Pos.Y;
			k[e * 3 + 2] = o.Pos.Z;
			a.b[e * 3 + 0] = o.Normal.X;
			a.b[e * 3 + 1] = o.Normal.Y;
			a.b[e * 3 + 2] = o.Normal.Z;
			a.l[e * 2 + 0] = o.TCoords.X;
			a.l[e * 2 + 1] = o.TCoords.Y;
			a.c[e * 2 + 0] = o.TCoords2.X;
			a.c[e * 2 + 1] = o.TCoords2.Y;
			a.p[e * 3 + 0] = CL3D.getRed(o.Color) / 255;
			a.p[e * 3 + 1] = CL3D.getGreen(o.Color) / 255;
			a.p[e * 3 + 2] = CL3D.getBlue(o.Color) / 255
		}
		var m = a.Indices.length;
		for (var d = 0; d < m; d += 3) {
			a.n[d + 0] = a.Indices[d + 0];
			a.n[d + 1] = a.Indices[d + 2];
			a.n[d + 2] = a.Indices[d + 1]
		}
		f.positionBuffer = g.createBuffer();
		g.bindBuffer(g.ARRAY_BUFFER, f.positionBuffer);
		g.bufferData(g.ARRAY_BUFFER, k, g.DYNAMIC_DRAW);
		f.positionsArray = k;
		f.texcoordsBuffer = g.createBuffer();
		g.bindBuffer(g.ARRAY_BUFFER, f.texcoordsBuffer);
		g.bufferData(g.ARRAY_BUFFER, a.l, g.STATIC_DRAW);
		f.texcoordsBuffer2 = g.createBuffer();
		g.bindBuffer(g.ARRAY_BUFFER, f.texcoordsBuffer2);
		g.bufferData(g.ARRAY_BUFFER, a.c, g.STATIC_DRAW);
		f.normalBuffer = g.createBuffer();
		g.bindBuffer(g.ARRAY_BUFFER, f.normalBuffer);
		g.bufferData(g.ARRAY_BUFFER, a.b, g.STATIC_DRAW);
		g.bindBuffer(g.ARRAY_BUFFER, null);
		f.colorBuffer = g.createBuffer();
		g.bindBuffer(g.ARRAY_BUFFER, f.colorBuffer);
		g.bufferData(g.ARRAY_BUFFER, a.p, g.STATIC_DRAW);
		g.bindBuffer(g.ARRAY_BUFFER, null);
		f.indexBuffer = g.createBuffer();
		g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, f.indexBuffer);
		g.bufferData(g.ELEMENT_ARRAY_BUFFER, a.n, g.STATIC_DRAW);
		f.indexCount = m;
		g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, null);
		f.gl = g;
		a.RendererNativeArray = f;
		a.OnlyPositionsChanged = false
	}
};
CL3D.Renderer.prototype.drawWebGlStaticGeometry = function (a) {
	var g = this.gl;
	g.enableVertexAttribArray(0);
	g.enableVertexAttribArray(1);
	g.enableVertexAttribArray(2);
	g.enableVertexAttribArray(3);
	g.enableVertexAttribArray(4);
	g.bindBuffer(g.ARRAY_BUFFER, a.positionBuffer);
	g.vertexAttribPointer(0, 3, g.FLOAT, false, 0, 0);
	g.bindBuffer(g.ARRAY_BUFFER, a.texcoordsBuffer);
	g.vertexAttribPointer(1, 2, g.FLOAT, false, 0, 0);
	g.bindBuffer(g.ARRAY_BUFFER, a.texcoordsBuffer2);
	g.vertexAttribPointer(2, 2, g.FLOAT, false, 0, 0);
	g.bindBuffer(g.ARRAY_BUFFER, a.normalBuffer);
	g.vertexAttribPointer(3, 3, g.FLOAT, false, 0, 0);
	g.bindBuffer(g.ARRAY_BUFFER, a.colorBuffer);
	g.vertexAttribPointer(4, 3, g.FLOAT, false, 0, 0);
	g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, a.indexBuffer);

	_tempM0.resetToZero();
	this.Projection.copyTo(_tempM0);
	_tempM0.multiplyThisWith(this.View);
	_tempM0.multiplyThisWith(this.World);
	var c = this.currentGLProgram;
	if (c.locWorldViewProj != null) {
		g.uniformMatrix4fv(c.locWorldViewProj, false, this.getMatrixAsWebGLFloatArray(_tempM0))
	}
	if (c.locNormalMatrix != null) {
		_tempM0.makeIdentity();
		_tempM0.multiplyThisWith(this.View);
		_tempM0.multiplyThisWith(this.World);
		_tempM0.makeInverse();
		g.uniformMatrix4fv(c.locNormalMatrix, true, this.getMatrixAsWebGLFloatArray(_tempM0))
	}
	if (c.locModelViewMatrix != null) {
		_tempM0.makeIdentity();
		_tempM0.multiplyThisWith(this.View);
		_tempM0.multiplyThisWith(this.World);
		g.uniformMatrix4fv(c.locModelViewMatrix, false, this.getMatrixAsWebGLFloatArray(_tempM0))
	}
	if (c.locLightPositions != null) {
		this.setDynamicLightsIntoConstants(c)
	}
	g.drawElements(g.TRIANGLES, a.indexCount, g.UNSIGNED_SHORT, 0)
};
CL3D.Renderer.prototype.setDynamicLightsIntoConstants = function (e) {
	var b = new ArrayBuffer(4 * 4 * Float32Array.BYTES_PER_ELEMENT);
	var f = new Float32Array(b);
	var a = new ArrayBuffer(5 * 4 * Float32Array.BYTES_PER_ELEMENT);
	var h = new Float32Array(a);
	var k = new CL3D.Matrix4(true);
	if (this.Lights != null && this.Lights.length > 0) {
		this.World.getInverse(k)
	}
	for (var d = 0; d < 4; ++d) {
		var g = d * 4;
		if (this.Lights != null && d < this.Lights.length) {
			var c = this.Lights[d];
			var j = k.getTransformedVect(c.Position);
			f[g] = j.X;
			f[g + 1] = j.Y;
			f[g + 2] = j.Z;
			f[g + 3] = c.Attenuation;
			h[g] = c.Color.R;
			h[g + 1] = c.Color.G;
			h[g + 2] = c.Color.B;
			h[g + 3] = 1
		} else {
			f[g] = 1;
			f[g + 1] = 0;
			f[g + 2] = 0;
			f[g + 3] = 0.1;
			h[g] = 0;
			h[g + 1] = 0;
			h[g + 2] = 0;
			h[g + 3] = 1
		}
	}
	h[16] = this.AmbientLight.R;
	h[17] = this.AmbientLight.G;
	h[18] = this.AmbientLight.B;
	h[19] = 1;
	this.gl.uniform4fv(e.locLightPositions, f);
	this.gl.uniform4fv(e.locLightColors, h)
};
CL3D.Renderer.prototype.draw3DLine = function (b, a) {};
CL3D.Renderer.prototype.draw2DRectangle = function (j, h, a, o, b, e) {
	if (a <= 0 || o <= 0 || this.width == 0 || this.height == 0) {
		return
	}
	var m = true;
	if (e == null || e == false) {
		m = false
	}
	var d = this.gl;
	d.enableVertexAttribArray(0);
	d.disableVertexAttribArray(1);
	d.disableVertexAttribArray(2);
	d.disableVertexAttribArray(3);
	d.disableVertexAttribArray(4);
	h = this.height - h;
	var n = 2 / this.width;
	var l = 2 / this.height;
	j = (j * n) - 1;
	h = (h * l) - 1;
	a *= n;
	o *= l;
	var g = new Float32Array(4 * 3);
	g[0] = j;
	g[1] = h;
	g[2] = 0;
	g[3] = j + a;
	g[4] = h;
	g[5] = 0;
	g[6] = j + a;
	g[7] = h - o;
	g[8] = 0;
	g[9] = j;
	g[10] = h - o;
	g[11] = 0;
	var i = 6;
	var k = new WebGLUnsignedShortArray(i);
	k[0] = 0;
	k[1] = 2;
	k[2] = 1;
	k[3] = 0;
	k[4] = 3;
	k[5] = 2;
	var f = d.createBuffer();
	d.bindBuffer(d.ARRAY_BUFFER, f);
	d.bufferData(d.ARRAY_BUFFER, g, d.STATIC_DRAW);
	d.vertexAttribPointer(0, 3, d.FLOAT, false, 0, 0);
	var c = d.createBuffer();
	d.bindBuffer(d.ELEMENT_ARRAY_BUFFER, c);
	d.bufferData(d.ELEMENT_ARRAY_BUFFER, k, d.STATIC_DRAW);
	this.currentGLProgram = this.Program2DDrawingColorOnly;
	d.useProgram(this.currentGLProgram);
	d.uniform4f(d.getUniformLocation(this.currentGLProgram, "vColor"), CL3D.getRed(b) / 255, CL3D.getGreen(b) / 255, CL3D.getBlue(b) / 255, m ? (CL3D.getAlpha(b) / 255) : 1);
	d.depthMask(false);
	d.disable(d.DEPTH_TEST);
	if (!m) {
		d.disable(d.BLEND)
	} else {
		d.enable(d.BLEND);
		d.blendFunc(d.SRC_ALPHA, d.ONE_MINUS_SRC_ALPHA)
	}
	d.drawElements(d.TRIANGLES, i, d.UNSIGNED_SHORT, 0);
	d.deleteBuffer(f);
	d.deleteBuffer(c)
};
CL3D.Renderer.prototype.draw2DImage = function (h, g, l, k, s, n, t, j, d) {
	if (s == null || s.isLoaded() == false || l <= 0 || k <= 0 || this.width == 0 || this.height == 0) {
		return
	}
	if (j == null) {
		j = 1
	}
	if (d == null) {
		d = 1
	}
	var f = true;
	if (n == null || n == false) {
		f = false
	}
	var o = this.gl;
	o.enableVertexAttribArray(0);
	o.enableVertexAttribArray(1);
	o.disableVertexAttribArray(2);
	o.disableVertexAttribArray(3);
	o.disableVertexAttribArray(4);
	g = this.height - g;
	var e = 2 / this.width;
	var r = 2 / this.height;
	h = (h * e) - 1;
	g = (g * r) - 1;
	l *= e;
	k *= r;
	var p = new Float32Array(4 * 3);
	p[0] = h;
	p[1] = g;
	p[2] = 0;
	p[3] = h + l;
	p[4] = g;
	p[5] = 0;
	p[6] = h + l;
	p[7] = g - k;
	p[8] = 0;
	p[9] = h;
	p[10] = g - k;
	p[11] = 0;
	var i = new Float32Array(4 * 2);
	i[0] = 0;
	i[1] = 0;
	i[2] = j;
	i[3] = 0;
	i[4] = j;
	i[5] = d;
	i[6] = 0;
	i[7] = d;
	var a = 6;
	var b = new WebGLUnsignedShortArray(a);
	b[0] = 0;
	b[1] = 2;
	b[2] = 1;
	b[3] = 0;
	b[4] = 3;
	b[5] = 2;
	var m = o.createBuffer();
	o.bindBuffer(o.ARRAY_BUFFER, m);
	o.bufferData(o.ARRAY_BUFFER, p, o.STATIC_DRAW);
	o.vertexAttribPointer(0, 3, o.FLOAT, false, 0, 0);
	var q = o.createBuffer();
	o.bindBuffer(o.ARRAY_BUFFER, q);
	o.bufferData(o.ARRAY_BUFFER, i, o.STATIC_DRAW);
	o.vertexAttribPointer(1, 2, o.FLOAT, false, 0, 0);
	var c = o.createBuffer();
	o.bindBuffer(o.ELEMENT_ARRAY_BUFFER, c);
	o.bufferData(o.ELEMENT_ARRAY_BUFFER, b, o.STATIC_DRAW);
	if (t == null) {
		this.currentGLProgram = this.Program2DDrawingTextureOnly
	} else {
		this.currentGLProgram = t
	}
	o.useProgram(this.currentGLProgram);
	o.depthMask(false);
	o.disable(o.DEPTH_TEST);
	if (!f) {
		o.disable(o.BLEND)
	} else {
		o.enable(o.BLEND);
		o.blendFunc(o.SRC_ALPHA, o.ONE_MINUS_SRC_ALPHA)
	}
	o.activeTexture(o.TEXTURE0);
	o.bindTexture(o.TEXTURE_2D, s.getWebGLTexture());
	o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, o.CLAMP_TO_EDGE);
	o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, o.CLAMP_TO_EDGE);
	o.activeTexture(o.TEXTURE1);
	o.bindTexture(o.TEXTURE_2D, null);
	o.drawElements(o.TRIANGLES, a, o.UNSIGNED_SHORT, 0);
	o.deleteBuffer(q);
	o.deleteBuffer(m);
	o.deleteBuffer(c)
};
CL3D.Renderer.prototype.draw2DFontImage = function (b, h, e, a, d, c) {
	if (d == null || d.isLoaded() == false || e <= 0 || a <= 0 || this.width == 0 || this.height == 0) {
		return
	}
	var g = true;
	var f = this.gl;
	this.currentGLProgram = this.Program2DDrawingCanvasFontColor;
	f.useProgram(this.currentGLProgram);
	f.uniform4f(f.getUniformLocation(this.currentGLProgram, "vColor"), CL3D.getRed(c) / 255, CL3D.getGreen(c) / 255, CL3D.getBlue(c) / 255, g ? (CL3D.getAlpha(c) / 255) : 1);
	this.draw2DImage(b, h, e, a, d, g, this.Program2DDrawingCanvasFontColor, d.OriginalWidth / d.CachedWidth, d.OriginalHeight / d.CachedHeight)
};
CL3D.Renderer.prototype.beginScene = function (a) {
	if (this.gl == null) {
		return
	}
	this.ensuresizeok();
	var b = this.gl;
	b.depthMask(true);
	b.clearColor(CL3D.getRed(a) / 255, CL3D.getGreen(a) / 255, CL3D.getBlue(a) / 255, 1);
	b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT)
};
CL3D.Renderer.prototype.endScene = function () {
	if (this.gl == null) {
		return
	}
	var a = this.gl;
	a.flush()
};
CL3D.Renderer.prototype.clearDynamicLights = function () {
	this.Lights = new Array()
};
CL3D.Renderer.prototype.addDynamicLight = function (a) {
	this.Lights.push(a)
};
CL3D.Renderer.prototype.ensuresizeok = function () {
	if (this.canvas == null || this.gl == null) {
		return
	}
	if (this.width == this.canvas.width && this.height == this.canvas.height) {
		return
	}
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	var a = this.gl;
	if (a.viewport) {
		a.viewport(0, 0, this.width, this.height)
	}
};
CL3D.Renderer.prototype.init = function (a) {
	this.canvas = a;
	this.gl = null;
	try {
		var d = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d", "3d"];
		for (var b = 0; b < d.length; b++) {
			try {
				this.gl = this.canvas.getContext(d[b]);
				if (this.gl != null) {
					break
				}
			} catch (c) {}
		}
	} catch (c) {}
	if (this.gl == null) {
		CL3D.gCCDebugOutput.printError("Error: Sorry, this browser does not support WebGL (or it is disabled).");
		return false
	} else {
		this.removeCompatibilityProblems();
		this.ensureCorrectMethodNamesSetForClosure();
		this.initWebGL();
		this.ensuresizeok()
	}
	return true
};
CL3D.Renderer.prototype.removeCompatibilityProblems = function () {

	var p;

	if ( this.gl.getShaderPrecisionFormat === undefined ) 
		this.gl.getShaderPrecisionFormat = function() {return {"rangeMin": 0,"rangeMax": 0,"precision": 0};}

	p = this.gl.getShaderPrecisionFormat(this.gl.FRAGMENT_SHADER, this.gl.HIGH_FLOAT).precision? "highp" : "lowp";

	CL3D.Renderer.prototype.fs_shader_simplecolor = "						#ifdef GL_ES												\n	precision "+p+" float;										\n	#endif														\n	uniform vec4 vColor;																											void main()														{																	 gl_FragColor = vColor;										}																";
	CL3D.Renderer.prototype.fs_shader_2ddrawing_canvasfont = "				#ifdef GL_ES												\n	precision "+p+" float;										\n	#endif														\n	uniform vec4 vColor;											uniform sampler2D texture1;										uniform sampler2D texture2;																										varying vec2 v_texCoord1;																										void main()														{																	vec2 texCoord = vec2(v_texCoord1.s, v_texCoord1.t);				float alpha = texture2D(texture1, texCoord).r;				gl_FragColor = vec4(vColor.rgb, alpha);							}																";
	CL3D.Renderer.prototype.fs_shader_onlyfirsttexture = "					#ifdef GL_ES												\n	precision "+p+" float;										\n	#endif														\n	uniform sampler2D texture1;										uniform sampler2D texture2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;																										void main()														{																	vec2 texCoord = vec2(v_texCoord1.s, v_texCoord1.t);				gl_FragColor = texture2D(texture1, texCoord);				}																";
	CL3D.Renderer.prototype.fs_shader_onlyfirsttexture_gouraud = "		#ifdef GL_ES												\n	precision "+p+" float;										\n	#endif														\n	uniform sampler2D texture1;										uniform sampler2D texture2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;										varying vec4 v_color;																											void main()														{																	vec2 texCoord = vec2(v_texCoord1.s, v_texCoord1.t);				gl_FragColor = texture2D(texture1, texCoord) * v_color;		}																";
	CL3D.Renderer.prototype.fs_shader_lightmapcombine = "					#ifdef GL_ES												\n	precision "+p+" float;										\n	#endif														\n	uniform sampler2D texture1;										uniform sampler2D texture2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;																										void main()														{																	vec2 texCoord1 = vec2(v_texCoord1.s, v_texCoord1.t);			vec2 texCoord2 = vec2(v_texCoord2.s, v_texCoord2.t);			vec4 col1 = texture2D(texture1, texCoord1);						vec4 col2 = texture2D(texture2, texCoord2);						gl_FragColor = col1 * col2;									}																";
	CL3D.Renderer.prototype.fs_shader_lightmapcombine_m4 = "			#ifdef GL_ES												\n	precision "+p+" float;										\n	#endif														\n	uniform sampler2D texture1;										uniform sampler2D texture2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;																										void main()														{																	vec2 texCoord1 = vec2(v_texCoord1.s, v_texCoord1.t);			vec2 texCoord2 = vec2(v_texCoord2.s, v_texCoord2.t);			vec4 col1 = texture2D(texture1, texCoord1);						vec4 col2 = texture2D(texture2, texCoord2);						gl_FragColor = col1 * col2 * 3.0;							}																";
	CL3D.Renderer.prototype.fs_shader_lightmapcombine_gouraud = "		#ifdef GL_ES												\n	precision "+p+" float;										\n	#endif														\n	uniform sampler2D texture1;										uniform sampler2D texture2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;										varying vec4 v_color;																											void main()														{																	vec2 texCoord1 = vec2(v_texCoord1.s, v_texCoord1.t);			vec2 texCoord2 = vec2(v_texCoord2.s, v_texCoord2.t);			vec4 col1 = texture2D(texture1, texCoord1);						vec4 col2 = texture2D(texture2, texCoord2);						vec4 final = col1 * col2 * v_color;								gl_FragColor = vec4(final.x, final.y, final.z, col1.w);		}																";

	if (typeof WebGLFloatArray == "undefined" && typeof Float32Array != "undefined") {
		try {
			WebGLFloatArray = Float32Array;
			WebGLUnsignedShortArray = Uint16Array
		} catch (a) {
			CL3D.gCCDebugOutput.printError("Error: Float32 array types for webgl not found.")
		}
	}
	if (typeof WebGLIntArray == "undefined" && typeof Int32Array != "undefined") {
		try {
			WebGLIntArray = Int32Array
		} catch (a) {
			CL3D.gCCDebugOutput.printError("Error: Int32 array types for webgl not found.")
		}
	}
	if (typeof WebGLFloatArray == "undefined" && typeof CanvasFloatArray != "undefined") {
		try {
			WebGLFloatArray = CanvasFloatArray;
			WebGLUnsignedShortArray = CanvasUnsignedShortArray
		} catch (a) {
			CL3D.gCCDebugOutput.printError("Error: canvas array types for webgl not found.")
		}
	}
	var b = this.gl;
	if (!b.getProgramParameter) {
		b.getProgramParameter = b.getProgrami
	}
	if (!b.getShaderParameter) {
		b.getShaderParameter = b.getShaderi
	}
};
CL3D.Renderer.prototype.loadShader = function (d, e) {
	var c = this.gl;
	var a = c.createShader(d);
	if (a == null) {
		return null
	}
	c.shaderSource(a, e);
	c.compileShader(a);
	if (!c.getShaderParameter(a, c.COMPILE_STATUS)) {
		var b = (d == c.VERTEX_SHADER) ? "vertex" : "fragment";
		CL3D.gCCDebugOutput.printError("Error loading " + b + " shader: " + c.getShaderInfoLog(a));
		return null
	}
	return a
};
CL3D.Renderer.prototype.createShaderProgram = function (d, c) {
	var f = this.gl;
	var e = this.loadShader(f.VERTEX_SHADER, d);
	var a = this.loadShader(f.FRAGMENT_SHADER, c);
	if (!e || !a) {
		CL3D.gCCDebugOutput.print("Could not create shader program");
		return null
	}
	var b = f.createProgram();
	f.attachShader(b, e);
	f.attachShader(b, a);
	f.bindAttribLocation(b, 0, "vPosition");
	f.bindAttribLocation(b, 1, "vTexCoord1");
	f.bindAttribLocation(b, 2, "vTexCoord2");
	f.bindAttribLocation(b, 3, "vNormal");
	f.bindAttribLocation(b, 4, "vColor");
	f.linkProgram(b);
	if (!f.getProgramParameter(b, f.LINK_STATUS)) {
		CL3D.gCCDebugOutput.print("Could not link program:" + f.getProgramInfoLog(b))
	} else {
		f.useProgram(b);
		f.uniform1i(f.getUniformLocation(b, "texture1"), 0);
		f.uniform1i(f.getUniformLocation(b, "texture2"), 1)
	}
	return b
};
CL3D.Renderer.prototype.createMaterialType = function (c, b, f, d, e) {
	var a = this.createMaterialTypeInternal(c, b, f, d, e);
	if (!a) {
		return -1
	}
	this.MinExternalMaterialTypeId += 1;
	this.MaterialPrograms[this.MinExternalMaterialTypeId] = a;
	this.MaterialProgramsWithLight[this.MinExternalMaterialTypeId] = a;
	return this.MinExternalMaterialTypeId
};
CL3D.Renderer.prototype.getGLProgramFromMaterialType = function (a) {
	var b = null;
	try {
		b = this.MaterialPrograms[a]
	} catch (c) {}
	return b
};
CL3D.Renderer.prototype.createMaterialTypeInternal = function (a, d, g, c, e) {
	var b = this.createShaderProgram(a, d);
	if (b) {
		b.blendenabled = g ? g : false;
		b.blendsfactor = c;
		b.blenddfactor = e;
		var f = this.gl;
		b.locWorldViewProj = f.getUniformLocation(b, "worldviewproj");
		b.locNormalMatrix = f.getUniformLocation(b, "normaltransform");
		b.locModelViewMatrix = f.getUniformLocation(b, "modelviewtransform");
		b.locLightPositions = f.getUniformLocation(b, "arrLightPositions");
		b.locLightColors = f.getUniformLocation(b, "arrLightColors")
	}
	return b
};
CL3D.Renderer.prototype.initWebGL = function () {
	var e = this.gl;
	var i = this.createMaterialTypeInternal(this.vs_shader_normaltransform, this.fs_shader_onlyfirsttexture_gouraud);
	var b = this.createMaterialTypeInternal(this.vs_shader_normaltransform, this.fs_shader_lightmapcombine);
	var g = this.createMaterialTypeInternal(this.vs_shader_normaltransform, this.fs_shader_lightmapcombine_m4);
	var a = this.createMaterialTypeInternal(this.vs_shader_normaltransform, this.fs_shader_onlyfirsttexture_gouraud, true, e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA);
	var h = this.createMaterialTypeInternal(this.vs_shader_normaltransform, this.fs_shader_onlyfirsttexture, true, e.ONE, e.ONE_MINUS_SRC_COLOR);
	var c = this.createMaterialTypeInternal(this.vs_shader_reflectiontransform, this.fs_shader_lightmapcombine);
	var f = this.createMaterialTypeInternal(this.vs_shader_reflectiontransform, this.fs_shader_lightmapcombine, true, e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA);
	var d = this.createMaterialTypeInternal(this.vs_shader_normaltransform_gouraud, this.fs_shader_onlyfirsttexture_gouraud);
	this.Program2DDrawingColorOnly = this.createMaterialTypeInternal(this.vs_shader_2ddrawing_coloronly, this.fs_shader_simplecolor);
	this.Program2DDrawingTextureOnly = this.createMaterialTypeInternal(this.vs_shader_2ddrawing_texture, this.fs_shader_onlyfirsttexture);
	this.Program2DDrawingCanvasFontColor = this.createMaterialTypeInternal(this.vs_shader_2ddrawing_texture, this.fs_shader_2ddrawing_canvasfont);
	this.MaterialPrograms[CL3D.Material.EMT_SOLID] = i;
	this.MaterialPrograms[CL3D.Material.EMT_SOLID + 1] = i;
	this.MaterialPrograms[CL3D.Material.EMT_LIGHTMAP] = b;
	this.MaterialPrograms[CL3D.Material.EMT_LIGHTMAP + 1] = b;
	this.MaterialPrograms[CL3D.Material.EMT_LIGHTMAP + 2] = b;
	this.MaterialPrograms[CL3D.Material.EMT_LIGHTMAP + 3] = g;
	this.MaterialPrograms[CL3D.Material.EMT_TRANSPARENT_ADD_COLOR] = h;
	this.MaterialPrograms[CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL] = a;
	this.MaterialPrograms[CL3D.Material.EMT_REFLECTION_2_LAYER] = c;
	this.MaterialPrograms[CL3D.Material.EMT_TRANSPARENT_REFLECTION_2_LAYER] = f;
	this.MaterialPrograms[23] = d;
	i = this.createMaterialTypeInternal(this.vs_shader_normaltransform_with_light, this.fs_shader_onlyfirsttexture_gouraud);
	a = this.createMaterialTypeInternal(this.vs_shader_normaltransform_with_light, this.fs_shader_onlyfirsttexture_gouraud, true, e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA);
	h = this.createMaterialTypeInternal(this.vs_shader_normaltransform_with_light, this.fs_shader_onlyfirsttexture_gouraud, true, e.ONE, e.ONE_MINUS_SRC_COLOR);
	c = this.createMaterialTypeInternal(this.vs_shader_reflectiontransform_with_light, this.fs_shader_lightmapcombine_gouraud);
	f = this.createMaterialTypeInternal(this.vs_shader_reflectiontransform_with_light, this.fs_shader_lightmapcombine_gouraud, true, e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA);
	this.MaterialProgramsWithLight[CL3D.Material.EMT_SOLID] = i;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_SOLID + 1] = i;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_LIGHTMAP] = b;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_LIGHTMAP + 1] = b;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_LIGHTMAP + 2] = b;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_LIGHTMAP + 3] = g;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_TRANSPARENT_ADD_COLOR] = h;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_TRANSPARENT_ALPHA_CHANNEL] = a;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_REFLECTION_2_LAYER] = c;
	this.MaterialProgramsWithLight[CL3D.Material.EMT_TRANSPARENT_REFLECTION_2_LAYER] = f;
	e.useProgram(i);
	this.currentGLProgram = i;
	e.clearColor(0, 0, 1, 1);
	e.clearDepth(10000);
	e.depthMask(true);
	e.enable(e.DEPTH_TEST);
	e.disable(e.BLEND);
	e.blendFunc(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA);
	e.enable(e.CULL_FACE);
	e.cullFace(e.BACK)
};
CL3D.Renderer.prototype.setProjection = function (a) {
	a.copyTo(this.Projection)
};
CL3D.Renderer.prototype.getProjection = function () {
	return this.Projection
};
CL3D.Renderer.prototype.setView = function (a) {
	a.copyTo(this.View)
};
CL3D.Renderer.prototype.getView = function () {
	return this.View
};
CL3D.Renderer.prototype.getWorld = function () {
	return this.World
};
CL3D.Renderer.prototype.setWorld = function (a) {
	if (a) {
		a.copyTo(this.World)
	}
};
CL3D.Renderer.prototype.ensureCorrectMethodNamesSetForClosure = function (a) {};
CL3D.Renderer.prototype.getMatrixAsWebGLFloatArray = function (a) {
	if (!this.WebGLFloatArray)
		this.WebGLFloatArray = new Float32Array(a.asArray());
	else
		this.WebGLFloatArray.set(a.asArray());

	return this.WebGLFloatArray
};
CL3D.Renderer.prototype.deleteTexture = function (a) {
	if (a == null) {
		return
	}
	var b = this.gl;
	b.deleteTexture(a.getWebGLTexture());
	a.Texture = null;
	a.Loaded = false
};
CL3D.Renderer.prototype.createTextureFrom2DCanvas = function (b, h) {
	var c = this.gl;
	var g = c.createTexture();
	c.bindTexture(c.TEXTURE_2D, g);
	var a = b.width;
	var k = b.height;
	var e = a;
	var f = k;
	if (!this.isPowerOfTwo(b.width) || !this.isPowerOfTwo(b.height)) {
		var d = document.createElement("canvas");
		d.width = this.nextHighestPowerOfTwo(b.width);
		d.height = this.nextHighestPowerOfTwo(b.height);
		var i = d.getContext("2d");
		if (h) {
			i.drawImage(b, 0, 0, b.width, b.height, 0, 0, b.width, b.height)
		} else {
			i.drawImage(b, 0, 0, b.width, b.height, 0, 0, d.width, d.height)
		}
		b = d;
		e = d.width;
		f = d.height
	}
	this.fillTextureFromDOMObject(g, b);
	c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.LINEAR);
	c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.LINEAR_MIPMAP_NEAREST);
	c.generateMipmap(c.TEXTURE_2D);
	c.bindTexture(c.TEXTURE_2D, null);
	var j = new CL3D.Texture();
	j.Name = "";
	j.Texture = g;
	j.Image = null;
	j.Loaded = true;
	j.CachedWidth = e;
	j.CachedHeight = f;
	j.OriginalWidth = a;
	j.OriginalHeight = k;
	return j
};
CL3D.Renderer.prototype.isPowerOfTwo = function (a) {
	return (a & (a - 1)) == 0
};
CL3D.Renderer.prototype.nextHighestPowerOfTwo = function (a) {
	--a;
	for (var b = 1; b < 32; b <<= 1) {
		a = a | a >> b
	}
	return a + 1
};
CL3D.Renderer.prototype.fillTextureFromDOMObject = function (b, c) {
	var g = this.gl;
	try {
		g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, c)
	} catch (f) {
		var a = navigator.userAgent;
		if (a != null && a.indexOf("Firefox") != -1) {
			if (this.firefox5BugPrinted == false) {
				CL3D.gCCDebugOutput.printError("<i>Firefox doesn't allow loading textures from other domains and from local disk anymore.<br/>Workaround: set security.fileuri.strict_origin_policy in about:config to 'false'</i>", true)
			}
			this.firefox5BugPrinted = true;
			return
		}
		try {
			g.texImage2D(g.TEXTURE_2D, 0, c)
		} catch (d) {}
	}
};
CL3D.Renderer.prototype.finalizeLoadedImageTexture = function (b) {
	var f = this.gl;
	var c = f.createTexture();
	var e = b.Image;
	if (!this.isPowerOfTwo(e.width) || !this.isPowerOfTwo(e.height)) {
		var a = document.createElement("canvas");
		if (a != null) {
			a.width = this.nextHighestPowerOfTwo(e.width);
			a.height = this.nextHighestPowerOfTwo(e.height);
			var d = a.getContext("2d");
			d.drawImage(e, 0, 0, e.width, e.height, 0, 0, a.width, a.height);
			e = a
		}
	}
	f.bindTexture(f.TEXTURE_2D, c);
	this.fillTextureFromDOMObject(c, e);
	f.generateMipmap(f.TEXTURE_2D);
	f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MAG_FILTER, f.LINEAR);
	f.texParameteri(f.TEXTURE_2D, f.TEXTURE_MIN_FILTER, f.LINEAR_MIPMAP_NEAREST);
	f.bindTexture(f.TEXTURE_2D, null);
	this.textureWasLoadedFlag = true;
	b.Texture = c
};
CL3D.Renderer.prototype.getStaticBillboardMeshBuffer = function () {
	if (this.StaticBillboardMeshBuffer == null) {
		this.createStaticBillboardMeshBuffer()
	}
	return this.StaticBillboardMeshBuffer
};
CL3D.Renderer.prototype.createStaticBillboardMeshBuffer = function () {
	if (this.StaticBillboardMeshBuffer != null) {
		return
	}
	var f = null;
	f = new CL3D.MeshBuffer();
	var g = new CL3D.Vertex3D(true);
	var e = new CL3D.Vertex3D(true);
	var c = new CL3D.Vertex3D(true);
	var b = new CL3D.Vertex3D(true);
	var d = f.Indices;
	d.push(0);
	d.push(2);
	d.push(1);
	d.push(0);
	d.push(3);
	d.push(2);
	var a = f.Vertices;
	a.push(g);
	a.push(e);
	a.push(c);
	a.push(b);
	g.TCoords.X = 1;
	g.TCoords.Y = 1;
	g.Pos.set(1, -1, 0);
	e.TCoords.X = 1;
	e.TCoords.Y = 0;
	e.Pos.set(1, 1, 0);
	c.TCoords.X = 0;
	c.TCoords.Y = 0;
	c.Pos.set(-1, 1, 0);
	b.TCoords.X = 0;
	b.TCoords.Y = 1;
	b.Pos.set(-1, -1, 0);
	this.StaticBillboardMeshBuffer = f
};

CL3D.Renderer.prototype.vs_shader_2ddrawing_coloronly = "				#ifdef GL_ES												\n	precision highp float;										\n	#endif														\n																	attribute vec4 vPosition;																										void main()														{																	gl_Position = vPosition;									}																";
CL3D.Renderer.prototype.vs_shader_2ddrawing_texture = "					#ifdef GL_ES												\n	precision highp float;										\n	#endif														\n																	attribute vec4 vPosition;										attribute vec4 vTexCoord1;										varying vec2 v_texCoord1;																										void main()														{																	gl_Position = vPosition;										v_texCoord1 = vTexCoord1.st;								}																";
CL3D.Renderer.prototype.vs_shader_normaltransform = "					#ifdef GL_ES												\n	precision highp float;										\n	#endif														\n	uniform mat4 worldviewproj;																										attribute vec4 vPosition;										attribute vec4 vNormal;											attribute vec4 vColor;											attribute vec2 vTexCoord1;										attribute vec2 vTexCoord2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;										varying vec4 v_color;																											void main()														{																	gl_Position = worldviewproj * vPosition;						v_texCoord1 = vTexCoord1.st;									v_texCoord2 = vTexCoord2.st;									v_color = vColor;											}																";
CL3D.Renderer.prototype.vs_shader_normaltransform_with_light = "					#ifdef GL_ES												\n	precision highp float;										\n	#endif														\n																	uniform mat4 worldviewproj;									\n	uniform vec4 arrLightPositions[4];							\n	uniform vec4 arrLightColors[5]; 							\n																	attribute vec4 vPosition;										attribute vec4 vNormal;											attribute vec4 vColor;											attribute vec2 vTexCoord1;										attribute vec2 vTexCoord2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;										varying vec4 v_color;																											void main()														{																	gl_Position = worldviewproj * vPosition;						v_texCoord1 = vTexCoord1.st;									v_texCoord2 = vTexCoord2.st;																							\n		vec3 n = normalize(vec3(vNormal.xyz));							vec4 currentLight = vec4(0, 0, 0, 1.0);							for(int i=0; i<4; ++i)											{																	vec3 lPos = vec3(arrLightPositions[i].xyz);						vec3 vertexToLight = lPos - vec3(vPosition.xyz);				float distance = length( vertexToLight );						float distanceFact = 1.0 / (arrLightPositions[i].w * distance); 			vertexToLight = normalize(vertexToLight); 						float angle = max(0.0, dot(n, vertexToLight));					float intensity = angle * distanceFact;							currentLight = currentLight + vec4(arrLightColors[i].x*intensity, arrLightColors[i].y*intensity, arrLightColors[i].z*intensity, 1.0);				}																																currentLight = currentLight + arrLightColors[4];				currentLight = max(currentLight, vec4(0.0,0.0,0.0,0.0));			currentLight = currentLight * vec4(vColor.x, vColor.y, vColor.z, 1.0);			v_color = min(currentLight, vec4(1.0,1.0,1.0,1.0));			}																";
CL3D.Renderer.prototype.vs_shader_normaltransform_gouraud = "					#ifdef GL_ES												\n	precision highp float;										\n	#endif														\n	uniform mat4 worldviewproj;																										attribute vec4 vPosition;										attribute vec2 vTexCoord1;										attribute vec2 vTexCoord2;										attribute vec4 vNormal;											attribute vec4 vColor;																											varying vec2 v_texCoord1;										varying vec2 v_texCoord2;										varying vec4 v_color;																											void main()														{																	gl_Position = worldviewproj * vPosition;						v_texCoord1 = vTexCoord1.st;									v_texCoord2 = vTexCoord2.st;									v_color = vColor;											}																";
CL3D.Renderer.prototype.vs_shader_reflectiontransform = "			#ifdef GL_ES												\n	precision highp float;										\n	#endif														\n	uniform mat4 worldviewproj;									\n	uniform mat4 normaltransform;								\n	uniform mat4 modelviewtransform;							\n																	attribute vec4 vPosition;										attribute vec3 vNormal;											attribute vec2 vTexCoord1;										attribute vec2 vTexCoord2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;																										void main()														{																	gl_Position = worldviewproj * vPosition;					\n																	\n		//	use reflection											\n		vec4 pos = modelviewtransform * vPosition;					\n		vec4 n = normalize(normaltransform * vec4(vNormal, 1));		\n		vec3 r = reflect( pos.xyz, n.xyz );							\n		float m = sqrt( r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0) ); \n															\n		//	texture coordinates								\n		v_texCoord1 = vTexCoord1.st;						\n		v_texCoord2.x = r.x / m  + 0.5;						\n		v_texCoord2.y = r.y / m  + 0.5;						\n	}														\n	";
CL3D.Renderer.prototype.vs_shader_reflectiontransform_with_light = "			#ifdef GL_ES												\n	precision highp float;										\n	#endif														\n	uniform mat4 worldviewproj;									\n	uniform mat4 normaltransform;								\n	uniform mat4 modelviewtransform;							\n	uniform vec4 arrLightPositions[4];							\n	uniform vec4 arrLightColors[5]; 							\n																	attribute vec4 vPosition;										attribute vec3 vNormal;											attribute vec2 vTexCoord1;										attribute vec2 vTexCoord2;																										varying vec2 v_texCoord1;										varying vec2 v_texCoord2;										varying vec4 v_color;																											void main()														{																	gl_Position = worldviewproj * vPosition;					\n																	\n		//	use reflection											\n		vec4 pos = modelviewtransform * vPosition;					\n		vec4 nt = normalize(normaltransform * vec4(vNormal, 1));		\n		vec3 r = reflect( pos.xyz, nt.xyz );							\n		float m = sqrt( r.x*r.x + r.y*r.y + (r.z+1.0)*(r.z+1.0) ); \n		//	texture coordinates								\n		v_texCoord1 = vTexCoord1.st;						\n		v_texCoord2.x = r.x / m  + 0.5;						\n		v_texCoord2.y = r.y / m  + 0.5;						\n															\n		vec3 n = normalize(vec3(vNormal.xyz));							vec4 currentLight = vec4(0.0, 0.0, 0.0, 1.0);	 				for(int i=0; i<4; ++i)											{																	vec3 lPos = vec3(arrLightPositions[i].xyz);						vec3 vertexToLight = lPos - vec3(vPosition.xyz);				float distance = length( vertexToLight );						float distanceFact = 1.0 / (arrLightPositions[i].w * distance); 			vertexToLight = normalize(vertexToLight); 						float angle = max(0.0, dot(n, vertexToLight));					float intensity = angle * distanceFact;							currentLight = currentLight + vec4(arrLightColors[i].x*intensity, arrLightColors[i].y*intensity, arrLightColors[i].z*intensity, 1.0);				}																currentLight = currentLight + arrLightColors[4];				currentLight = max(currentLight, vec4(0.0,0.0,0.0,0.0));			//v_color = currentLight;								\n		v_color = min(currentLight, vec4(1.0,1.0,1.0,1.0));																			}														\n	";

CL3D.Renderer.prototype.fs_shader_simplecolor = null;
CL3D.Renderer.prototype.fs_shader_2ddrawing_canvasfont = null;
CL3D.Renderer.prototype.fs_shader_onlyfirsttexture = null;
CL3D.Renderer.prototype.fs_shader_onlyfirsttexture_gouraud = null;
CL3D.Renderer.prototype.fs_shader_lightmapcombine = null;
CL3D.Renderer.prototype.fs_shader_lightmapcombine_m4 = null;
CL3D.Renderer.prototype.fs_shader_lightmapcombine_gouraud = null;


//Class SceneNode
CL3D.SceneNode = function () {
	this.Type = -1;
	this.Pos = new CL3D.Vect3d();
	this.Rot = new CL3D.Vect3d();
	this.Scale = new CL3D.Vect3d(1, 1, 1);
	this.Visible = true;
	this.Name = "";
	this.Culling = 0;
	this.Id = -1;
	this.Parent = null;
	this.Children = new Array();
	this.Animators = new Array();
	this.AbsoluteTransformation = new CL3D.Matrix4();
	this.scene = null;
	this.Selector = null
};
CL3D.SceneNode.prototype.init = function () {
	this.Pos = new CL3D.Vect3d();
	this.Rot = new CL3D.Vect3d();
	this.Scale = new CL3D.Vect3d(1, 1, 1);
	this.Children = new Array();
	this.Animators = new Array();
	this.AbsoluteTransformation = new CL3D.Matrix4()
};

CL3D.SceneNode.prototype.Pos = null;
CL3D.SceneNode.prototype.Rot = null;
CL3D.SceneNode.prototype.Scale = null;
CL3D.SceneNode.prototype.Visible = true;
CL3D.SceneNode.prototype.Name = "";
CL3D.SceneNode.prototype.Id = -1;
CL3D.SceneNode.prototype.Selector = null;
CL3D.SceneNode.prototype.Parent = null;
CL3D.SceneNode.prototype.setVisible = function (value, forced) {
	if (this.Visible != value || forced){
		this.Visible = value;

		if (this.scene)
			this.scene.updateNodesToRender();
	}
};
CL3D.SceneNode.prototype.getVisible = function () {
	return this.Visible;
};
CL3D.SceneNode.prototype.getParent = function () {
	return this.Parent
};
CL3D.SceneNode.prototype.getChildren = function () {
	return this.Children
};
CL3D.SceneNode.prototype.getType = function () {
	return "none"
};
CL3D.SceneNode.prototype.getBoundingBox = function () {
	return new CL3D.Box3d()
};
CL3D.SceneNode.prototype.getAnimators = function () {
	return this.Animators
};
CL3D.SceneNode.prototype.getAnimatorOfType = function (c) {
	for (var b = 0; b < this.Animators.length; ++b) {
		var a = this.Animators[b];
		if (a.getType() == c) {
			return a
		}
	}
	return null
};
CL3D.SceneNode.prototype.getTransformedBoundingBox = function () {
	var a = this.getBoundingBox().clone();
	this.AbsoluteTransformation.transformBoxEx(a);
	return a
};
CL3D.SceneNode.prototype.cloneMembers = function (a, e) {
	a.Name = new String(this.Name);
	a.setVisible(this.getVisible());
	a.Culling = this.Culling;
	a.Pos.setTo(this.Pos);
	a.Rot.setTo(this.Rot);
	a.Scale.setTo(this.Scale);
	a.Type = this.Type;
	if (e) {
		e.addChild(a)
	}
	for (var d = 0; d < this.Children.length; ++d) {
		var g = this.Children[d];
		if (g) {
			var f = g.createClone(a);
			if (f != null) {
				a.addChild(f)
			}
		}
	}
	a.Animators.clear();
	if (this.AbsoluteTransformation) {
		a.AbsoluteTransformation.setTo(this.AbsoluteTransformation);
	}
	a.scene = this.scene
};
CL3D.SceneNode.prototype.createClone = function (a) {
	return null
};
CL3D.SceneNode.prototype.addAnimator = function (b) {
	if (b != null) {
		this.Animators.push(b)
	}
};
CL3D.SceneNode.prototype.removeAnimator = function (b) {
	if (b == null) {
		return
	}
	var d;
	for (d = 0; d < this.Animators.length; ++d) {
		var c = this.Animators[d];
		if (c === b) {
			this.Animators.remove(d);
			return
		}
	}
};
CL3D.SceneNode.prototype.addChild = function (a) {
	if (a) {
		a.scene = this.scene;
		if (a.Parent) {
			a.Parent.removeChild(a)
		}
		a.Parent = this;
		this.Children.push(a)

		a.OnRegisterSceneNode(this.scene);
	}
};
CL3D.SceneNode.prototype.removeChild = function (b) {
	for (var a = 0; a < this.Children.length; ++a) {
		if (this.Children[a] === b) {

			b.Parent = null;
			this.Children.remove(a);

			this.scene.updateNodesToRender();
			return
		}
	}
};
CL3D.SceneNode.prototype.OnRegisterSceneNode = function (b) {
	if (this.getVisible()) {
		for (var a = 0; a < this.Children.length; ++a) {
			var d = this.Children[a];
			d.OnRegisterSceneNode(b)
		}
	}
};
CL3D.SceneNode.prototype.OnAnimate = function (h, k) {
	var e = false;
	if (this.getVisible()) {
		var f;
		var b = this.Animators.length;
		for (f = 0; f < b;) {
			var d = this.Animators[f];
			e = d.animateNode(this, k) || e;
			var g = b;
			b = this.Animators.length;
			if (g >= b) {
				++f
			}
		}
		this.updateAbsolutePosition();
		for (f = 0; f < this.Children.length; ++f) {
			var j = this.Children[f];
			e = j.OnAnimate(h, k) || e
		}
	}
	return e
};
/*CL3D.SceneNode.prototype.getRelativeTransformation = function () {
	var b = new CL3D.Matrix4();
	b.setRotationDegrees(this.Rot);
	b.setTranslation(this.Pos);
	if (this.Scale.X != 1 || this.Scale.Y != 1 || this.Scale.Z != 1) {
		var a = new CL3D.Matrix4();
		a.setScale(this.Scale);
		b = b.multiply(a)
	}
	return b
};*/
CL3D.SceneNode.prototype.getRelativeTransformation = function () {
	if (!this.RelativeTransformation)
		this.RelativeTransformation = new CL3D.Matrix4();

	this.RelativeTransformation.makeIdentity();
	this.RelativeTransformation.setRotationDegrees(this.Rot);
	this.RelativeTransformation.setTranslation(this.Pos);

	if (this.Scale.X != 1 || this.Scale.Y != 1 || this.Scale.Z != 1) {
		_tempM0.makeIdentity();
		_tempM0.setScale(this.Scale);
		this.RelativeTransformation.multiplyThisWith(_tempM0);
	}
	return this.RelativeTransformation;
};
CL3D.SceneNode.prototype.updateAbsolutePosition = function () {
	if (this.Parent != null) 
		this.AbsoluteTransformation.setTo(this.Parent.AbsoluteTransformation).multiplyThisWith(this.getRelativeTransformation());
	else
		this.AbsoluteTransformation.setTo( this.getRelativeTransformation() );
};
CL3D.SceneNode.prototype.render = function (a) {};
CL3D.SceneNode.prototype.getAbsoluteTransformation = function () {
	return this.AbsoluteTransformation
};
CL3D.SceneNode.prototype.getAbsolutePosition = function () {
	return this.AbsoluteTransformation.getTranslation()
};
CL3D.SceneNode.prototype.getMaterialCount = function () {
	return 0
};
CL3D.SceneNode.prototype.getMaterial = function (a) {
	return null
};
CL3D.CameraSceneNode = function () {
	this.init();
	this.Box = new CL3D.Box3d();
	this.DoesCollision = false;
	this.Active = false;
	this.Target = new CL3D.Vect3d(0, 0, 10);
	this.UpVector = new CL3D.Vect3d(0, 1, 0);
	this.Projection = new CL3D.Matrix4();
	this.ViewMatrix = new CL3D.Matrix4();
	this.Fovy = CL3D.PI / 2.5;
	this.Aspect = 4 / 3;
	this.ZNear = 0.1;
	this.ZFar = 3000;
	this.TargetAndRotationAreBound = true;
	this.Projection.buildProjectionMatrixPerspectiveFovLH(this.Fovy, this.Aspect, this.ZNear, this.ZFar)
};
CL3D.CameraSceneNode.prototype = new CL3D.SceneNode();
CL3D.CameraSceneNode.prototype.recalculateProjectionMatrix = function () {
	this.Projection.buildProjectionMatrixPerspectiveFovLH(this.Fovy, this.Aspect, this.ZNear, this.ZFar)
};
CL3D.CameraSceneNode.prototype.getType = function () {
	return "camera"
};
CL3D.CameraSceneNode.prototype.setAspectRatio = function (b) {
	if (!CL3D.equals(this.Aspect, b)) {
		this.Aspect = b;
		this.recalculateProjectionMatrix()
	}
};
CL3D.CameraSceneNode.prototype.getAspectRatio = function () {
	return this.Aspect
};
CL3D.CameraSceneNode.prototype.getFov = function () {
	return this.Fovy
};
CL3D.CameraSceneNode.prototype.setFov = function (a) {
	if (!CL3D.equals(this.Fovy, a)) {
		this.Fovy = a;
		this.recalculateProjectionMatrix()
	}
};
CL3D.CameraSceneNode.prototype.setTarget = function (a) {
	if (a) {
		this.Target = a.clone();
		if (this.TargetAndRotationAreBound) {
			this.updateAbsolutePosition();
			this.Rot.setTo(a).substractFromThis(this.getAbsolutePosition()).getHorizontalAngle()
		}
	}
};
CL3D.CameraSceneNode.prototype.getTarget = function () {
	return this.Target
};
CL3D.CameraSceneNode.prototype.getUpVector = function () {
	return this.UpVector
};
CL3D.CameraSceneNode.prototype.setUpVector = function (a) {
	if (a) {
		this.UpVector = a.clone()
	}
};
CL3D.CameraSceneNode.prototype.getNearValue = function () {
	return this.ZNear
};
CL3D.CameraSceneNode.prototype.setNearValue = function (a) {
	if (!CL3D.equals(this.ZNear, a)) {
		this.ZNear = a;
		this.recalculateProjectionMatrix()
	}
};
CL3D.CameraSceneNode.prototype.getFarValue = function () {
	return this.ZFar
};
CL3D.CameraSceneNode.prototype.setFarValue = function (a) {
	if (!CL3D.equals(this.ZFar, a)) {
		this.ZFar = a;
		this.recalculateProjectionMatrix()
	}
};
CL3D.CameraSceneNode.prototype.recalculateViewArea = function () {};
CL3D.CameraSceneNode.prototype.OnAnimate = function (b, c) {
	var a = CL3D.SceneNode.prototype.OnAnimate.call(this, b, c);
	this.calculateViewMatrix();
	return a
};
CL3D.CameraSceneNode.prototype.calculateViewMatrix = function () {
	var b = this.getAbsolutePosition();
	_tempV5.setTo( this.Target );
	if (b.equals(_tempV5)) {
		_tempV5.X += 1
	}
	this.ViewMatrix.buildCameraLookAtMatrixLH(b, _tempV5, this.UpVector);
	this.recalculateViewArea()
};
CL3D.CameraSceneNode.prototype.OnRegisterSceneNode = function (a) {
	if (a.getActiveCamera() === this) {
		a.registerNodeForRendering(this, 2);
		CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, a)
	}
};
CL3D.CameraSceneNode.prototype.render = function (a) {
	this.calculateViewMatrix();
	if (this.Aspect == 0) {
		this.setAutoAspectIfNoFixedSet(a.width, a.height);
		if (this.Aspect == 0) {
			this.setAspectRatio(3 / 4)
		}
	}
	a.setProjection(this.Projection);
	a.setView(this.ViewMatrix)
};
CL3D.CameraSceneNode.prototype.onMouseDown = function (b) {
	for (var a = 0; a < this.Animators.length; ++a) {
		this.Animators[a].onMouseDown(b)
	}
};
CL3D.CameraSceneNode.prototype.onMouseWheel = function (b) {
	for (var a = 0; a < this.Animators.length; ++a) {
		this.Animators[a].onMouseWheel(b)
	}
};
CL3D.CameraSceneNode.prototype.onMouseUp = function (b) {
	for (var a = 0; a < this.Animators.length; ++a) {
		this.Animators[a].onMouseUp(b)
	}
};
CL3D.CameraSceneNode.prototype.onMouseMove = function (b) {
	for (var a = 0; a < this.Animators.length; ++a) {
		this.Animators[a].onMouseMove(b)
	}
};
CL3D.CameraSceneNode.prototype.onKeyDown = function (c) {
	var a = false;
	for (var b = 0; b < this.Animators.length; ++b) {
		if (this.Animators[b].onKeyDown(c)) {
			a = true
		}
	}
	return a
};
CL3D.CameraSceneNode.prototype.onKeyUp = function (c) {
	var a = false;
	for (var b = 0; b < this.Animators.length; ++b) {
		if (this.Animators[b].onKeyUp(c)) {
			a = true
		}
	}
	return a
};
CL3D.CameraSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.CameraSceneNode();
	this.cloneMembers(b, a);
	if (this.Target) {
		b.Target = this.Target.clone()
	}
	if (this.UpVector) {
		b.UpVector = this.UpVector.clone()
	}
	if (this.Projection) {
		b.Projection = this.Projection.clone()
	}
	if (this.ViewMatrix) {
		b.ViewMatrix = this.ViewMatrix.clone()
	}
	b.Fovy = this.Fovy;
	b.Aspect = this.Aspect;
	b.ZNear = this.ZNear;
	b.ZFar = this.ZFar;
	if (this.Box) {
		b.Box = this.Box.clone()
	}
	return b
};
CL3D.CameraSceneNode.prototype.setAutoAspectIfNoFixedSet = function (a, d) {
	if (a == 0 || d == 0) {
		return
	}
	var c = this.Aspect;
	if (!CL3D.equals(c, 0)) {
		return
	}
	var b = a / d;
	this.setAspectRatio(b)
};
CL3D.MeshSceneNode = function () {
	this.init();
	this.Box = new CL3D.Box3d();
	this.DoesCollision = false;
	this.OwnedMesh = null;
	this.ReadOnlyMaterials = true;
	this.Selector = null
};
CL3D.MeshSceneNode.prototype = new CL3D.SceneNode();
CL3D.MeshSceneNode.prototype.getBoundingBox = function () {
	if (this.OwnedMesh) {
		return this.OwnedMesh.Box
	}
	return this.Box
};
CL3D.MeshSceneNode.prototype.getMesh = function () {
	return this.OwnedMesh
};
CL3D.MeshSceneNode.prototype.setMesh = function (a) {
	this.OwnedMesh = a
};
CL3D.MeshSceneNode.prototype.getType = function () {
	return "mesh"
};
CL3D.MeshSceneNode.prototype.OnRegisterSceneNode = function (d) {
	var f = this.OwnedMesh;
	if (this.getVisible() && f) {
		var e = false;
		var a = false;
		for (var c = 0; c < f.MeshBuffers.length; ++c) {
			var b = f.MeshBuffers[c];
			if (b.Mat.isTransparent()) {
				e = true
			} else {
				a = true
			}
		}
		if (e) {
			d.registerNodeForRendering(this, CL3D.Scene.RENDER_MODE_TRANSPARENT)
		}
		if (a) {
			d.registerNodeForRendering(this, CL3D.Scene.RENDER_MODE_DEFAULT)
		}
		CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, d)
	}
};
CL3D.MeshSceneNode.prototype.render = function (a) {
	a.setWorld(this.AbsoluteTransformation);
	a.drawMesh(this.OwnedMesh)
};
CL3D.MeshSceneNode.prototype.getMaterialCount = function () {
	if (this.OwnedMesh) {
		return this.OwnedMesh.MeshBuffers.length
	}
	return 0
};
CL3D.MeshSceneNode.prototype.getMaterial = function (b) {
	if (this.OwnedMesh != null) {
		if (b >= 0 && b < this.OwnedMesh.MeshBuffers.length) {
			var a = this.OwnedMesh.MeshBuffers[b];
			return a.Mat
		}
	}
	return null
};
CL3D.MeshSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.MeshSceneNode();
	this.cloneMembers(b, a);
	b.OwnedMesh = this.OwnedMesh;
	b.ReadonlyMaterials = this.ReadonlyMaterials;
	b.DoesCollision = this.DoesCollision;
	if (this.Box) {
		b.Box.setTo(this.Box)
	}
	return b
};
CL3D.SkyBoxSceneNode = function () {
	this.OwnedMesh = new CL3D.Mesh();
	var a = [0, 1, 2, 0, 2, 3];
	var b = new CL3D.MeshBuffer();
	this.OwnedMesh.AddMeshBuffer(b);
	b.Mat.ClampTexture1 = true;
	b.Indices = a;
	b.Vertices.push(this.createVertex(-1, -1, -1, 0, 0, 1, 1, 1));
	b.Vertices.push(this.createVertex(1, -1, -1, 0, 0, 1, 0, 1));
	b.Vertices.push(this.createVertex(1, 1, -1, 0, 0, 1, 0, 0));
	b.Vertices.push(this.createVertex(-1, 1, -1, 0, 0, 1, 1, 0));
	b = new CL3D.MeshBuffer();
	this.OwnedMesh.AddMeshBuffer(b);
	b.Mat.ClampTexture1 = true;
	b.Indices = a;
	b.Vertices.push(this.createVertex(1, -1, -1, -1, 0, 0, 1, 1));
	b.Vertices.push(this.createVertex(1, -1, 1, -1, 0, 0, 0, 1));
	b.Vertices.push(this.createVertex(1, 1, 1, -1, 0, 0, 0, 0));
	b.Vertices.push(this.createVertex(1, 1, -1, -1, 0, 0, 1, 0));
	b = new CL3D.MeshBuffer();
	this.OwnedMesh.AddMeshBuffer(b);
	b.Mat.ClampTexture1 = true;
	b.Indices = a;
	b.Vertices.push(this.createVertex(-1, -1, 1, 1, 0, 0, 1, 1));
	b.Vertices.push(this.createVertex(-1, -1, -1, 1, 0, 0, 0, 1));
	b.Vertices.push(this.createVertex(-1, 1, -1, 1, 0, 0, 0, 0));
	b.Vertices.push(this.createVertex(-1, 1, 1, 1, 0, 0, 1, 0));
	b = new CL3D.MeshBuffer();
	this.OwnedMesh.AddMeshBuffer(b);
	b.Mat.ClampTexture1 = true;
	b.Indices = a;
	b.Vertices.push(this.createVertex(1, -1, 1, 0, 0, -1, 1, 1));
	b.Vertices.push(this.createVertex(-1, -1, 1, 0, 0, -1, 0, 1));
	b.Vertices.push(this.createVertex(-1, 1, 1, 0, 0, -1, 0, 0));
	b.Vertices.push(this.createVertex(1, 1, 1, 0, 0, -1, 1, 0));
	b = new CL3D.MeshBuffer();
	this.OwnedMesh.AddMeshBuffer(b);
	b.Mat.ClampTexture1 = true;
	b.Indices = a;
	b.Vertices.push(this.createVertex(1, 1, -1, 0, -1, 0, 1, 1));
	b.Vertices.push(this.createVertex(1, 1, 1, 0, -1, 0, 0, 1));
	b.Vertices.push(this.createVertex(-1, 1, 1, 0, -1, 0, 0, 0));
	b.Vertices.push(this.createVertex(-1, 1, -1, 0, -1, 0, 1, 0));
	b = new CL3D.MeshBuffer();
	this.OwnedMesh.AddMeshBuffer(b);
	b.Mat.ClampTexture1 = true;
	b.Indices = a;
	b.Vertices.push(this.createVertex(1, -1, 1, 0, 1, 0, 1, 1));
	b.Vertices.push(this.createVertex(1, -1, -1, 0, 1, 0, 0, 1));
	b.Vertices.push(this.createVertex(-1, -1, -1, 0, 1, 0, 0, 0));
	b.Vertices.push(this.createVertex(-1, -1, 1, 0, 1, 0, 1, 0))
};
CL3D.SkyBoxSceneNode.prototype = new CL3D.MeshSceneNode();
CL3D.SkyBoxSceneNode.prototype.getType = function () {
	return "sky"
};
CL3D.SkyBoxSceneNode.prototype.createVertex = function (g, f, e, d, c, b, i, h) {
	var a = new CL3D.Vertex3D(true);
	a.Pos.X = g;
	a.Pos.Y = f;
	a.Pos.Z = e;
	a.TCoords.X = i;
	a.TCoords.Y = h;
	return a
};
CL3D.SkyBoxSceneNode.prototype.OnRegisterSceneNode = function (a) {
	if (this.getVisible()) {
		a.registerNodeForRendering(this, 1);
		CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, a)
	}
};
CL3D.SkyBoxSceneNode.prototype.render = function (b) {
	var a = this.scene.getActiveCamera();
	if (!a || !this.OwnedMesh) {
		return
	}
	_tempM0.resetToZero();
	this.AbsoluteTransformation.copyTo(_tempM0);
	_tempM0.setTranslation(a.getAbsolutePosition());
	var e = (a.getNearValue() + a.getFarValue()) * 0.5;
	_tempM1.makeIdentity();
	_tempV0.set(e, e, e);
	_tempM1.setScale(_tempV0);
	b.setWorld(_tempM0.multiplyThisWith(_tempM1));
	b.drawMesh(this.OwnedMesh);
};
CL3D.SkyBoxSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.SkyBoxSceneNode();
	this.cloneMembers(b, a);
	if (this.OwnedMesh) {
		b.OwnedMesh = this.OwnedMesh.clone()
	}
	b.ReadonlyMaterials = this.ReadonlyMaterials;
	b.DoesCollision = this.DoesCollision;
	if (this.Box) {
		b.Box = this.Box.clone()
	}
	return b
};
CL3D.CubeSceneNode = function (e) {
	if (e == null) {
		e = 10
	}
	this.OwnedMesh = new CL3D.Mesh();
	var c = new CL3D.MeshBuffer();
	c.Indices = [0, 2, 1, 0, 3, 2, 1, 5, 4, 1, 2, 5, 4, 6, 7, 4, 5, 6, 7, 3, 0, 7, 6, 3, 9, 5, 2, 9, 8, 5, 0, 11, 10, 0, 10, 7];
	this.OwnedMesh.AddMeshBuffer(c);
	var b = CL3D.createColor(255, 255, 255, 255);
	c.Vertices.push(this.createVertex(0, 0, 0, -1, -1, -1, b, 0, 1));
	c.Vertices.push(this.createVertex(1, 0, 0, 1, -1, -1, b, 1, 1));
	c.Vertices.push(this.createVertex(1, 1, 0, 1, 1, -1, b, 1, 0));
	c.Vertices.push(this.createVertex(0, 1, 0, -1, 1, -1, b, 0, 0));
	c.Vertices.push(this.createVertex(1, 0, 1, 1, -1, 1, b, 0, 1));
	c.Vertices.push(this.createVertex(1, 1, 1, 1, 1, 1, b, 0, 0));
	c.Vertices.push(this.createVertex(0, 1, 1, -1, 1, 1, b, 1, 0));
	c.Vertices.push(this.createVertex(0, 0, 1, -1, -1, 1, b, 1, 1));
	c.Vertices.push(this.createVertex(0, 1, 1, -1, 1, 1, b, 0, 1));
	c.Vertices.push(this.createVertex(0, 1, 0, -1, 1, -1, b, 1, 1));
	c.Vertices.push(this.createVertex(1, 0, 1, 1, -1, 1, b, 1, 0));
	c.Vertices.push(this.createVertex(1, 0, 0, 1, -1, -1, b, 0, 0));
	for (var d = 0; d < 12; ++d) {
		var a = c.Vertices[d].Pos;
		a.multiplyThisWithScal(e);
		a.X -= e * 0.5;
		a.Y -= e * 0.5;
		a.Z -= e * 0.5
	}
	c.recalculateBoundingBox();
	this.OwnedMesh.Box = c.Box.clone();
	this.init()
};
CL3D.CubeSceneNode.prototype = new CL3D.MeshSceneNode();
CL3D.CubeSceneNode.prototype.createVertex = function (g, f, e, d, c, b, j, i, h) {
	var a = new CL3D.Vertex3D(true);
	a.Pos.X = g;
	a.Pos.Y = f;
	a.Pos.Z = e;
	a.Normal.X = d;
	a.Normal.Y = c;
	a.Normal.Z = b;
	a.TCoords.X = i;
	a.TCoords.Y = h;
	return a
};
CL3D.CubeSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.CubeSceneNode();
	this.cloneMembers(b, a);
	b.OwnedMesh = this.OwnedMesh;
	b.ReadonlyMaterials = this.ReadonlyMaterials;
	b.DoesCollision = this.DoesCollision;
	if (this.Box) {
		b.Box = this.Box.clone()
	}
	return b
};
CL3D.BillboardSceneNode = function () {
	this.init();
	this.Box = new CL3D.Box3d();
	this.SizeX = 10;
	this.SizeY = 10;
	this.IsVertical = false;
	this.MeshBuffer = new CL3D.MeshBuffer();
	this.vtx1 = new CL3D.Vertex3D(true);
	this.vtx2 = new CL3D.Vertex3D(true);
	this.vtx3 = new CL3D.Vertex3D(true);
	this.vtx4 = new CL3D.Vertex3D(true);
	var c = this.MeshBuffer.Indices;
	c.push(0);
	c.push(2);
	c.push(1);
	c.push(0);
	c.push(3);
	c.push(2);
	var a = this.MeshBuffer.Vertices;
	a.push(this.vtx1);
	a.push(this.vtx2);
	a.push(this.vtx3);
	a.push(this.vtx4);
	this.vtx1.TCoords.X = 1;
	this.vtx1.TCoords.Y = 1;
	this.vtx2.TCoords.X = 1;
	this.vtx2.TCoords.Y = 0;
	this.vtx3.TCoords.X = 0;
	this.vtx3.TCoords.Y = 0;
	this.vtx4.TCoords.X = 0;
	this.vtx4.TCoords.Y = 1;
	for (var b = 0; b < 4; ++b) {
		this.Box.addInternalPointByVector(a[b].Pos)
	}
};
CL3D.BillboardSceneNode.prototype = new CL3D.SceneNode();
CL3D.BillboardSceneNode.prototype.getBoundingBox = function () {
	return this.Box
};
CL3D.BillboardSceneNode.prototype.getType = function () {
	return "billboard"
};
CL3D.BillboardSceneNode.prototype.OnRegisterSceneNode = function (a) {
	if (this.getVisible()) {
		a.registerNodeForRendering(this, this.MeshBuffer.Mat.isTransparent() ? CL3D.Scene.RENDER_MODE_TRANSPARENT : CL3D.Scene.RENDER_MODE_DEFAULT);
		CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, a)
	}
};
CL3D.BillboardSceneNode.prototype.render = function (k) {
	var a = this.scene.getActiveCamera();
	if (!a) {
		return
	}
	var e = this.IsVertical;
	if (!e) {
		var m = this.getAbsolutePosition();
		var n = k.getStaticBillboardMeshBuffer();

		_tempM0.makeIdentity();
		_tempV0.set(this.SizeX * 0.5, this.SizeY * 0.5, 0);
		_tempM0.setScale( _tempV0 );

		_tempM1.setTo(k.getView());
		_tempV0.set(0, 0, 0);
		_tempM1.setTranslation( _tempV0 );

		_tempM2.makeIdentity();
		_tempM1.getInverse( _tempM2 );
		_tempM2.setTranslation( m );
		_tempM1.setTo( _tempM0 );
		_tempM0.setTo( _tempM2 ).multiplyThisWith( _tempM1 );
		k.setWorld( _tempM0 );

		k.setMaterial( this.MeshBuffer.Mat );
		k.drawMeshBuffer( n )
	} else {
		var m = this.getAbsolutePosition();
		var c = a.getAbsolutePosition();
		var h = a.getTarget();
		var f = a.getUpVector();

		_tempV0.setTo(h).substractFromThis(c);

		_tempV0.normalize();


		_tempV1.setTo(f).crossProductTo(_tempV0);

		if (_tempV1.getLengthSQ() == 0) {
			_tempV1.set(f.Y, f.X, f.Z)
		}
		_tempV1.normalize();
		_tempV1.multiplyThisWithScal(0.5 * this.SizeX);

		_tempV2.setTo(_tempV1).crossProductTo(_tempV0);
		_tempV2.normalize();
		_tempV2.multiplyThisWithScal(0.5 * this.SizeY);

		if (this.IsVertical) {
			_tempV2.set(0, -0.5 * this.SizeY, 0)
		}
		_tempV0.multiplyThisWithScal(1);
		this.vtx1.Pos.setTo(m);
		this.vtx1.Pos.addToThis(_tempV1);
		this.vtx1.Pos.addToThis(_tempV2);
		this.vtx2.Pos.setTo(m);
		this.vtx2.Pos.addToThis(_tempV1);
		this.vtx2.Pos.substractFromThis(_tempV2);
		this.vtx3.Pos.setTo(m);
		this.vtx3.Pos.substractFromThis(_tempV1);
		this.vtx3.Pos.substractFromThis(_tempV2);
		this.vtx4.Pos.setTo(m);
		this.vtx4.Pos.substractFromThis(_tempV1);
		this.vtx4.Pos.addToThis(_tempV2);
		this.MeshBuffer.update();

		//var j = new CL3D.Matrix4(true);
		_tempM0.makeIdentity();
		k.setWorld(_tempM0);
		k.setMaterial(this.MeshBuffer.Mat);
		k.drawMeshBuffer(this.MeshBuffer)
	}
};
CL3D.BillboardSceneNode.prototype.getMaterialCount = function () {
	return 1
};
CL3D.BillboardSceneNode.prototype.getMaterial = function (a) {
	return this.MeshBuffer.Mat
};
CL3D.BillboardSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.BillboardSceneNode();
	this.cloneMembers(b, a);
	if (this.Box) {
		b.Box.setTo(this.Box)
	}
	b.SizeX = this.SizeX;
	b.SizeY = this.SizeY;
	b.IsVertical = this.IsVertical;
	b.MeshBuffer.Mat = this.MeshBuffer.Mat.clone();
	return b
};
CL3D.BillboardSceneNode.prototype.getSize = function () {
	return new CL3D.Vect2d(this.SizeX, this.SizeY)
};
CL3D.BillboardSceneNode.prototype.setSize = function (a, b) {
	this.SizeX = a;
	this.SizeY = b
};
CL3D.Light = function () {
	this.Position = new CL3D.Vect3d(0, 0, 0);
	this.Color = new CL3D.ColorF();
	this.Radius = 100;
	this.Attenuation = 1 / 100
};
CL3D.Light.prototype.clone = function () {
	var a = new CL3D.Light();
	a.Position = this.Position.clone();
	a.Color = this.Color.clone();
	a.Radius = this.Radius;
	a.Attenuation = this.Attenuation;
	return a
};
CL3D.Light.prototype.Position = null;
CL3D.Light.prototype.Color = null;
CL3D.Light.prototype.Attenuation = null;
CL3D.Light.prototype.Radius = null;
CL3D.LightSceneNode = function (a) {
	this.LightData = new CL3D.Light();
	this.Box = new CL3D.Box3d();
	this.init()
};
CL3D.LightSceneNode.prototype = new CL3D.SceneNode();
CL3D.LightSceneNode.prototype.LightData = null;
CL3D.LightSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.LightSceneNode();
	this.cloneMembers(b, a);
	b.LightData = this.LightData.clone();
	b.Box = this.Box.clone();
	return b
};
CL3D.LightSceneNode.prototype.OnRegisterSceneNode = function (a) {
	a.registerNodeForRendering(this, CL3D.Scene.RENDER_MODE_LIGHTS);
	CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, a);
	this.LightData.Position = this.getAbsolutePosition()
};
CL3D.LightSceneNode.prototype.getBoundingBox = function () {
	return this.Box
};
CL3D.LightSceneNode.prototype.render = function (a) {
	a.addDynamicLight(this.LightData)
};
CL3D.PathSceneNode = function () {
	this.init();
	this.Box = new CL3D.Box3d();
	this.Tightness = 0;
	this.IsClosedCircle = false;
	this.Nodes = new Array()
};
CL3D.PathSceneNode.prototype = new CL3D.SceneNode();
CL3D.PathSceneNode.prototype.Tightness = 0;
CL3D.PathSceneNode.prototype.IsClosedCircle = false;
CL3D.PathSceneNode.prototype.Nodes = new Array();
CL3D.PathSceneNode.prototype.getBoundingBox = function () {
	return this.Box
};
CL3D.PathSceneNode.prototype.getType = function () {
	return "path"
};
CL3D.PathSceneNode.prototype.createClone = function (b) {
	var e = new CL3D.PathSceneNode();
	this.cloneMembers(e, b);
	if (this.Box) {
		e.Box = this.Box.clone()
	}
	e.Tightness = this.Tightness;
	e.IsClosedCircle = this.IsClosedCircle;
	e.Nodes = new Array();
	for (var a = 0; a < this.Nodes.length; ++a) {
		var d = this.Nodes[a];
		e.Nodes.push(d.clone())
	}
	return e
};
CL3D.PathSceneNode.prototype.getPathNodePosition = function (a) {
	if (a < 0 || a >= this.Nodes.length) {
		return new CL3D.Vect3d(0, 0, 0)
	}
	if (!this.AbsoluteTransformation) {
		this.updateAbsolutePosition()
	}
	var b = this.Nodes[a];
	b = b.clone();
	this.AbsoluteTransformation.transformVect(b);
	return b
};
CL3D.PathSceneNode.prototype.clampPathIndex = function (a, b) {
	if (this.IsClosedCircle) {
		return (a < 0 ? (b + a) : ((a >= b) ? (a - b) : a))
	}
	return ((a < 0) ? 0 : ((a >= b) ? (b - 1) : a))
};
CL3D.PathSceneNode.prototype.getPointOnPath = function (p, a) {
	var h = this.Nodes.length;
	if (this.IsClosedCircle) {
		p *= h
	} else {
		p = CL3D.clamp(p, 0, 1);
		p *= h - 1
	}
	var e = new CL3D.Vect3d();
	if (h == 0) {
		return e
	}
	if (h == 1) {
		return e
	}
	var b = p;
	var o = CL3D.fract(b);
	var l = Math.floor(b) % h;
	var q = this.Nodes[this.clampPathIndex(l - 1, h)];
	var n = this.Nodes[this.clampPathIndex(l + 0, h)];
	var m = this.Nodes[this.clampPathIndex(l + 1, h)];
	var k = this.Nodes[this.clampPathIndex(l + 2, h)];
	var j = 2 * o * o * o - 3 * o * o + 1;
	var i = -2 * o * o * o + 3 * o * o;
	var g = o * o * o - 2 * o * o + o;
	var f = o * o * o - o * o;
	var d = m.substract(q);
	d.multiplyThisWithScal(this.Tightness);
	var c = k.substract(n);
	c.multiplyThisWithScal(this.Tightness);
	e = n.multiplyWithScal(j);
	e.addToThis(m.multiplyWithScal(i));
	e.addToThis(d.multiplyWithScal(g));
	e.addToThis(c.multiplyWithScal(f));
	if (!a) {
		if (!this.AbsoluteTransformation) {
			this.updateAbsolutePosition()
		}
		this.AbsoluteTransformation.transformVect(e)
	}
	return e
};
CL3D.SoundSceneNode = function () {
	this.init();
	this.Box = new CL3D.Box3d();
	this.MinDistance = 0;
	this.MaxDistance = 0;
	this.PlayMode = 0;
	this.DeleteWhenFinished = false;
	this.MaxTimeInterval = 0;
	this.MinTimeInterval = 0;
	this.Volume = 0;
	this.PlayAs2D = false;
	this.PlayingSound = null;
	this.SoundPlayCompleted = false;
	this.TimeMsDelayFinished = 0;
	this.PlayedCount = 0
};
CL3D.SoundSceneNode.prototype = new CL3D.SceneNode();
CL3D.SoundSceneNode.prototype.getBoundingBox = function () {
	return this.Box
};
CL3D.SoundSceneNode.prototype.getType = function () {
	return "sound"
};
CL3D.SoundSceneNode.prototype.OnRegisterSceneNode = function (a) {
	if (this.getVisible()) {
		a.registerNodeForRendering(this, CL3D.Scene.RENDER_MODE_DEFAULT);
		CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, a)
	}
};
CL3D.SoundSceneNode.prototype.get2DAngle = function (c, b) {
	if (b == 0) {
		return c < 0 ? 180 : 0
	} else {
		if (c == 0) {
			return b < 0 ? 90 : 270
		}
	}
	var a = b / Math.sqrt(c * c + b * b);
	a = Math.atan(Math.sqrt(1 - a * a) / a) * CL3D.RADTODEG;
	if (c > 0 && b > 0) {
		return a + 270
	} else {
		if (c > 0 && b < 0) {
			return a + 90
		} else {
			if (c < 0 && b < 0) {
				return 90 - a
			} else {
				if (c < 0 && b > 0) {
					return 270 - a
				}
			}
		}
	}
	return a
};
CL3D.SoundSceneNode.prototype.normalizeAngle = function (a) {
	return ((a % 360) + 360) % 360
};
CL3D.SoundSceneNode.normalizeRelativeAngle = function (a) {
	return ((a + 7 * 180) % (360)) - 1800
};
CL3D.SoundSceneNode.prototype.updateSoundFor3DSound = function (d, c, i) {
	var f = this.Volume;
	if (!i) {
		return
	}
	if (!d) {
		return
	}
	var a = i.getActiveCamera();
	if (!a) {
		return
	}
	var g = a.getAbsolutePosition();
	var e = a.getTarget().substract(g);
	var b = g.getDistanceTo(c);
	if (b < this.MinDistance) {} else {
		b -= this.MinDistance;
		var j = this.MaxDistance - this.MinDistance;
		if (j > 0) {
			if (false) {
				interpol = b / j;
				f = f * (10 - interpol)
			} else {
				if (b > j) {
					b = j
				}
				var h = 10;
				if (b != 0) {
					h = this.MinDistance / b
				}
				b *= this.RollOffFactor;
				f = f * h
			} if (f > 10) {
				f = 10
			}
		} else {
			f = 10
		}
	} if (f > 1) {
		f = 1
	}
	CL3D.gSoundManager.setVolume(d, f)
};
CL3D.SoundSceneNode.prototype.startSound = function (a) {
	if (!this.PlayingSound && this.TheSound) {
		this.SoundPlayCompleted = false;
		this.PlayingSound = CL3D.gSoundManager.play2D(this.TheSound, a);
		if (!this.PlayAs2D) {
			var b = this.getAbsolutePosition();
			this.updateSoundFor3DSound(this.PlayingSound, b, this.scene)
		}
	}
};
CL3D.SoundSceneNode.prototype.OnAnimate = function (b, f) {
	try {
		var d = this.getAbsolutePosition();
		if (this.PlayingSound && !this.PlayAs2D) {
			this.updateSoundFor3DSound(this.PlayingSound, d, b)
		}
		switch (this.PlayMode) {
		case 0:
			break;
		case 1:
			if (this.PlayingSound && this.PlayingSound.hasPlayingCompleted()) {
				this.PlayingSound = null;
				var c = this.MaxTimeInterval - this.MinTimeInterval;
				if (c < 2) {
					c = 2
				}
				this.TimeMsDelayFinished = f + (Math.random() * c) + this.MinTimeInterval
			} else {
				if (!this.PlayingSound && (!this.TimeMsDelayFinished || f > this.TimeMsDelayFinished)) {
					if (this.TheSound) {
						this.startSound(false)
					}
				}
			}
			break;
		case 2:
			if (!this.PlayingSound) {
				if (this.TheSound) {
					this.startSound(true)
				}
			}
			break;
		case 3:
			if (this.PlayedCount) {} else {
				if (this.TheSound) {
					this.startSound(true);
					++PlayedCount
				}
			}
			break
		}
	} catch (a) {}
	return false
};
CL3D.SoundSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.SoundSceneNode();
	this.cloneMembers(b, a);
	if (this.Box) {
		b.Box = this.Box.clone()
	}
	return b
};
CL3D.Overlay2DSceneNode = function (a) {
	this.init();
	this.engine = a;
	this.Box = new CL3D.Box3d();
	this.PosAbsoluteX = 100;
	this.PosAbsoluteY = 100;
	this.SizeAbsoluteWidth = 50;
	this.SizeAbsoluteHeight = 50;
	this.PosRelativeX = 0.5;
	this.PosRelativeY = 0.5;
	this.SizeRelativeWidth = 1 / 6;
	this.SizeRelativeHeight = 1 / 6;
	this.SizeModeIsAbsolute = true;
	this.ShowBackGround = true;
	this.BackGroundColor = 0;
	this.Texture = null;
	this.TextureHover = null;
	this.RetainAspectRatio = true;
	this.DrawText = false;
	this.TextAlignment = 1;
	this.Text = "";
	this.FontName = "";
	this.TextColor = 0;
	this.AnimateOnHover = false;
	this.OnHoverSetFontColor = false;
	this.HoverFontColor = false;
	this.OnHoverSetBackgroundColor = false;
	this.HoverBackgroundColor = false;
	this.OnHoverDrawTexture = false;
	this.TextTexture = null;
	this.TextHoverTexture = null;
	this.CreatedTextTextureText = "";
	this.CreatedTextTextureFontName = "";
	this.CurrentFontPixelHeight = 0
};
CL3D.Overlay2DSceneNode.prototype = new CL3D.SceneNode();
CL3D.Overlay2DSceneNode.prototype.getBoundingBox = function () {
	return this.Box
};
CL3D.Overlay2DSceneNode.prototype.getType = function () {
	return "2doverlay"
};
CL3D.Overlay2DSceneNode.prototype.set2DPosition = function (b, d, c, a) {
	this.PosAbsoluteX = b;
	this.PosAbsoluteY = d;
	this.SizeAbsoluteWidth = c;
	this.SizeAbsoluteHeight = a;
	this.SizeModeIsAbsolute = true
};
CL3D.Overlay2DSceneNode.prototype.setShowBackgroundColor = function (b, a) {
	this.ShowBackGround = b;
	if (this.ShowBackGround) {
		this.BackGroundColor = a
	}
};
CL3D.Overlay2DSceneNode.prototype.setShowImage = function (a) {
	this.Texture = a
};
CL3D.Overlay2DSceneNode.prototype.setText = function (a) {
	this.Text = a;
	this.DrawText = this.Text != null && this.Text != ""
};
CL3D.Overlay2DSceneNode.prototype.OnRegisterSceneNode = function (a) {
	if (this.getVisible()) {
		a.registerNodeForRendering(this, CL3D.Scene.RENDER_MODE_2DOVERLAY);
		CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, a)
	}
};
CL3D.Overlay2DSceneNode.prototype.render = function (l) {
	var d = this.getScreenCoordinatesRect(true, l);
	var f = d;
	var k = false;
	if (this.engine != null && this.AnimateOnHover) {
		var c = this.engine.getMouseX();
		var b = this.engine.getMouseY();
		k = (d.x <= c && d.y <= b && d.x + d.w >= c && d.y + d.h >= b)
	}
	if (k && this.OnHoverSetBackgroundColor) {
		l.draw2DRectangle(d.x, d.y, d.w, d.h, this.HoverBackgroundColor, true)
	} else {
		if (this.ShowBackGround) {
			l.draw2DRectangle(d.x, d.y, d.w, d.h, this.BackGroundColor, true)
		}
	}
	var n = this.Texture;
	if (k && this.TextureHover && this.OnHoverDrawTexture) {
		n = this.TextureHover
	}
	if (n != null && n.isLoaded()) {
		var m = n.getWidth();
		var j = n.getHeight();
		if (!this.RetainAspectRatio) {
			l.draw2DImage(d.x, d.y, d.w, d.h, n, true)
		} else {
			if (m && j && d.h && d.w) {
				var p = j / m;
				var a = d.w;
				var o = a * p;
				if (o > d.h) {
					var r = d.h / o;
					a *= r;
					o *= r
				}
				d.w = a;
				d.h = o;
				f = d;
				l.draw2DImage(d.x, d.y, d.w, d.h, n, true)
			}
		}
	}
	if (this.DrawText && this.FontName && this.Text != "") {
		this.createNewTextTexturesIfNecessary(l);
		var i = this.TextTexture;
		var e = this.TextColor;
		if (k) {
			if (this.TextHoverTexture) {
				i = this.TextHoverTexture
			}
			e = this.HoverFontColor
		}
		if (i) {
			var g = i.OriginalWidth;
			var q = i.OriginalHeight;
			if (this.TextAlignment == 0) {
				l.draw2DFontImage(d.x, d.y, g, q, i, e)
			} else {
				l.draw2DFontImage(d.x + ((d.w - g) / 2), d.y + ((d.h - q) / 2), g, q, i, e)
			}
		}
	} else {
		this.destroyTextTextures(l)
	}
};
CL3D.Overlay2DSceneNode.prototype.destroyTextTextures = function (a) {
	a.deleteTexture(this.TextTexture);
	a.deleteTexture(this.TextHoverTexture);
	this.TextTexture = null;
	this.TextHoverTexture = null
};
CL3D.Overlay2DSceneNode.prototype.createNewTextTexturesIfNecessary = function (g) {
	var e = false;
	var a = this.TextTexture == null || (e && this.TextHoverTexture == null);
	if (!a) {
		a = this.CreatedTextTextureText != this.Text || this.CreatedTextTextureFontName != this.FontName
	}
	if (!a) {
		return
	}
	this.destroyTextTextures(g);
	var b = document.createElement("canvas");
	if (b == null) {
		return
	}
	b.width = 1;
	b.height = 1;
	try {
		var i = b.getContext("2d");
		if (i == null) {
			return
		}
	} catch (d) {
		return
	}
	var j = 12;
	var c = this.parseCopperCubeFontString(this.FontName);
	i.font = c;
	var f = i.measureText(this.Text);
	b.width = f.width;
	b.height = this.CurrentFontPixelHeight * 1.2;
	i.fillStyle = "rgba(0, 0, 0, 1)";
	i.fillRect(0, 0, b.width, b.height);
	i.fillStyle = "rgba(255, 255, 255, 1)";
	i.textBaseline = "top";
	i.font = c;
	i.fillText(this.Text, 0, 0);
	var h = g.createTextureFrom2DCanvas(b, true);
	this.TextTexture = h;
	this.TextHoverTexture = h;
	this.CreatedTextTextureText = this.Text;
	this.CreatedTextTextureFontName = this.FontName
};
CL3D.Overlay2DSceneNode.prototype.getMaterialCount = function () {
	return 0
};
CL3D.Overlay2DSceneNode.prototype.getScreenCoordinatesRect = function (d, e) {
	var b = e.getWidth();
	var c = e.getHeight();
	var a = new Object();
	if (this.SizeModeIsAbsolute) {
		a.x = this.PosAbsoluteX;
		a.y = this.PosAbsoluteY;
		a.w = this.SizeAbsoluteWidth;
		a.h = this.SizeAbsoluteHeight
	} else {
		a.x = this.PosRelativeX * b;
		a.y = this.PosRelativeY * c;
		a.w = this.SizeRelativeWidth * b;
		a.h = this.SizeRelativeHeight * c
	}
	return a
};
CL3D.Overlay2DSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.Overlay2DSceneNode();
	this.cloneMembers(b, a);
	b.PosAbsoluteX = this.PosAbsoluteX;
	b.PosAbsoluteY = this.PosAbsoluteY;
	b.SizeAbsoluteWidth = this.SizeAbsoluteWidth;
	b.SizeAbsoluteHeight = this.SizeAbsoluteHeight;
	b.PosRelativeX = this.PosRelativeX;
	b.PosRelativeY = this.PosRelativeY;
	b.SizeRelativeWidth = this.SizeRelativeWidth;
	b.SizeRelativeHeight = this.SizeRelativeHeight;
	b.SizeModeIsAbsolute = this.SizeModeIsAbsolute;
	b.ShowBackGround = this.ShowBackGround;
	b.BackGroundColor = this.BackGroundColor;
	b.Texture = this.Texture;
	b.TextureHover = this.TextureHover;
	b.RetainAspectRatio = this.RetainAspectRatio;
	b.DrawText = this.DrawText;
	b.TextAlignment = this.TextAlignment;
	b.Text = this.Text;
	b.FontName = this.FontName;
	b.TextColor = this.TextColor;
	b.AnimateOnHover = this.AnimateOnHover;
	b.OnHoverSetFontColor = this.OnHoverSetFontColor;
	b.HoverFontColor = this.HoverFontColor;
	b.OnHoverSetBackgroundColor = this.OnHoverSetBackgroundColor;
	b.HoverBackgroundColor = this.HoverBackgroundColor;
	b.OnHoverDrawTexture = this.OnHoverDrawTexture;
	return b
};
CL3D.Overlay2DSceneNode.prototype.parseCopperCubeFontString = function (c) {
	var d = 12;
	var f = "Arial";
	var g = false;
	var a = false;
	if (c.indexOf("#fnt_") == 0) {
		c = c.substr(5)
	}
	var k = c.split(";");
	for (var e = 0; e < k.length; ++e) {
		var l = k[e];
		var b = l.toLowerCase();
		if (e == 0) {
			var j = parseInt(b);
			d = j
		} else {
			if (e == 2) {
				f = l
			} else {
				if (e == 3) {
					if (b.indexOf("italic") != -1) {
						g = true
					}
				} else {
					if (e == 4) {
						if (b.indexOf("bold") != -1) {
							a = true
						}
					}
				}
			}
		}
	}
	var h = "";
	if (g) {
		h += "italic "
	}
	if (a) {
		h += "bold "
	}
	this.CurrentFontPixelHeight = (d * 96 / 72);
	h += this.CurrentFontPixelHeight + "px ";
	h += f;
	return h
};
CL3D.HotspotSceneNode = function () {
	this.Box = new CL3D.Box3d();
	this.Width = 0;
	this.Height = 0
};
CL3D.HotspotSceneNode.prototype = new CL3D.SceneNode();
CL3D.DummyTransformationSceneNode = function () {
	this.init();
	this.Box = new CL3D.Box3d();
	this.RelativeTransformationMatrix = new CL3D.Matrix4()
};
CL3D.DummyTransformationSceneNode.prototype = new CL3D.SceneNode();
CL3D.DummyTransformationSceneNode.prototype.createClone = function (a) {
	var b = new CL3D.DummyTransformationSceneNode();
	this.cloneMembers(b, a);
	if (this.Box) {
		b.Box = this.Box.clone()
	}
	if (this.RelativeTransformationMatrix) {
		b.RelativeTransformationMatrix = this.RelativeTransformationMatrix
	}
	return b
};
CL3D.DummyTransformationSceneNode.prototype.getRelativeTransformation = function () {
	return this.RelativeTransformationMatrix
};
CL3D.AnimatedMeshSceneNode = function () {
	this.init();
	this.Box = new CL3D.Box3d();
	this.DoesCollision = false;
	this.Mesh = null;
	this.Selector = null;
	this.LastLODSkinnedAnimationTime = 0;
	this.Transiting = 0;
	this.TransitingBlend = 0;
	this.Materials = new Array();
	this.FramesPerSecond = 25 / 100;
	this.BeginFrameTime = CL3D.CLTimer.getTime();
	this.FrameWhenCurrentMeshWasGenerated = 0;
	this.StartFrame = 0;
	this.EndFrame = 0;
	this.Looping = false;
	this.CurrentFrameNr = 0;
	this.MinimalUpdateDelay = 20
};
CL3D.AnimatedMeshSceneNode.prototype = new CL3D.SceneNode();
CL3D.AnimatedMeshSceneNode.prototype.getBoundingBox = function () {
	return this.Box
};
CL3D.AnimatedMeshSceneNode.prototype.getNamedAnimationCount = function () {
	if (this.Mesh && this.Mesh.NamedAnimationRanges) {
		return this.Mesh.NamedAnimationRanges.length
	}
	return 0
};
CL3D.AnimatedMeshSceneNode.prototype.getNamedAnimationInfo = function (b) {
	var a = this.getNamedAnimationCount();
	if (b >= 0 && b < a) {
		return this.Mesh.NamedAnimationRanges[b]
	}
	return null
};
CL3D.AnimatedMeshSceneNode.prototype.setAnimation = function (a) {
	if (!this.Mesh) {
		return false
	}
	var b = this.Mesh.getNamedAnimationRangeByName(a);
	if (!b) {
		return false
	}
	this.setFrameLoop(b.Begin, b.End);
	this.setAnimationSpeed(b.FPS);
	return true
};
CL3D.AnimatedMeshSceneNode.prototype.setMesh = function (a) {
	if (!a) {
		return
	}
	this.Mesh = a;
	this.Box = a.getBoundingBox();
	this.setFrameLoop(0, a.getFrameCount())
};
CL3D.AnimatedMeshSceneNode.prototype.getType = function () {
	return "animatedmesh"
};
CL3D.AnimatedMeshSceneNode.prototype.OnRegisterSceneNode = function (a) {
	if (this.getVisible() && this.Mesh) {
		a.registerNodeForRendering(this, CL3D.Scene.RENDER_MODE_DEFAULT);
		CL3D.SceneNode.prototype.OnRegisterSceneNode.call(this, a);
	}
};
CL3D.AnimatedMeshSceneNode.prototype.render = function (a) {
	a.setWorld(this.AbsoluteTransformation);
	a.drawMesh(this.OwnedMesh)
};
CL3D.AnimatedMeshSceneNode.prototype.getMaterialCount = function () {
	if (this.OwnedMesh) {
		return this.OwnedMesh.MeshBuffers.length
	}
	return 0
};
CL3D.AnimatedMeshSceneNode.prototype.getMaterial = function (a) {
	if (this.Materials) {
		if (a >= 0 && a < this.Materials.length) {
			return this.Materials[a]
		} else {
			if (this.Mesh && this.Mesh.AnimatedMeshesToLink && (a >= 0) && (this.Materials.length == a) && (a < 256)) {
				var b = new CL3D.Material();
				this.Materials.push(b);
				return b
			}
		}
	}
	return null
};
CL3D.AnimatedMeshSceneNode.prototype.createClone = function (b) {
	var d = new CL3D.AnimatedMeshSceneNode();
	this.cloneMembers(d, b);
	d.Mesh = this.Mesh;
	if (this.Box) {
		d.Box.setTo(this.Box);
	}
	d.DoesCollision = this.DoesCollision;
	d.Selector = this.Selector;
	d.LastLODSkinnedAnimationTime = this.LastLODSkinnedAnimationTime;
	d.Transiting = this.Transiting;
	d.TransitingBlend = this.TransitingBlend;
	d.Materials = new Array(this.Materials.length);
	for (var a = 0; a < this.Materials.length; ++a) {
		d.Materials[a] = this.Materials[a].clone()
	}
	d.FramesPerSecond = this.FramesPerSecond;
	d.BeginFrameTime = this.BeginFrameTime;
	d.FrameWhenCurrentMeshWasGenerated = this.FrameWhenCurrentMeshWasGenerated;
	d.StartFrame = this.StartFrame;
	d.EndFrame = this.EndFrame;
	d.Looping = this.Looping;
	d.CurrentFrameNr = this.CurrentFrameNr;
	d.MinimalUpdateDelay = this.MinimalUpdateDelay;
	return d
};
CL3D.AnimatedMeshSceneNode.prototype.setAnimationSpeed = function (a) {
	this.FramesPerSecond = a
};
CL3D.AnimatedMeshSceneNode.prototype.setLoopMode = function (a) {
	this.Looping = a
};
CL3D.AnimatedMeshSceneNode.prototype.setFrameLoop = function (d, a) {
	if (!this.Mesh) {
		return false
	}
	var b = this.Mesh.getFrameCount() - 1;
	var e = this.StartFrame;
	var c = this.EndFrame;
	if (a < d) {
		this.StartFrame = CL3D.clamp(a, 0, b);
		this.EndFrame = CL3D.clamp(d, this.StartFrame, b)
	} else {
		this.StartFrame = CL3D.clamp(d, 0, b);
		this.EndFrame = CL3D.clamp(a, this.StartFrame, b)
	} if (e != this.StartFrame || c != this.EndFrame) {
		this.setCurrentFrame(this.StartFrame)
	}
	return true
};
CL3D.AnimatedMeshSceneNode.prototype.setCurrentFrame = function (a) {
	this.CurrentFrameNr = CL3D.clamp(a, this.StartFrame, this.EndFrame);
	this.BeginFrameTime = CL3D.CLTimer.getTime() - Math.floor((this.CurrentFrameNr - this.StartFrame) / this.FramesPerSecond)
};
CL3D.AnimatedMeshSceneNode.prototype.buildFrameNr = function (d) {
	var c = 0;
	if (this.Transiting != 0) {
		this.TransitingBlend = (d - this.BeginFrameTime) * this.Transiting;
		if (this.TransitingBlend > 1) {
			this.Transiting = 0;
			this.TransitingBlend = 0
		}
	}
	if (this.StartFrame == this.EndFrame) {
		return this.StartFrame
	}
	if (this.FramesPerSecond == 0) {
		return this.StartFrame
	}
	var b = 0;
	if (this.Looping) {
		var a = Math.abs(Math.floor((this.EndFrame - this.StartFrame) / this.FramesPerSecond));
		if (this.FramesPerSecond > 0) {
			b = this.StartFrame + ((d - this.BeginFrameTime) % a) * this.FramesPerSecond
		} else {
			b = this.EndFrame - ((d - this.BeginFrameTime) % a) * -this.FramesPerSecond
		}
	} else {
		if (this.FramesPerSecond > 0) {
			c = (d - this.BeginFrameTime) * this.FramesPerSecond;
			b = this.StartFrame + c;
			if (b > this.EndFrame) {
				b = this.EndFrame
			}
		} else {
			c = (d - this.BeginFrameTime) * (-this.FramesPerSecond);
			b = this.EndFrame - c;
			if (b < this.StartFrame) {
				b = this.StartFrame
			}
		}
	}
	return b
};
CL3D.AnimatedMeshSceneNode.prototype.getFrameNr = function () {
	return this.CurrentFrameNr
};
CL3D.AnimatedMeshSceneNode.prototype.calculateMeshForCurrentFrame = function () {
	var d = this.Mesh;
	if (!d) {
		return
	}
	var b = false;
	b = d.animateMesh(this.getFrameNr(), 1);
	if (b) {
		d.skinMesh();
		d.updateBoundingBox();
		this.Box.setTo( d.getBoundingBox() );
		for (var c = 0; c < d.LocalBuffers.length; ++c) {
			var a = d.LocalBuffers[c];
			a.update(true)
		}
	}
	this.FrameWhenCurrentMeshWasGenerated = this.CurrentFrameNr
};
CL3D.AnimatedMeshSceneNode.prototype.setMinimalUpdateDelay = function (a) {
	this.MinimalUpdateDelay = a
};
CL3D.AnimatedMeshSceneNode.prototype.OnAnimate = function (c, e) {
	var b = false;
	var a = CL3D.CLTimer.getTime();
	if (this.LastLODSkinnedAnimationTime == 0 || a - this.LastLODSkinnedAnimationTime > this.MinimalUpdateDelay) {
		var d = this.buildFrameNr(e);
		b = this.CurrentFrameNr != d;
		this.CurrentFrameNr = d;
		this.LastLODSkinnedAnimationTime = a
	}
	return CL3D.SceneNode.prototype.OnAnimate.call(this, c, e)
};
CL3D.AnimatedMeshSceneNode.prototype.render = function (c) {
	var b, matLength;
	c.setWorld(this.AbsoluteTransformation);
	var d = this.Mesh;
	if (d) {
		this.calculateMeshForCurrentFrame();
		matLength = this.Materials.length;
		b = d.LocalBuffers.length;
		while ( b-- ) {
			var a = d.LocalBuffers[b];
			if (b < matLength) {
				a.Mat = this.Materials[b];
			}
			if (a.Transformation != null) {
				c.setWorld( _tempM0.setTo(this.AbsoluteTransformation).multiplyThisWith(a.Transformation) );
			}
			c.setMaterial(a.Mat);
			c.drawMeshBuffer(a);
			if (a.Transformation != null) {
				c.setWorld(this.AbsoluteTransformation);
			}
		}
	}
};
CL3D.Animator = function () {
	this.Type = -1
};
CL3D.Animator.prototype.getType = function () {
	return "none"
};
CL3D.Animator.prototype.animateNode = function (b, a) {
	return false
};
CL3D.Animator.prototype.onMouseDown = function (a) {};
CL3D.Animator.prototype.onMouseWheel = function (a) {};
CL3D.Animator.prototype.onMouseUp = function (a) {};
CL3D.Animator.prototype.onMouseMove = function (a) {};
CL3D.Animator.prototype.onKeyDown = function (a) {
	return false
};
CL3D.Animator.prototype.onKeyUp = function (a) {
	return false
};
CL3D.Animator.prototype.reset = function (a) {};
CL3D.AnimatorCameraFPS = function (b, a) {
	this.Type = -1;
	this.lastAnimTime = 0;
	this.NoVerticalMovement = false;
	this.moveByMouseDown = true;
	this.moveByMouseMove = false;
	this.moveByPanoDrag = false;
	this.leftKeyDown = false;
	this.rightKeyDown = false;
	this.upKeyDown = false;
	this.downKeyDown = false;
	this.jumpKeyDown = false;
	this.relativeRotationX = 0;
	this.relativeRotationY = 0;
	this.minZoom = 20;
	this.maxZoom = 100;
	this.zoomSpeed = (this.maxZoom - this.minZoom) / 50;
	this.targetZoomValue = 90;
	this.lastAnimTime = CL3D.CLTimer.getTime();
	this.Camera = b;
	this.CursorControl = a;
	if (b) {
		this.lookAt(b.getTarget())
	}
};
CL3D.AnimatorCameraFPS.prototype = new CL3D.Animator();
CL3D.AnimatorCameraFPS.prototype.getType = function () {
	return "camerafps"
};
CL3D.AnimatorCameraFPS.prototype.MaxVerticalAngle = 88;
CL3D.AnimatorCameraFPS.prototype.MoveSpeed = 0.06;
CL3D.AnimatorCameraFPS.prototype.RotateSpeed = 200;
CL3D.AnimatorCameraFPS.prototype.JumpSpeed = 0;
CL3D.AnimatorCameraFPS.prototype.NoVerticalMovement = false;
CL3D.AnimatorCameraFPS.prototype.MayMove = true;
CL3D.AnimatorCameraFPS.prototype.MayZoom = true;
CL3D.AnimatorCameraFPS.prototype.setMayMove = function (a) {
	this.MayMove = a
};
CL3D.AnimatorCameraFPS.prototype.setLookByMouseDown = function (a) {
	this.moveByMouseDown = a;
	this.moveByMouseMove = !a
};
CL3D.AnimatorCameraFPS.prototype.lookAt = function (b) {
	if (this.Camera == null) {
		return
	}
	var a = b.substract(this.Camera.Pos);
	a = a.getHorizontalAngle();
	this.relativeRotationX = a.X;
	this.relativeRotationY = a.Y;
	if (this.relativeRotationX > this.MaxVerticalAngle) {
		this.relativeRotationX -= 360
	}
};
CL3D.AnimatorCameraFPS.prototype.animateNode = function (k, u) {
	if (this.Camera == null) {
		return false
	}
	if (!(this.Camera.scene.getActiveCamera() === this.Camera)) {
		return false
	}
	var b = CL3D.CLTimer.getTime();
	var j = b - this.lastAnimTime;
	if (j > 250) {
		j = 250
	}
	this.lastAnimTime = b;
	var e = this.Camera.Pos.clone();
	if (this.MayMove && (this.upKeyDown || this.downKeyDown)) {
		var g = this.Camera.Pos.substract(this.Camera.getTarget());
		if (this.NoVerticalMovement) {
			g.Y = 0
		}
		g.normalize();
		if (this.upKeyDown) {
			e.addToThis(g.multiplyWithScal(this.MoveSpeed * -j))
		}
		if (this.downKeyDown) {
			e.addToThis(g.multiplyWithScal(this.MoveSpeed * j))
		}
	}
	if (this.MayMove && (this.leftKeyDown || this.rightKeyDown)) {
		var d = this.Camera.Pos.substract(this.Camera.getTarget()).crossProduct(this.Camera.getUpVector());
		d.normalize();
		if (this.leftKeyDown) {
			d = d.multiplyWithScal(this.MoveSpeed * -j);
			e.addToThis(d);
			this.Camera.setTarget(this.Camera.getTarget().add(d))
		}
		if (this.rightKeyDown) {
			d = d.multiplyWithScal(this.MoveSpeed * j);
			e.addToThis(d);
			this.Camera.setTarget(this.Camera.getTarget().add(d))
		}
	}
	this.Camera.Pos = e;
	if (this.MayZoom) {
		var h = CL3D.radToDeg(this.Camera.getFov());
		this.targetZoomValue += this.getAdditionalZoomDiff() * j;
		if (this.targetZoomValue < this.minZoom) {
			this.targetZoomValue = this.minZoom
		}
		if (this.targetZoomValue > this.maxZoom) {
			this.targetZoomValue = this.maxZoom
		}
		var r = this.zoomSpeed;
		r = Math.abs(this.targetZoomValue - h) / 8;
		if (r < this.zoomSpeed) {
			r = this.zoomSpeed
		}
		if (h < this.maxZoom - r && h < this.targetZoomValue) {
			h += r;
			if (h > this.maxZoom) {
				h = this.maxZoom
			}
		}
		if (h > this.minZoom + r && h > this.targetZoomValue) {
			h -= r;
			if (h < this.minZoom) {
				h = this.minZoom
			}
		}
		this.Camera.setFov(CL3D.degToRad(h))
	}
	var w = new CL3D.Vect3d(0, 0, 1);
	var s = new CL3D.Matrix4();
	s.setRotationDegrees(new CL3D.Vect3d(this.relativeRotationX, this.relativeRotationY, 0));
	s.transformVect(w);
	var t = 300;
	var c = 0;
	var m = 1 / 50000;
	var l = 1 / 50000;
	if (this.moveByMouseDown) {
		m *= 3;
		l *= 3
	}
	if (this.moveByMouseMove) {
		var f = this.CursorControl.getRenderer().getHeight();
		var o = this.CursorControl.getMouseY();
		if (f > 0 && o > 0 && this.CursorControl.isMouseOverCanvas()) {
			c = Math.sin((o - (f / 2)) / f) * 100 * 0.5
		}
	} else {
		if (this.moveByMouseDown || this.moveByPanoDrag) {
			if (this.CursorControl.isMouseDown()) {
				c = this.CursorControl.getMouseY() - this.CursorControl.getMouseDownY();
				if (c != 0) {
					this.CursorControl.LastCameraDragTime = b
				}
			}
		}
	}
	c += this.getAdditionalYLookDiff();
	if (c > t) {
		c = t
	}
	if (c < -t) {
		c = -t
	}
	this.relativeRotationX += c * (j * (this.RotateSpeed * l));
	if (this.relativeRotationX < -this.MaxVerticalAngle) {
		this.relativeRotationX = -this.MaxVerticalAngle
	}
	if (this.relativeRotationX > this.MaxVerticalAngle) {
		this.relativeRotationX = this.MaxVerticalAngle
	}
	var i = 0;
	if (this.moveByMouseMove) {
		var q = this.CursorControl.getRenderer().getWidth();
		var p = this.CursorControl.getMouseX();
		if (q > 0 && p > 0 && this.CursorControl.isMouseOverCanvas()) {
			i = Math.sin((p - (q / 2)) / q) * 100 * 0.5
		}
	} else {
		if (this.moveByMouseDown || this.moveByPanoDrag) {
			if (this.CursorControl.isMouseDown()) {
				i = (this.CursorControl.getMouseX() - this.CursorControl.getMouseDownX());
				if (i != 0) {
					this.CursorControl.LastCameraDragTime = b
				}
			}
		}
	}
	i += this.getAdditionalXLookDiff();
	if (i > t) {
		i = t
	}
	if (i < -t) {
		i = -t
	}
	this.relativeRotationY += i * (j * (this.RotateSpeed * m));
	if (this.moveByMouseDown || this.moveByPanoDrag) {
		this.CursorControl.setMouseDownWhereMouseIsNow()
	}
	if (this.MayMove && this.jumpKeyDown) {
		var v = k.getAnimatorOfType("collisionresponse");
		if (v && !v.isFalling()) {
			v.jump(this.JumpSpeed)
		}
	}
	this.Camera.setTarget(this.Camera.Pos.add(w));
	return false
};
CL3D.AnimatorCameraFPS.prototype.onMouseDown = function (a) {
	CL3D.Animator.prototype.onMouseDown.call(this, a)
};
CL3D.AnimatorCameraFPS.prototype.onMouseWheel = function (a) {
	CL3D.Animator.prototype.onMouseWheel.call(this, a);
	this.targetZoomValue += a.delta * this.zoomSpeed;
	if (this.targetZoomValue < this.minZoom) {
		this.targetZoomValue = this.minZoom
	}
	if (this.targetZoomValue > this.maxZoom) {
		this.targetZoomValue = this.maxZoom
	}
};
CL3D.AnimatorCameraFPS.prototype.onMouseUp = function (a) {
	CL3D.Animator.prototype.onMouseUp.call(this, a)
};
CL3D.AnimatorCameraFPS.prototype.onMouseMove = function (a) {
	CL3D.Animator.prototype.onMouseMove.call(this, a)
};
CL3D.AnimatorCameraFPS.prototype.setKeyBool = function (b, a) {
	if (a == 37 || a == 65) {
		this.leftKeyDown = b;
		if (b) {
			this.rightKeyDown = false
		}
		return true
	}
	if (a == 39 || a == 68) {
		this.rightKeyDown = b;
		if (b) {
			this.leftKeyDown = false
		}
		return true
	}
	if (a == 38 || a == 87) {
		this.upKeyDown = b;
		if (b) {
			this.downKeyDown = false
		}
		return true
	}
	if (a == 40 || a == 83) {
		this.downKeyDown = b;
		if (b) {
			this.upKeyDown = false
		}
		return true
	}
	if (a == 32) {
		this.jumpKeyDown = b;
		return true
	}
	return false
};
CL3D.AnimatorCameraFPS.prototype.onKeyDown = function (a) {
	return this.setKeyBool(true, a.keyCode)
};
CL3D.AnimatorCameraFPS.prototype.onKeyUp = function (a) {
	return this.setKeyBool(false, a.keyCode)
};
CL3D.AnimatorCameraFPS.prototype.getAdditionalXLookDiff = function () {
	return 0
};
CL3D.AnimatorCameraFPS.prototype.getAdditionalYLookDiff = function () {
	return 0
};
CL3D.AnimatorCameraFPS.prototype.getAdditionalZoomDiff = function () {
	return 0
};
CL3D.AnimatorCameraModelViewer = function (b, a) {
	this.Type = -1;
	this.RotateSpeed = 10000;
	this.Radius = 100;
	this.NoVerticalMovement = false;
	this.lastAnimTime = Date.now();//CL3D.CLTimer.getTime();
	this.Camera = b;
	this.CursorControl = a;
	this.SlideAfterMovementEnd = false;
	this.SlidingSpeed = 0;
	this.SlidingMoveX = 0;
	this.SlidingMoveY = 0
};
CL3D.AnimatorCameraModelViewer.prototype = new CL3D.Animator();
CL3D.AnimatorCameraModelViewer.prototype.getType = function () {
	return "cameramodelviewer"
};
CL3D.AnimatorCameraModelViewer.prototype.RotateSpeed = 0.06;
CL3D.AnimatorCameraModelViewer.prototype.Radius = 100;
CL3D.AnimatorCameraModelViewer.prototype.NoVerticalMovement = false;
CL3D.AnimatorCameraModelViewer.prototype.animateNode = function (e, c) {
	if (this.Camera == null) {
		return false
	}
	if (!(this.Camera.scene.getActiveCamera() === this.Camera)) {
		return false
	}
	var b = Date.now();//CL3D.CLTimer.getTime();
	var a = b - this.lastAnimTime;
	if (a > 250) {
		a = 250
	}
	this.lastAnimTime = b;
	_tempV0.setTo(this.Camera.Pos);
	_tempV1.setTo(this.Camera.Target);
	_tempV2.setTo(_tempV1).substractFromThis(this.Camera.getAbsolutePosition());
	var f = 0;
	var d = 0;
	if (this.CursorControl.isMouseDown()) {
		f = (this.CursorControl.getMouseX() - this.CursorControl.getMouseDownX()) * this.RotateSpeed / 50000;
		d = (this.CursorControl.getMouseY() - this.CursorControl.getMouseDownY()) * this.RotateSpeed / 50000
	}
	if (this.SlideAfterMovementEnd && this.SlidingSpeed != 0) {
		if (CL3D.iszero(f)) {
			f = this.SlidingMoveX;
			this.SlidingMoveX *= 0.9;
			if (this.SlidingMoveX > 0) {
				this.SlidingMoveX = Math.max(0, this.SlidingMoveX - (a / this.SlidingSpeed))
			} else {
				if (this.SlidingMoveX < 0) {
					this.SlidingMoveX = Math.min(0, this.SlidingMoveX + (a / this.SlidingSpeed))
				}
			}
		} else {
			this.SlidingMoveX = f * (this.SlidingSpeed / 1000)
		} if (CL3D.iszero(d)) {
			d = this.SlidingMoveY;
			this.SlidingMoveY *= 0.9;
			if (this.SlidingMoveY > 0) {
				this.SlidingMoveY = Math.max(0, this.SlidingMoveY - (a / this.SlidingSpeed))
			} else {
				if (this.SlidingMoveY < 0) {
					this.SlidingMoveY = Math.min(0, this.SlidingMoveY + (a / this.SlidingSpeed))
				}
			}
		} else {
			this.SlidingMoveY = d * (this.SlidingSpeed / 1000)
		}
	}
	_tempV5.setTo(_tempV2).crossProductTo(this.Camera.UpVector);
	_tempV5.Y = 0;
	_tempV5.normalize();
	if (!CL3D.iszero(f)) {
		_tempV5.multiplyThisWithScal(a * f);
		_tempV0.addToThis(_tempV5)
	}
	if (!this.NoVerticalMovement && !CL3D.iszero(d)) {
		_tempV5.setTo( this.Camera.UpVector );
		_tempV5.normalize();
		_tempV3.setTo(_tempV0).addToThis( _tempV5.multiplyThisWithScal(a * d) );
		_tempV4.setTo( _tempV3 );
		_tempV4.Y = _tempV1.Y;
		var o = this.Radius / 10;
		if (_tempV4.getDistanceTo(_tempV1) > o) {
			_tempV0.setTo(_tempV3);
		}
	}
	this.CursorControl.setMouseDownWhereMouseIsNow();
	_tempV2.setTo(_tempV0).substractFromThis(_tempV1);
	_tempV2.setLength(this.Radius);
	_tempV0.setTo(_tempV1).addToThis(_tempV2);
	this.Camera.Pos.setTo(_tempV0);
	return false
};
CL3D.AnimatorFollowPath = function (a) {
	this.TimeNeeded = 5000;
	this.TriedToLinkWithPath = false;
	this.IsCamera = false;
	this.LookIntoMovementDirection = false;
	this.OnlyMoveWhenCameraActive = true;
	this.TimeDisplacement = 0;
	this.LastTimeCameraWasInactive = true;
	this.EndMode = CL3D.AnimatorFollowPath.EFPFEM_START_AGAIN;
	this.SwitchedToNextCamera = false;
	this.Manager = a;
	this.StartTime = 0;
	this.TriedToLinkWithPath = false;
	this.LastObject = null;
	this.PathNodeToFollow = null;
	this.SwitchedToNextCamera = false;
	this.PathToFollow = null;
	this.TimeDisplacement = 0;
	this.AdditionalRotation = null;
	this.CameraToSwitchTo = null
};
CL3D.AnimatorFollowPath.prototype = new CL3D.Animator();
CL3D.AnimatorFollowPath.EFPFEM_START_AGAIN = 0;
CL3D.AnimatorFollowPath.EFPFEM_STOP = 1;
CL3D.AnimatorFollowPath.EFPFEM_SWITCH_TO_CAMERA = 2;
CL3D.AnimatorFollowPath.prototype.getType = function () {
	return "followpath"
};
CL3D.AnimatorFollowPath.prototype.setOptions = function (b, c, a) {
	this.EndMode = b;
	this.LookIntoMovementDirection = a;
	this.TimeNeeded = c
};
CL3D.AnimatorFollowPath.prototype.animateNode = function (d, c) {
	if (d == null || !this.Manager || !this.TimeNeeded) {
		return false
	}
	if (!(d === this.LastObject)) {
		this.setNode(d);
		return false
	}
	this.linkWithPath();
	if (this.PathNodeToFollow == null) {
		return false
	}
	var f = false;
	var a = null;
	if (this.IsCamera && this.OnlyMoveWhenCameraActive) {
		var e = !this.LastTimeCameraWasInactive;
		a = d;
		if (!(this.Manager.getActiveCamera() === a)) {
			if (this.PathNodeToFollow.Nodes.length) {
				a.Pos = this.PathNodeToFollow.getPathNodePosition(0)
			}
			this.LastTimeCameraWasInactive = true;
			return false
		} else {
			this.LastTimeCameraWasInactive = false
		} if (!this.StartTime || !e) {
			this.StartTime = c
		}
	}
	if (!this.StartTime) {
		this.StartTime = this.Manager.getStartTime()
	}
	var o = (c - this.StartTime + this.TimeDisplacement) / this.TimeNeeded;
	if (o > 1 && !this.PathNodeToFollow.IsClosedCircle) {
		switch (this.EndMode) {
		case CL3D.AnimatorFollowPath.EFPFEM_START_AGAIN:
			o = o % 1;
			break;
		case CL3D.AnimatorFollowPath.EFPFEM_STOP:
			o = 1;
			break;
		case CL3D.AnimatorFollowPath.EFPFEM_SWITCH_TO_CAMERA:
			o = 1;
			if (!this.SwitchedToNextCamera) {
				this.switchToNextCamera();
				this.SwitchedToNextCamera = true
			}
			break
		}
	} else {
		this.SwitchedToNextCamera = false
	}
	var l = this.PathNodeToFollow.getPointOnPath(o);
	f = !l.equals(d.Pos);
	d.Pos = l;
	if (this.LookIntoMovementDirection && this.PathNodeToFollow.Nodes.length) {
		var g = o + 0.001;
		var h;
		if (this.PathNodeToFollow.IsClosedCircle) {
			h = this.PathNodeToFollow.getPointOnPath(g)
		} else {
			h = this.PathNodeToFollow.getPointOnPath(g)
		} if (!CL3D.iszero(h.getDistanceTo(l))) {
			var k = h.substract(l);
			k.setLength(100);
			if (this.IsCamera) {
				a = d;
				var j = l.add(k);
				f = f || !j.equals(a.Target);
				a.setTarget(j)
			} else {
				var b;
				if (!this.AdditionalRotation || this.AdditionalRotation.equalsZero()) {
					b = k.getHorizontalAngle();
					f = f || !b.equals(d.Rot);
					d.Rot = b
				} else {
					var m = new CL3D.Matrix4();
					m.setRotationDegrees(k.getHorizontalAngle());
					var i = new CL3D.Matrix4();
					i.setRotationDegrees(this.AdditionalRotation);
					m = m.multiply(i);
					b = m.getRotationDegrees();
					f = f || !b.equals(d.Rot);
					d.Rot = b
				}
			}
		}
	}
	return f
};
CL3D.AnimatorFollowPath.prototype.setNode = function (a) {
	this.LastObject = a;
	if (this.LastObject) {
		this.IsCamera = (this.LastObject.getType() == "camera")
	}
};
CL3D.AnimatorFollowPath.prototype.linkWithPath = function () {
	if (this.PathNodeToFollow) {
		return
	}
	if (this.TriedToLinkWithPath) {
		return
	}
	if (!this.PathToFollow.length) {
		return
	}
	if (!this.Manager) {
		return
	}
	var a = this.Manager.getSceneNodeFromName(this.PathToFollow);
	if (a && a.getType() == "path") {
		this.setPathToFollow(a)
	}
};
CL3D.AnimatorFollowPath.prototype.setPathToFollow = function (a) {
	this.PathNodeToFollow = a
};
CL3D.AnimatorFollowPath.prototype.switchToNextCamera = function () {
	if (!this.Manager) {
		return
	}
	if (!this.CameraToSwitchTo.length) {
		return
	}
	var a = this.Manager.getSceneNodeFromName(this.CameraToSwitchTo);
	if (a && a.getType() == "camera") {
		var b = this.Manager.getLastUsedRenderer();
		if (b) {
			a.setAutoAspectIfNoFixedSet(b.getWidth(), b.getHeight())
		}
		this.Manager.setActiveCamera(a)
	}
};
CL3D.AnimatorFlyStraight = function (f, c, e, b, d, a) {
	this.Start = new CL3D.Vect3d(0, 0, 0);
	this.End = new CL3D.Vect3d(40, 40, 40);
	this.StartTime = CL3D.CLTimer.getTime();
	this.TimeForWay = 3000;
	this.Loop = false;
	this.DeleteMeAfterEndReached = false;
	this.AnimateCameraTargetInsteadOfPosition = false;
	this.TestShootCollisionWithBullet = false;
	this.ShootCollisionNodeToIgnore = null;
	this.ShootCollisionDamage = 0;
	this.DeleteSceneNodeAfterEndReached = false;
	this.ActionToExecuteOnEnd = false;
	if (f) {
		this.Start = f.clone()
	}
	if (c) {
		this.End = c.clone()
	}
	if (e) {
		this.TimeForWay = e
	}
	if (b) {
		this.Loop = b
	}
	this.recalculateImidiateValues();
	if (d) {
		this.DeleteMeAfterEndReached = d
	}
	if (a) {
		this.AnimateCameraTargetInsteadOfPosition = a
	}
};
CL3D.AnimatorFlyStraight.prototype = new CL3D.Animator();
CL3D.AnimatorFlyStraight.prototype.getType = function () {
	return "flystraight"
};
CL3D.AnimatorFlyStraight.prototype.animateNode = function (f, e) {
	var b = (e - this.StartTime);
	var c = false;
	if (b != 0) {
		var d = this.Start.clone();
		if (!this.Loop && b >= this.TimeForWay) {
			d = this.End.clone();
			c = true
		} else {
			d.addToThis(this.Vector.multiplyWithScal((b % this.TimeForWay) * this.TimeFactor))
		} if (this.AnimateCameraTargetInsteadOfPosition) {
			if (f.getType() == "camera") {
				f.setTarget(d);
				var a = f.getAnimatorOfType("camerafps");
				if (a != null) {
					a.lookAt(d)
				}
			}
		} else {
			f.Pos = d
		} if (this.TestShootCollisionWithBullet && this.StartTime != e) {
			c = this.doShootCollisionTest(f) || c
		}
		if (c) {
			if (this.ActionToExecuteOnEnd) {
				this.ActionToExecuteOnEnd.execute(f)
			}
			if (this.DeleteMeAfterEndReached) {
				f.removeAnimator(this)
			}
			if (this.DeleteSceneNodeAfterEndReached && f.Parent) {
				f.Parent.removeChild(f)
			}
		}
		return true
	}
	return false
};
CL3D.AnimatorFlyStraight.prototype.doShootCollisionTest = function (f) {
	if (!f) {
		return false
	}
	f.updateAbsolutePosition();
	var c = f.getTransformedBoundingBox();
	var e = false;
	var a = f.scene.getAllSceneNodesWithAnimator("gameai");
	for (var b = 0; b < a.length; ++b) {
		if (a[b] === this.ShootCollisionNodeToIgnore) {
			continue
		}
		var d = a[b].getAnimatorOfType("gameai");
		if (d && !d.isAlive()) {
			continue
		}
		if (c.intersectsWithBox(a[b].getTransformedBoundingBox())) {
			d.OnHit(this.ShootCollisionDamage, a[b]);
			e = true;
			break
		}
	}
	return e
};
CL3D.AnimatorFlyStraight.prototype.recalculateImidiateValues = function () {
	this.Vector = this.End.substract(this.Start);
	this.WayLength = this.Vector.getLength();
	this.Vector.normalize();
	this.TimeFactor = this.WayLength / this.TimeForWay
};
CL3D.AnimatorFlyCircle = function (b, a, d, c) {
	this.Center = new CL3D.Vect3d();
	this.Direction = new CL3D.Vect3d(0, 1, 0);
	this.VecU = new CL3D.Vect3d();
	this.VecV = new CL3D.Vect3d();
	this.StartTime = CL3D.CLTimer.getTime();
	this.Speed = 0.01;
	this.Radius = 100;
	if (b) {
		this.Center.setTo(b)
	}
	if (a) {
		this.Radius = a
	}
	if (d) {
		this.Direction.setTo(d)
	}
	if (c) {
		this.Speed = c
	}
	this.init()
};
CL3D.AnimatorFlyCircle.prototype = new CL3D.Animator();
CL3D.AnimatorFlyCircle.prototype.getType = function () {
	return "flycircle"
};
CL3D.AnimatorFlyCircle.prototype.animateNode = function (e, d) {
	var c = (d - this.StartTime);
	if (c != 0) {
		var b = c * this.Speed;
		_tempV0.setTo(this.VecU).multiplyThisWithScal(Math.cos(b)).addToThis(_tempV1.setTo(this.VecV).multiplyThisWithScal(Math.sin(b)));
		_tempV0.multiplyThisWithScal(this.Radius);
		e.Pos.setTo(this.Center).addToThis(_tempV0);
		return true
	}
	return false
};
CL3D.AnimatorFlyCircle.prototype.init = function () {
	this.Direction.normalize();
	if (this.Direction.Y != 0) {
		this.VecV.set(50, 0, 0);
		this.VecV.crossProductTo(this.Direction);
		this.VecV.normalize()
	} else {
		this.VecV.set(0, 50, 0);
		this.VecV.crossProductTo(this.Direction);
		this.VecV.normalize()
	}
	this.VecU.setTo(this.VecV).crossProductTo(this.Direction);
	this.VecU.normalize()
};
CL3D.AnimatorRotation = function (a) {
	this.Rotation = new CL3D.Vect3d();
	if (a) {
		this.Rotation.setTo(a)
	}
	this.StartTime = CL3D.CLTimer.getTime();
	this.RotateToTargetAndStop = false;
	this.RotateToTargetEndTime = 0;
	this.BeginRotation = null
};
CL3D.AnimatorRotation.prototype = new CL3D.Animator();
CL3D.AnimatorRotation.prototype.getType = function () {
	return "rotation"
};
CL3D.AnimatorRotation.prototype.animateNode = function (g, f) {
	var c = f - this.StartTime;
	if (!this.RotateToTargetAndStop) {
		if (c != 0) {
			g.Rot.addToThis(_tempV0.setTo(this.Rotation).multiplyThisWithScal(c / 10));
			this.StartTime = f;
			return true
		}
	} else {
		if (this.RotateToTargetEndTime - this.StartTime == 0) {
			return false
		}
		var e = (f - this.StartTime) / (this.RotateToTargetEndTime - this.StartTime);
		if (e > 1) {
			g.removeAnimator(this)
		} else {
			var a = new CL3D.Quaternion();
			var b = this.Rotation.multiplyWithScal(CL3D.DEGTORAD);
			a.setFromEuler(b.X, b.Y, b.Z);
			var d = new CL3D.Quaternion();
			b = this.BeginRotation.multiplyWithScal(CL3D.DEGTORAD);
			d.setFromEuler(b.X, b.Y, b.Z);
			d.slerp(d, a, e);
			b = new CL3D.Vect3d();
			d.toEuler(b);
			b.multiplyThisWithScal(CL3D.RADTODEG);
			g.Rot = b;
			return true
		}
	}
	return false
};
CL3D.AnimatorRotation.prototype.setRotateToTargetAndStop = function (b, a, c) {
	this.RotateToTargetAndStop = true;
	this.Rotation = b.clone();
	this.BeginRotation = a.clone();
	this.RotateToTargetEndTime = this.StartTime + c
};
CL3D.AnimatorAnimateTexture = function (a, c, b) {
	this.Textures = new Array();
	this.Loop = true;
	this.TimePerFrame = 20;
	this.TextureChangeType = 0;
	this.TextureIndexToChange = 0;
	this.MyStartTime = 0;
	if (a) {
		this.Textures = a
	}
	if (c) {
		this.TimePerFrame = c
	}
	if (b == true) {
		this.loop = false
	}
};
CL3D.AnimatorAnimateTexture.prototype = new CL3D.Animator();
CL3D.AnimatorAnimateTexture.prototype.getType = function () {
	return "animatetexture"
};
CL3D.AnimatorAnimateTexture.prototype.animateNode = function (c, a) {
	if (c == null || this.Textures == null) {
		return false
	}
	var d = false;
	var h = null;
	if (this.Textures.length) {
		var b = (this.MyStartTime == 0) ? c.scene.getStartTime() : this.MyStartTime;
		var j = (a - b);
		var f = b + (this.TimePerFrame * this.Textures.length);
		var g = 0;
		if (!this.Loop && a >= f) {
			g = this.Textures.length - 1
		} else {
			if (this.TimePerFrame > 0) {
				g = Math.floor((j / this.TimePerFrame) % this.Textures.length)
			} else {
				g = 0
			}
		} if (g < this.Textures.length) {
			if (this.TextureChangeType == 1) {
				if (this.TextureIndexToChange >= 0 && this.TextureIndexToChange < c.getMaterialCount()) {
					h = c.getMaterial(this.TextureIndexToChange);
					if (h && !(h.Tex1 === this.Textures[g])) {
						h.Tex1 = this.Textures[g];
						d = true
					}
				}
			} else {
				var k = c.getMaterialCount();
				for (var e = 0; e < k; ++e) {
					h = c.getMaterial(e);
					if (h && !(h.Tex1 === this.Textures[g])) {
						h.Tex1 = this.Textures[g];
						d = true
					}
				}
			}
		}
	}
	return d
};
CL3D.AnimatorAnimateTexture.prototype.reset = function () {
	this.MyStartTime = CL3D.CLTimer.getTime()
};
CL3D.AnimatorOnClick = function (d, c, a, b) {
	this.engine = c;
	this.TimeLastClicked = 0;
	this.PositionClickedX = -1;
	this.PositionClickedY = -1;
	this.Registered = false;
	this.LastUsedSceneNode = null;
	this.SMGr = d;
	this.FunctionToCall = a;
	this.BoundingBoxTestOnly = true;
	this.CollidesWithWorld = false;
	this.TheActionHandler = null;
	this.World = null;
	if (!(b == true)) {
		d.registerSceneNodeAnimatorForEvents(this)
	}
};
CL3D.AnimatorOnClick.prototype = new CL3D.Animator();
CL3D.AnimatorOnClick.prototype.getType = function () {
	return "onclick"
};
CL3D.AnimatorOnClick.prototype.animateNode = function (d, c) {
	if (d == null) {
		return false
	}
	if (this.TimeLastClicked) {
		var a = CL3D.CLTimer.getTime();
		var b = a - this.TimeLastClicked;
		if (b < 1500) {
			this.TimeLastClicked = 0;
			if (a - this.engine.LastCameraDragTime < 250) {
				return false
			}
			if (d.getVisible() && this.isOverNode(d, this.PositionClickedX, this.PositionClickedY)) {
				if (this.FunctionToCall) {
					this.FunctionToCall()
				}
				this.invokeAction(d);
				return true
			}
		}
	}
	return false
};
CL3D.AnimatorOnClick.prototype.onMouseUp = function (a) {
	this.PositionClickedX = this.engine.getMousePosXFromEvent(a);
	this.PositionClickedY = this.engine.getMousePosYFromEvent(a);
	this.TimeLastClicked = CL3D.CLTimer.getTime()
};
CL3D.AnimatorOnClick.prototype.invokeAction = function (a) {
	if (this.TheActionHandler) {
		this.TheActionHandler.execute(a)
	}
};
CL3D.AnimatorOnClick.prototype.isOverNode = function (g, f, d) {
	if (g == null) {
		return false
	}
	if (g.getType() == "2doverlay") {
		var e = g.getScreenCoordinatesRect(false, this.engine.getRenderer());
		if (e.x <= f && e.y <= d && e.x + e.w >= f && e.y + e.h >= d) {
			return true
		}
	}
	var b = this.engine.get3DPositionFrom2DPosition(f, d);
	if (b == null) {
		return false
	}
	var h = this.SMGr.getActiveCamera();
	if (h == null) {
		return false
	}
	var c = h.getAbsolutePosition();
	var a = new CL3D.Line3d();
	a.Start = c;
	a.End = b;
	return this.static_getCollisionDistanceWithNode(this.SMGr, g, a, this.BoundingBoxTestOnly, this.CollidesWithWorld, this.World, null)
};
CL3D.AnimatorOnClick.prototype.static_getDistanceToNearestCollisionPointWithWorld = function (d, e, b, g, c) {
	var f = 999999999999;
	if (!g || !d) {
		return f
	}
	var a = g.getCollisionPointWithLine(e, b, true, null, c);
	if (a) {
		return e.getDistanceTo(a)
	}
	return f
};
CL3D.AnimatorOnClick.prototype.getDistanceToNearestCollisionPointWithWorld = function (b, a) {
	return this.static_getDistanceToNearestCollisionPointWithWorld(this.SMGr, b, a, this.World, true)
};
CL3D.AnimatorOnClick.prototype.static_getCollisionDistanceWithNode = function (b, k, h, e, f, j, l) {
	var g = k.getBoundingBox();
	var d = 0;
	var r = new CL3D.Matrix4(false);
	if (k.AbsoluteTransformation.getInverse(r)) {
		if (g.intersectsWithLine(r.getTransformedVect(h.Start), r.getTransformedVect(h.End))) {
			var q = null;
			if (k.getMesh && k.OwnedMesh) {
				q = k
			}
			var o = (q == null) || e;
			if (!o) {
				var m = q.Selector;
				if (m == null) {
					if (q.OwnedMesh && q.OwnedMesh.GetPolyCount() > 100) {
						m = new CL3D.OctTreeTriangleSelector(q.OwnedMesh, q, 0)
					} else {
						m = new CL3D.MeshTriangleSelector(q.OwnedMesh, q)
					}
					q.Selector = m
				}
				if (m) {
					var c = m.getCollisionPointWithLine(h.Start, h.End, true, null, true);
					if (c != null) {
						if (f) {
							d = this.static_getDistanceToNearestCollisionPointWithWorld(b, h.Start, c, j, true);
							var a = c.getDistanceTo(h.Start);
							if (d + CL3D.TOLERANCE < a) {
								return false
							} else {
								if (l != null) {
									l.N = c.getDistanceTo(h.Start)
								}
								return true
							}
						} else {
							if (l != null) {
								l.N = h.Start.getDistanceTo(k.getTransformedBoundingBox().getCenter())
							}
							return true
						}
					}
				} else {
					o = true
				}
			}
			if (o) {
				if (!f) {
					if (l != null) {
						l.N = h.Start.getDistanceTo(k.getTransformedBoundingBox().getCenter())
					}
					return true
				} else {
					var t = h.Start.clone();
					g = k.getTransformedBoundingBox();
					var s = g.getExtent();
					s.multiplyThisWithScal(0.5);
					var p = CL3D.max3(s.X, s.Y, s.Z);
					p = Math.sqrt((p * p) + (p * p));
					var n = k.getTransformedBoundingBox().getCenter();
					d = this.static_getDistanceToNearestCollisionPointWithWorld(b, t, n, j, true);
					var i = n.getDistanceTo(t) - p;
					if (d < i) {
						return false
					} else {
						if (l != null) {
							l.N = i
						}
						return true
					}
				}
			}
		}
	}
	return false
};
CL3D.AnimatorOnMove = function (b, a) {
	this.engine = a;
	this.SMGr = b;
	this.ActionHandlerOnEnter = null;
	this.ActionHandlerOnLeave = null;
	this.TimeLastChecked = 0;
	this.bLastTimeWasInside = 0
};
CL3D.AnimatorOnMove.prototype = new CL3D.AnimatorOnClick(null, null, null, true);
CL3D.AnimatorOnMove.prototype.getType = function () {
	return "onmove"
};
CL3D.AnimatorOnMove.prototype.animateNode = function (b, e) {
	var d = (this.TimeLastChecked == 0);
	var a = CL3D.CLTimer.getTime();
	if (d || a - this.TimeLastChecked > 100) {
		this.TimeLastChecked = a;
		var c = this.isOverNode(b, this.engine.getMouseX(), this.engine.getMouseY());
		if (d) {
			this.bLastTimeWasInside = c
		} else {
			if (c != this.bLastTimeWasInside) {
				this.bLastTimeWasInside = c;
				if (c && this.ActionHandlerOnEnter) {
					this.ActionHandlerOnEnter.execute(b)
				} else {
					if (!c && this.ActionHandlerOnLeave) {
						this.ActionHandlerOnLeave.execute(b)
					}
				}
				return true
			}
		}
	}
	return false
};
CL3D.AnimatorOnProximity = function (e, c, b, d, a) {
	this.TimeLastClicked = 0;
	this.sceneManager = e;
	this.EnterType = 0;
	this.ProximityType = 0;
	this.Range = 0;
	this.SceneNodeToTest = 0;
	this.TheActionHandler = null;
	this.FunctionToCall = d;
	if (c) {
		this.Radius = c
	}
	if (b) {
		this.SceneNodeToTest = b
	}
	if (a) {
		this.EnterType = 1
	}
	this.IsInsideRadius = false
};
CL3D.AnimatorOnProximity.prototype = new CL3D.Animator();
CL3D.AnimatorOnProximity.prototype.getType = function () {
	return "oncollide"
};
CL3D.AnimatorOnProximity.prototype.animateNode = function (g, f) {
	if (g == null || this.sceneManager == null) {
		return false
	}
	var e = false;
	var a = null;
	if (this.ProximityType == 0) {
		a = this.sceneManager.getActiveCamera()
	} else {
		if (this.SceneNodeToTest != -1) {
			a = this.sceneManager.getSceneNodeFromId(this.SceneNodeToTest)
		}
	} if (a) {
		if (g === a) {
			return false
		}
		var c = a.getAbsolutePosition();
		var b = g.getAbsolutePosition();
		var d = c.getDistanceTo(b) < this.Range;
		switch (this.EnterType) {
		case 0:
			if (d && !this.IsInsideRadius) {
				this.invokeAction(a);
				e = true
			}
			break;
		case 1:
			if (!d && this.IsInsideRadius) {
				this.invokeAction(a);
				e = true
			}
			break
		}
		this.IsInsideRadius = d
	}
	return e
};
CL3D.AnimatorOnProximity.prototype.invokeAction = function (a) {
	if (this.FunctionToCall) {
		this.FunctionToCall.call(a)
	}
	if (this.TheActionHandler) {
		this.TheActionHandler.execute(a)
	}
};
CL3D.AnimatorCollisionResponse = function (a, e, d, c, b) {
	this.Radius = a;
	this.Gravity = e;
	this.Translation = d;
	this.World = c;
	this.SlidingSpeed = b;
	this.Node = null;
	this.LastAnimationTime = null;
	this.LastPosition = new CL3D.Vect3d(0, 0, 0);
	this.Falling = false;
	this.FallStartTime = 0;
	this.JumpForce = 0;
	if (this.Gravity == null) {
		this.Gravity = new CL3D.Vect3d(0, 1, 0)
	}
	if (this.Radius == null) {
		this.Radius = new CL3D.Vect3d(30, 50, 30)
	}
	if (this.Translation == null) {
		this.Translation = new CL3D.Vect3d(0, 0, 0)
	}
	if (this.SlidingSpeed == null) {
		this.SlidingSpeed = 0.0005
	}
	this.reset()
};
CL3D.AnimatorCollisionResponse.prototype = new CL3D.Animator();
CL3D.AnimatorCollisionResponse.prototype.getType = function () {
	return "collisionresponse"
};
CL3D.AnimatorCollisionResponse.prototype.reset = function () {
	this.Node = null;
	this.LastAnimationTime = CL3D.CLTimer.getTime()
};
CL3D.AnimatorCollisionResponse.prototype.setWorld = function (a) {
	this.World.setTo(a);
};
CL3D.AnimatorCollisionResponse.prototype.getWorld = function () {
	return this.World
};
CL3D.AnimatorCollisionResponse.prototype.setGravity = function (a) {
	this.Gravity = a
};
CL3D.AnimatorCollisionResponse.prototype.getGravity = function () {
	return this.Gravity
};
CL3D.AnimatorCollisionResponse.prototype.isFalling = function () {
	return this.Falling
};
CL3D.AnimatorCollisionResponse.prototype.animateNode = function (f, e) {
	var m = (e - this.LastAnimationTime);
	if (!this.World) {
		return false
	}
	if (m > 150) {
		m = 150
	}
	this.LastAnimationTime = e;
	if (!(this.Node === f)) {
		this.Node = f;
		this.LastPosition = f.Pos.clone()
	}
	var p = f.Pos.clone();
	var r = f.Pos.substract(this.LastPosition);
	var g = this.Gravity.multiplyWithScal(m);
	if (!this.Falling) {
		g.multiplyThisWithScal(0.001)
	} else {
		var t = ((e - this.FallStartTime) / 1000);
		if (t > 5) {
			t = 5
		}
		g.multiplyThisWithScal(t)
	} if (this.JumpForce > 0) {
		var k = this.Gravity.multiplyWithScal(m * this.JumpForce * 0.001);
		g.substractFromThis(k);
		this.JumpForce -= m;
		if (this.JumpForce < 0) {
			this.JumpForce = 0
		}
	}
	var c = r.add(g);
	if (!c.equalsZero()) {
		this.SlidingSpeed = this.Radius.getLength() * 0.000001;
		var b = null;
		if (f && f.getType() == "camera") {
			b = f
		}
		var o;
		if (b) {
			o = b.Target.substract(b.Pos)
		}
		var l = new CL3D.Triangle3d();
		var d = new Object();
		d.N = 0;
		this.World.setNodeToIgnore(f);
		p = this.getCollisionResultPosition(this.World, this.LastPosition.substract(this.Translation), this.Radius, r, l, d, this.SlidingSpeed, g);
		this.World.setNodeToIgnore(null);
		p.addToThis(this.Translation);
		if (d.N < 0.5) {
			this.Falling = false
		} else {
			if (!this.Falling) {
				this.FallStartTime = e
			}
			this.Falling = true
		} if (f.Pos.equals(p)) {
			return false
		}
		f.Pos = p.clone();
		if (b && o) {
			var s = true;
			for (var j = 0; j < f.Animators.length; ++j) {
				var q = f.Animators[j];
				if (q && q.getType() == "cameramodelviewer") {
					s = false;
					break
				}
			}
			if (s) {
				b.Target = f.Pos.add(o)
			}
		}
	}
	var h = this.LastPosition.equals(f.Pos);
	this.LastPosition = f.Pos.clone();
	return false
};
CL3D.AnimatorCollisionResponse.prototype.getCollisionResultPosition = function (c, e, h, d, j, g, b, m) {
	if (!c || h.X == 0 || h.Y == 0 || h.Z == 0) {
		return e
	}
	var a = new Object();
	a.R3Position = e.clone();
	a.R3Velocity = d.clone();
	a.eRadius = h.clone();
	a.nearestDistance = 99999999.9;
	a.selector = c;
	a.slidingSpeed = b;
	a.triangleHits = 0;
	a.intersectionPoint = new CL3D.Vect3d();
	var k = a.R3Position.divideThroughVect(a.eRadius);
	var l = a.R3Velocity.divideThroughVect(a.eRadius);
	var f = this.collideWithWorld(0, a, k, l);
	g.N = 0;
	if (!m.equalsZero()) {
		a.R3Position = f.multiplyWithVect(a.eRadius);
		a.R3Velocity = m.clone();
		a.triangleHits = 0;
		l = m.divideThroughVect(a.eRadius);
		f = this.collideWithWorld(0, a, f, l);
		g.N = (a.triangleHits == 0) ? 1 : 0;
		if (g.N < 0.5 && a.intersectionTriangle) {
			var i = a.intersectionTriangle.getNormal();
			i.normalize();
			if (!(Math.abs(i.Y) > Math.abs(i.X) && Math.abs(i.Y) > Math.abs(i.Z))) {
				g.N = 1
			}
		}
	}
	if (a.triangleHits) {
		j = a.intersectionTriangle;
		j.pointA.multiplyThisWithVect(a.eRadius);
		j.pointB.multiplyThisWithVect(a.eRadius);
		j.pointC.multiplyThisWithVect(a.eRadius)
	}
	f.multiplyThisWithVect(a.eRadius);
	return f
};
CL3D.AnimatorCollisionResponse.prototype.collideWithWorld = function (l, c, k, m) {
	var p = c.slidingSpeed;
	if (l > 5) {
		return k.clone()
	}
	c.velocity = m.clone();
	c.normalizedVelocity = m.clone();
	c.normalizedVelocity.normalize();
	c.basePoint = k.clone();
	c.foundCollision = false;
	c.nearestDistance = 99999999.9;
	var h = new CL3D.Box3d();
	c.R3Position.copyTo(h.MinEdge);
	c.R3Position.copyTo(h.MaxEdge);
	h.addInternalPointByVector(c.R3Position.add(c.R3Velocity));
	h.MinEdge.substractFromThis(c.eRadius);
	h.MaxEdge.addToThis(c.eRadius);
	var e = new Array();
	var o = new CL3D.Matrix4();
	o.setScaleXYZ(1 / c.eRadius.X, 1 / c.eRadius.Y, 1 / c.eRadius.Z);
	c.selector.getTrianglesInBox(h, o, e);
	for (var g = 0; g < e.length; ++g) {
		this.testTriangleIntersection(c, e[g])
	}
	if (!c.foundCollision) {
		return k.add(m)
	}
	var a = k.add(m);
	var r = k.clone();
	if (c.nearestDistance >= p) {
		var n = m.clone();
		n.setLength(c.nearestDistance - p);
		r = c.basePoint.add(n);
		n.normalize();
		c.intersectionPoint.substractFromThis(n.multiplyWithScal(p))
	}
	var b = c.intersectionPoint.clone();
	var q = r.substract(c.intersectionPoint);
	q.normalize();
	var j = new CL3D.Plane3d();
	j.setPlane(b, q);
	var d = a.substract(q.multiplyWithScal(j.getDistanceTo(a)));
	var f = d.substract(c.intersectionPoint);
	if (f.getLength() < p) {
		return r
	}
	return this.collideWithWorld(l + 1, c, r, f)
};
CL3D.AnimatorCollisionResponse.prototype.testTriangleIntersection = function (s, y) {
	var u = y.getPlane();
	if (!u.isFrontFacing(s.normalizedVelocity)) {
		return
	}
	var n = 0;
	var p = 0;
	var j = false;
	var z = 0;
	var o = u.getDistanceTo(s.basePoint);
	var F = u.Normal.dotProduct(s.velocity);
	if (CL3D.iszero(F)) {
		if (Math.abs(o) >= 1) {
			return
		} else {
			j = true;
			p = 0;
			n = 1
		}
	} else {
		F = 1 / F;
		p = (-1 - o) * F;
		n = (1 - o) * F;
		if (p > n) {
			var B = n;
			n = p;
			p = B
		}
		if (p > 1 || n < 0) {
			return
		}
		p = CL3D.clamp(p, 0, 1);
		n = CL3D.clamp(n, 0, 1)
	}
	var d = new CL3D.Vect3d();
	var k = false;
	var r = 1;
	if (!j) {
		var v = (s.basePoint.substract(u.Normal)).add(s.velocity.multiplyWithScal(p));
		if (y.isPointInsideFast(v)) {
			k = true;
			r = p;
			d = v.clone()
		}
	}
	if (!k) {
		var l = s.velocity.clone();
		var g = s.basePoint.clone();
		var x = l.getLengthSQ();
		var E = 0;
		var C = 0;
		var A = 0;
		var q = new Object();
		q.N = 0;
		E = x;
		C = 2 * (l.dotProduct(g.substract(y.pointA)));
		A = (y.pointA.substract(g)).getLengthSQ() - 1;
		if (this.getLowestRoot(E, C, A, r, q)) {
			r = q.N;
			k = true;
			d = y.pointA.clone()
		}
		if (!k) {
			C = 2 * (l.dotProduct(g.substract(y.pointB)));
			A = (y.pointB.substract(g)).getLengthSQ() - 1;
			if (this.getLowestRoot(E, C, A, r, q)) {
				r = q.N;
				k = true;
				d = y.pointB.clone()
			}
		}
		if (!k) {
			C = 2 * (l.dotProduct(g.substract(y.pointC)));
			A = (y.pointC.substract(g)).getLengthSQ() - 1;
			if (this.getLowestRoot(E, C, A, r, q)) {
				r = q.N;
				k = true;
				d = y.pointC.clone()
			}
		}
		var i = y.pointB.substract(y.pointA);
		var w = y.pointA.substract(g);
		var m = i.getLengthSQ();
		var h = i.dotProduct(l);
		var e = i.dotProduct(w);
		E = m * -x + h * h;
		C = m * (2 * l.dotProduct(w)) - 2 * h * e;
		A = m * (1 - w.getLengthSQ()) + e * e;
		if (this.getLowestRoot(E, C, A, r, q)) {
			z = (h * q.N - e) / m;
			if (z >= 0 && z <= 1) {
				r = q.N;
				k = true;
				d = y.pointA.add(i.multiplyWithScal(z))
			}
		}
		i = y.pointC.substract(y.pointB);
		w = y.pointB.substract(g);
		m = i.getLengthSQ();
		h = i.dotProduct(l);
		e = i.dotProduct(w);
		E = m * -x + h * h;
		C = m * (2 * l.dotProduct(w)) - 2 * h * e;
		A = m * (1 - w.getLengthSQ()) + e * e;
		if (this.getLowestRoot(E, C, A, r, q)) {
			z = (h * q.N - e) / m;
			if (z >= 0 && z <= 1) {
				r = q.N;
				k = true;
				d = y.pointB.add(i.multiplyWithScal(z))
			}
		}
		i = y.pointA.substract(y.pointC);
		w = y.pointC.substract(g);
		m = i.getLengthSQ();
		h = i.dotProduct(l);
		e = i.dotProduct(w);
		E = m * -x + h * h;
		C = m * (2 * l.dotProduct(w)) - 2 * h * e;
		A = m * (1 - w.getLengthSQ()) + e * e;
		if (this.getLowestRoot(E, C, A, r, q)) {
			z = (h * q.N - e) / m;
			if (z >= 0 && z <= 1) {
				r = q.N;
				k = true;
				d = y.pointC.add(i.multiplyWithScal(z))
			}
		}
	}
	if (k) {
		var D = r * s.velocity.getLength();
		if (!s.foundCollision || D < s.nearestDistance) {
			s.nearestDistance = D;
			s.intersectionPoint = d.clone();
			s.foundCollision = true;
			s.intersectionTriangle = y;
			++s.triangleHits
		}
	}
};
CL3D.AnimatorCollisionResponse.prototype.getLowestRoot = function (l, k, i, g, d) {
	var j = k * k - (4 * l * i);
	if (j < 0) {
		return false
	}
	var m = Math.sqrt(j);
	var f = (-k - m) / (2 * l);
	var e = (-k + m) / (2 * l);
	if (f > e) {
		var h = e;
		e = f;
		f = h
	}
	if (f > 0 && f < g) {
		d.N = f;
		return true
	}
	if (e > 0 && e < g) {
		d.N = e;
		return true
	}
	return false
};
CL3D.AnimatorCollisionResponse.prototype.jump = function (a) {
	if (this.JumpForce == 0) {
		this.JumpForce = a * 100
	}
};
CL3D.AnimatorTimer = function (a) {
	this.TimeLastTimed = 0;
	this.SMGr = a;
	this.TheActionHandler = null;
	this.TickEverySeconds = 0;
	this.TimeLastTimed = CL3D.CLTimer.getTime()
};
CL3D.AnimatorTimer.prototype = new CL3D.Animator();
CL3D.AnimatorTimer.prototype.getType = function () {
	return "timer"
};
CL3D.AnimatorTimer.prototype.animateNode = function (c, b) {
	if (c == null) {
		return false
	}
	if (this.TickEverySeconds > 0) {
		var a = CL3D.CLTimer.getTime();
		if (a - this.TimeLastTimed > this.TickEverySeconds) {
			this.TimeLastTimed = a;
			if (this.TheActionHandler) {
				this.TheActionHandler.execute(c)
			}
			return true
		}
	}
	return false
};
CL3D.AnimatorOnKeyPress = function (b, a) {
	this.SMGr = b;
	this.TheActionHandler = null;
	this.TickEverySeconds = 0;
	this.TimeLastPressed = 0;
	a.registerAnimatorForKeyUp(this);
	a.registerAnimatorForKeyDown(this);
	b.registerSceneNodeAnimatorForEvents(this)
};
CL3D.AnimatorOnKeyPress.prototype = new CL3D.Animator();
CL3D.AnimatorOnKeyPress.prototype.getType = function () {
	return "keypress"
};
CL3D.AnimatorOnKeyPress.prototype.animateNode = function (d, c) {
	if (d == null) {
		return false
	}
	if (this.TimeLastPressed) {
		var a = CL3D.CLTimer.getTime();
		var b = a - this.TimeLastPressed;
		if (b < 1000) {
			this.TimeLastPressed = 0;
			if (this.TheActionHandler) {
				this.TheActionHandler.execute(d)
			}
			return true
		}
	}
	return false
};
CL3D.AnimatorOnKeyPress.prototype.onKeyDown = function (a) {
	if (this.KeyPressType == 0 && a.keyCode == this.KeyCode) {
		this.TimeLastPressed = CL3D.CLTimer.getTime();
		return true
	}
	return false
};
CL3D.AnimatorOnKeyPress.prototype.onKeyUp = function (a) {
	if (this.KeyPressType == 1 && a.keyCode == this.KeyCode) {
		this.TimeLastPressed = CL3D.CLTimer.getTime();
		return true
	}
	return false
};
CL3D.AnimatorOnKeyPress.prototype.onMouseUp = function (a) {
	if (this.KeyPressType == 1) {
		if (a.button > 1 && this.KeyCode == 2) {
			this.TimeLastPressed = CL3D.CLTimer.getTime()
		} else {
			if (a.button <= 1 && this.KeyCode == 1) {
				this.TimeLastPressed = CL3D.CLTimer.getTime()
			}
		}
	}
};
CL3D.AnimatorOnKeyPress.prototype.onMouseDown = function (a) {
	if (this.KeyPressType == 0) {
		if (a.button > 1 && this.KeyCode == 2) {
			this.TimeLastPressed = CL3D.CLTimer.getTime()
		} else {
			if (a.button <= 1 && this.KeyCode == 1) {
				this.TimeLastPressed = CL3D.CLTimer.getTime()
			}
		}
	}
};
CL3D.AnimatorGameAI = function (b, a) {
	this.AIType = 0;
	this.MovementSpeed = 0;
	this.ActivationRadius = 0;
	this.CanFly = false;
	this.Health = 100;
	this.Tags = "";
	this.AttacksAIWithTags = "";
	this.PatrolRadius = 100;
	this.RotationSpeedMs = 0;
	this.AdditionalRotationForLooking = new CL3D.Vect3d();
	this.StandAnimation = "";
	this.WalkAnimation = "";
	this.DieAnimation = "";
	this.AttackAnimation = "";
	this.ActionHandlerOnAttack = null;
	this.ActionHandlerOnActivate = null;
	this.ActionHandlerOnHit = null;
	this.ActionHandlerOnDie = null;
	this.CurrentCommand = 0;
	this.NextAttackTargetScanTime = 0;
	this.LastPatrolStartTime = 0;
	this.CurrentCommandTargetPos = null;
	this.CurrentCommandStartTime = 0;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 0;
	this.BeginPositionWhenStartingCurrentCommand = 0;
	this.HandleCurrentCommandTargetNode = null;
	this.AttackCommandExecuted = false;
	this.Activated = false;
	this.CurrentlyShooting = false;
	this.CurrentlyShootingLine = new CL3D.Line3d();
	this.World = null;
	this.TheObject = null;
	this.TheSceneManager = b;
	this.LastTime = 0;
	this.StartPositionOfActor = new CL3D.Vect3d();
	this.NearestSceneNodeFromAIAnimator_NodeOut = null;
	this.NearestSceneNodeFromAIAnimator_maxDistance = 0
};
CL3D.AnimatorGameAI.prototype = new CL3D.Animator();
CL3D.AnimatorGameAI.prototype.getType = function () {
	return "gameai"
};
CL3D.AnimatorGameAI.prototype.animateNode = function (c, b) {
	if (c == null || this.TheSceneManager == null) {
		return false
	}
	var l = b - this.LastTime;
	if (l > 150) {
		l = 150
	}
	this.LastTime = b;
	var o = 0;
	var m = false;
	if (!(this.TheObject === c)) {
		this.TheObject = c;
		c.updateAbsolutePosition();
		this.StartPositionOfActor = c.getAbsolutePosition()
	}
	var i = c.getAbsolutePosition();
	if (this.CurrentCommand == 3) {} else {
		if (this.CurrentCommand == 1) {
			o = this.getCharacterWidth(c);
			if (this.CurrentCommandTargetPos.substract(i).getLength() < o) {
				this.CurrentCommand = 0;
				this.setAnimation(c, 0);
				m = true
			} else {
				var g = false;
				if (this.CurrentCommandTicksDone > 2) {
					var a = this.CurrentCommandTicksDone * (this.MovementSpeed / 1000);
					var h = this.BeginPositionWhenStartingCurrentCommand.substract(i).getLength();
					if (h * 2 < a) {
						this.CurrentCommand = 0;
						g = true
					}
				}
				if (!g) {
					this.CurrentCommandTicksDone += l;
					var d = this.CurrentCommandTargetPos.substract(i);
					d.setLength((this.MovementSpeed / 1000) * l);
					c.Pos.addToThis(d)
				}
				m = this.animateRotation(c, (b - this.CurrentCommandStartTime), this.CurrentCommandTargetPos.substract(i), this.RotationSpeedMs)
			}
		} else {
			if (this.CurrentCommand == 2) {
				this.CurrentCommandTicksDone += l;
				if (!this.AttackCommandExecuted && this.CurrentCommandTicksDone > (this.CurrentCommandExpectedTickCount / 2)) {
					this.CurrentlyShooting = true;
					if (this.ActionHandlerOnAttack) {
						this.ActionHandlerOnAttack.execute(c)
					}
					this.CurrentlyShooting = false;
					this.AttackCommandExecuted = true;
					m = true
				}
				if (this.CurrentCommandTicksDone > this.CurrentCommandExpectedTickCount) {
					this.CurrentCommand = 0
				} else {
					m = this.animateRotation(c, (b - this.CurrentCommandStartTime), this.CurrentCommandTargetPos.substract(i), Math.min(this.RotationSpeedMs, this.CurrentCommandExpectedTickCount))
				}
			} else {
				if (this.CurrentCommand == 0) {
					if (this.AIType == 1 || this.AIType == 2) {
						var k = this.scanForAttackTargetIfNeeded(b, i);
						if (k != null) {
							var n = this.getAttackDistanceFromWeapon();
							if (!this.Activated && this.ActionHandlerOnActivate) {
								this.ActionHandlerOnActivate.execute(c)
							}
							this.Activated = true;
							m = true;
							if (k.getAbsolutePosition().getDistanceTo(i) < n) {
								if (this.isNodeVisibleFromNode(k, c)) {
									this.CurrentlyShootingLine.Start = c.getTransformedBoundingBox().getCenter();
									this.CurrentlyShootingLine.End = k.getTransformedBoundingBox().getCenter();
									this.attackTarget(c, k, k.getAbsolutePosition(), i, b)
								} else {
									this.moveToTarget(c, k.getAbsolutePosition(), i, b)
								}
							} else {
								this.moveToTarget(c, k.getAbsolutePosition(), i, b)
							}
						} else {
							if (this.AIType == 2) {
								var f = 10000;
								if (this.MovementSpeed) {
									f = this.PatrolRadius / (this.MovementSpeed / 1000)
								}
								if (!this.LastPatrolStartTime || b > this.LastPatrolStartTime + f) {
									var e = this.PatrolRadius;
									this.LastPatrolStartTime = b;
									var j = new CL3D.Vect3d((Math.random() - 0.5) * e, (Math.random() - 0.5) * e, (Math.random() - 0.5) * e);
									j.addToThis(this.StartPositionOfActor);
									if (!this.CanFly) {
										j.Y = this.StartPositionOfActor.Y
									}
									o = this.getCharacterWidth(c);
									if (!(j.substract(i).getLength() < o)) {
										this.moveToTarget(c, j, i, b);
										m = true
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return m
};
CL3D.AnimatorGameAI.prototype.animateRotation = function (c, j, h, a) {
	if (!c) {
		return false
	}
	var b = (c.getType() == "camera");
	if (b) {
		return false
	}
	if (!this.CanFly) {
		h.Y = 0
	}
	var i = new CL3D.Matrix4();
	i.setRotationDegrees(h.getHorizontalAngle());
	var g = new CL3D.Matrix4();
	g.setRotationDegrees(this.AdditionalRotationForLooking);
	i = i.multiply(g);
	var f = i.getRotationDegrees();
	var l = c.Rot.clone();
	var k = Math.min(j, a) / a;
	k = CL3D.clamp(k, 0, 1);
	f.multiplyThisWithScal(CL3D.DEGTORAD);
	l.multiplyThisWithScal(CL3D.DEGTORAD);
	var e = new CL3D.Quaternion();
	e.setFromEuler(f.X, f.Y, f.Z);
	var d = new CL3D.Quaternion();
	d.setFromEuler(l.X, l.Y, l.Z);
	d.slerp(d, e, k);
	d.toEuler(f);
	f.multiplyThisWithScal(CL3D.RADTODEG);
	if (c.Rot.equals(f)) {
		return false
	}
	c.Rot = f;
	return true
};
CL3D.AnimatorGameAI.prototype.moveToTarget = function (c, d, b, a) {
	this.CurrentCommand = 1;
	this.CurrentCommandTargetPos = d;
	this.CurrentCommandStartTime = a;
	this.BeginPositionWhenStartingCurrentCommand = b;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 0;
	this.setAnimation(c, 1)
};
CL3D.AnimatorGameAI.prototype.attackTarget = function (e, a, f, d, b) {
	this.CurrentCommand = 2;
	this.CurrentCommandTargetPos = f;
	this.CurrentCommandStartTime = b;
	this.HandleCurrentCommandTargetNode = a;
	this.BeginPositionWhenStartingCurrentCommand = d;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 500;
	this.AttackCommandExecuted = false;
	var c = this.setAnimation(e, 2);
	if (c != 0) {
		this.CurrentCommandExpectedTickCount = c
	}
};
CL3D.AnimatorGameAI.prototype.die = function (d, c, a) {
	this.CurrentCommand = 3;
	this.CurrentCommandStartTime = a;
	this.BeginPositionWhenStartingCurrentCommand = c;
	this.CurrentCommandTicksDone = 0;
	this.CurrentCommandExpectedTickCount = 500;
	var b = this.setAnimation(d, 3)
};
CL3D.AnimatorGameAI.prototype.isNodeVisibleFromNode = function (b, a) {
	if (!b || !a) {
		return false
	}
	return this.isPositionVisibleFromPosition(b.getTransformedBoundingBox().getCenter(), a.getTransformedBoundingBox().getCenter())
};
CL3D.AnimatorGameAI.prototype.isPositionVisibleFromPosition = function (b, a) {
	if (!this.World || !this.TheSceneManager) {
		return true
	}
	if (this.World.getCollisionPointWithLine(b, a, true, null, true) != null) {
		return false
	}
	return true
};
CL3D.AnimatorGameAI.prototype.getNearestSceneNodeFromAIAnimatorAndDistance = function (e, f, a) {
	if (!e || !e.getVisible()) {
		return
	}
	var d = false;
	var g = f.getDistanceTo(e.getAbsolutePosition());
	if (g < this.NearestSceneNodeFromAIAnimator_maxDistance) {
		var b = e.getAnimatorOfType("gameai");
		if (b && a != "" && !(b === this) && b.isAlive()) {
			d = b.Tags.indexOf(a) != -1
		}
	}
	if (d) {
		this.NearestSceneNodeFromAIAnimator_maxDistance = g;
		this.NearestSceneNodeFromAIAnimator_NodeOut = e
	}
	for (var c = 0; c < e.Children.length; ++c) {
		var h = e.Children[c];
		this.getNearestSceneNodeFromAIAnimatorAndDistance(h, f, a)
	}
};
CL3D.AnimatorGameAI.prototype.scanForAttackTargetIfNeeded = function (b, a) {
	if (this.ActivationRadius <= 0 || !this.TheObject || this.AttacksAIWithTags.length == 0 || !this.TheSceneManager) {
		return null
	}
	if (!this.NextAttackTargetScanTime || b > this.NextAttackTargetScanTime) {
		this.NearestSceneNodeFromAIAnimator_maxDistance = this.ActivationRadius;
		this.NearestSceneNodeFromAIAnimator_NodeOut = null;
		this.getNearestSceneNodeFromAIAnimatorAndDistance(this.TheSceneManager.getRootSceneNode(), a, this.AttacksAIWithTags);
		this.NextAttackTargetScanTime = b + 500 + (Math.random() * 1000);
		return this.NearestSceneNodeFromAIAnimator_NodeOut
	}
	return null
};
CL3D.AnimatorGameAI.prototype.getAttackDistanceFromWeapon = function () {
	var a = 1000;
	if (this.ActionHandlerOnAttack) {
		var b = this.ActionHandlerOnAttack.findAction("Shoot");
		if (b) {
			a = b.getWeaponRange()
		}
	}
	return a
};
CL3D.AnimatorGameAI.prototype.getCharacterWidth = function (a) {
	if (a != null) {
		return 10
	}
	var b = a.getTransformedBoundingBox().getExtent();
	b.Y = 0;
	return b.getLength()
};
CL3D.AnimatorGameAI.prototype.getAnimationNameFromType = function (a) {
	switch (a) {
	case 0:
		return this.StandAnimation;
	case 1:
		return this.WalkAnimation;
	case 2:
		return this.AttackAnimation;
	case 3:
		return this.DieAnimation
	}
	return ""
};
CL3D.AnimatorGameAI.prototype.setAnimation = function (e, d) {
	if (!e || e.getType() != "animatedmesh") {
		return 0
	}
	var c = e;
	var a = c.Mesh;
	if (!a) {
		return 0
	}
	var b = a.getNamedAnimationRangeByName(this.getAnimationNameFromType(d));
	if (b) {
		c.setFrameLoop(b.Begin, b.End);
		if (b.FPS != 0) {
			c.setAnimationSpeed(b.FPS)
		}
		c.setLoopMode(d == 1 || d == 0);
		return (b.End - b.Begin) * b.FPS * 1000
	} else {
		c.setFrameLoop(1, 1);
		c.setLoopMode(false)
	}
	return 0
};
CL3D.AnimatorGameAI.prototype.isCurrentlyShooting = function () {
	return this.CurrentlyShooting
};
CL3D.AnimatorGameAI.prototype.getCurrentlyShootingLine = function () {
	return this.CurrentlyShootingLine
};
CL3D.AnimatorGameAI.prototype.isAlive = function () {
	return this.Health > 0
};
CL3D.AnimatorGameAI.prototype.OnHit = function (a, b) {
	if (!b) {
		return
	}
	if (this.Health == 0) {
		return
	}
	this.Health -= a;
	if (this.Health < 0) {
		this.Health = 0
	}
	if (this.Health == 0) {
		if (this.ActionHandlerOnDie != null) {
			this.ActionHandlerOnDie.execute(b)
		}
		this.die(b, b.getAbsolutePosition(), 0)
	} else {
		if (this.ActionHandlerOnHit != null) {
			this.ActionHandlerOnHit.execute(b)
		}
	}
};
CL3D.CopperCubeVariables = new Array();
CL3D.CopperCubeVariable = function () {
	this.Name = "";
	this.StringValue = "";
	this.ActiveValueType = 0;
	this.IntValue = 0;
	this.FloatValue = 0
};
CL3D.CopperCubeVariable.getVariable = function (b, a, e) {
	if (b == null) {
		return null
	}
	var h = b.toLowerCase();
	var c = CL3D.CopperCubeVariables;
	for (var d = 0; d < c.length; ++d) {
		var j = c[d];
		if (j != null && j.getName().toLowerCase() == h) {
			return j
		}
	}
	var g = CL3D.CopperCubeVariable.createTemporaryVariableIfPossible(b, e);
	if (g) {
		return g
	}
	if (a == true) {
		var f = new CL3D.CopperCubeVariable();
		f.setName(b);
		c.push(f);
		return f
	}
	return null
};
CL3D.CopperCubeVariable.createTemporaryVariableIfPossible = function (b, e) {
	var d = CL3D.CopperCubeVariable.getSceneNodeAndAttributeNameFromTemporaryVariableName(b, e);
	if (d == null) {
		return null
	}
	var a = new CL3D.CopperCubeVariable();
	a.setName(b);
	a.setValueAsInt(0);
	if (d.attrname == "health") {
		var c = d.node.getAnimatorOfType("gameai");
		if (c != null) {
			a.setValueAsInt(c.Health)
		}
	}
	return a
};
CL3D.CopperCubeVariable.saveContentOfPotentialTemporaryVariableIntoSource = function (a, g) {
	var d = CL3D.CopperCubeVariable.getSceneNodeAndAttributeNameFromTemporaryVariableName(a.Name, g);
	if (d == null) {
		return null
	}
	if (d.attrname == "health") {
		var c = d.node.getAnimatorOfType("gameai");
		if (c != null) {
			var b = c.Health;
			var f = a.getValueAsInt();
			var e = b - f;
			if (e > 0) {
				c.OnHit(e, d.node)
			} else {
				c.Health = f
			}
		}
	}
};
CL3D.CopperCubeVariable.getSceneNodeAndAttributeNameFromTemporaryVariableName = function (b, e) {
	if (b.length == 0 || e == null) {
		return null
	}
	if (b[0] != "#") {
		return null
	}
	var g = b.indexOf(".");
	if (g == -1) {
		return null
	}
	var d = b.substr(g + 1, b.length - g);
	if (d.length == 0) {
		return null
	}
	var f = b.substr(1, g - 1);
	var c = e.getSceneNodeFromName(f);
	if (c == null) {
		return null
	}
	var a = new Object();
	a.node = c;
	a.attrname = d;
	return a
};
CL3D.CopperCubeVariable.prototype.isString = function () {
	return this.ActiveValueType == 0
};
CL3D.CopperCubeVariable.prototype.isFloat = function () {
	return this.ActiveValueType == 2
};
CL3D.CopperCubeVariable.prototype.isInt = function () {
	return this.ActiveValueType == 1
};
CL3D.CopperCubeVariable.prototype.getName = function () {
	return this.Name
};
CL3D.CopperCubeVariable.prototype.setName = function (a) {
	this.Name = a
};
CL3D.CopperCubeVariable.prototype.setAsCopy = function (a) {
	if (a == null) {
		return
	}
	this.ActiveValueType = a.ActiveValueType;
	this.StringValue = a.StringValue;
	this.IntValue = a.IntValue;
	this.FloatValue = a.FloatValue
};
CL3D.CopperCubeVariable.prototype.getValueAsString = function () {
	switch (this.ActiveValueType) {
	case 1:
		return String(this.IntValue);
	case 2:
		if ((this.FloatValue % 1) == 0) {
			return String(this.FloatValue)
		} else {
			return this.FloatValue.toFixed(6)
		}
	}
	return this.StringValue
};
CL3D.CopperCubeVariable.prototype.getValueAsInt = function () {
	switch (this.ActiveValueType) {
	case 0:
		return Math.floor(this.StringValue);
	case 1:
		return this.IntValue;
	case 2:
		return this.FloatValue
	}
	return 0
};
CL3D.CopperCubeVariable.prototype.getValueAsFloat = function () {
	switch (this.ActiveValueType) {
	case 0:
		return Number(this.StringValue);
	case 1:
		return this.IntValue;
	case 2:
		return this.FloatValue
	}
	return 0
};
CL3D.CopperCubeVariable.prototype.setValueAsString = function (a) {
	this.ActiveValueType = 0;
	this.StringValue = a
};
CL3D.CopperCubeVariable.prototype.setValueAsInt = function (a) {
	this.ActiveValueType = 1;
	this.IntValue = a
};
CL3D.CopperCubeVariable.prototype.setValueAsFloat = function (a) {
	this.ActiveValueType = 2;
	this.FloatValue = a
};
CL3D.AnimatorKeyboardControlled = function (b, a) {
	this.lastAnimTime = 0;
	this.SMGr = b;
	this.MoveSpeed = 0;
	this.RunSpeed = 0;
	this.RotateSpeed = 0;
	this.JumpSpeed = 0;
	this.FollowSmoothingSpeed = 15;
	this.AdditionalRotationForLooking = new CL3D.Vect3d();
	this.StandAnimation = "";
	this.WalkAnimation = "";
	this.JumpAnimation = "";
	this.RunAnimation = "";
	this.LastAnimationTime = CL3D.CLTimer.getTime();
	this.WasMovingLastFrame = false;
	this.ShiftIsDown = false;
	this.Registered = false;
	this.leftKeyDown = false;
	this.rightKeyDown = false;
	this.upKeyDown = false;
	this.downKeyDown = false;
	this.jumpKeyDown = false;
	this.firstUpdate = true;
	this.DisableWithoutActiveCamera = false;
	a.registerAnimatorForKeyUp(this);
	a.registerAnimatorForKeyDown(this)
};
CL3D.AnimatorKeyboardControlled.prototype = new CL3D.Animator();
CL3D.AnimatorKeyboardControlled.prototype.getType = function () {
	return "keyboardcontrolled"
};
CL3D.AnimatorKeyboardControlled.prototype.setKeyBool = function (b, a) {
	if (a == 37 || a == 65) {
		this.leftKeyDown = b;
		if (b) {
			this.rightKeyDown = false
		}
		return true
	}
	if (a == 39 || a == 68) {
		this.rightKeyDown = b;
		if (b) {
			this.leftKeyDown = false
		}
		return true
	}
	if (a == 38 || a == 87) {
		this.upKeyDown = b;
		if (b) {
			this.downKeyDown = false
		}
		return true
	}
	if (a == 40 || a == 83) {
		this.downKeyDown = b;
		if (b) {
			this.upKeyDown = false
		}
		return true
	}
	if (a == 32) {
		this.jumpKeyDown = b;
		return true
	}
	return false
};
CL3D.AnimatorKeyboardControlled.prototype.onKeyDown = function (a) {
	this.ShiftIsDown = (a.shiftKey == 1);
	return this.setKeyBool(true, a.keyCode)
};
CL3D.AnimatorKeyboardControlled.prototype.onKeyUp = function (a) {
	this.ShiftIsDown = (a.shiftKey == 1);
	return this.setKeyBool(false, a.keyCode)
};
CL3D.AnimatorKeyboardControlled.prototype.animateNode = function (p, s) {
	var m = s - this.lastAnimTime;
	if (m > 250) {
		m = 250
	}
	this.lastAnimTime = s;
	var e = false;
	this.LastAnimationTime = s;
	if (this.DisableWithoutActiveCamera) {
		var j = p.scene.getActiveCamera();
		if (j != null) {
			var o = j.getAnimatorOfType("3rdpersoncamera");
			if (o != null) {
				if (!(o.NodeToFollow === p)) {
					return false
				}
			} else {
				return false
			}
		}
	}
	var c = p.Rot;
	if (this.leftKeyDown) {
		c.Y -= m * this.RotateSpeed * 0.001;
		e = true
	}
	if (this.rightKeyDown) {
		c.Y += m * this.RotateSpeed * 0.001;
		e = true
	}
	var d = p.Pos;
	var q = new CL3D.Matrix4();
	q.setRotationDegrees(c);
	var g = new CL3D.Vect3d(0, 0, 1);
	var n = new CL3D.Matrix4();
	n.setRotationDegrees(this.AdditionalRotationForLooking);
	q = q.multiply(n);
	q.rotateVect(g);
	var h = this.ShiftIsDown;
	g.setLength((h ? this.RunSpeed : this.MoveSpeed) * m);
	var k = this.downKeyDown;
	var i = this.upKeyDown;
	if (i || k) {
		var l = g.clone();
		if (k) {
			l.multiplyThisWithScal(-1)
		}
		p.Pos.addToThis(l);
		this.setAnimation(p, h ? 3 : 1, k);
		this.WasMovingLastFrame = true;
		e = true
	} else {
		if (this.WasMovingLastFrame) {
			var f = false;
			var t = p.getAnimatorOfType("collisionresponse");
			if (t) {
				f = t.isFalling()
			}
			if (!f) {
				this.setAnimation(p, 0, false)
			}
			this.WasMovingLastFrame = false
		}
	} if (this.jumpKeyDown) {
		var r = p.getAnimatorOfType("collisionresponse");
		if (r && !r.isFalling()) {
			r.jump(this.JumpSpeed);
			this.setAnimation(p, 2, false);
			e = true
		}
	}
	return e
};
CL3D.AnimatorKeyboardControlled.prototype.getAnimationNameFromType = function (a) {
	switch (a) {
	case 0:
		return this.StandAnimation;
	case 1:
		return this.WalkAnimation;
	case 2:
		return this.JumpAnimation;
	case 3:
		return this.RunAnimation
	}
	return ""
};
CL3D.AnimatorKeyboardControlled.prototype.setAnimation = function (g, f, a) {
	if (!g || g.getType() != "animatedmesh") {
		return 0
	}
	var d = g;
	var b = d.Mesh;
	if (!b) {
		return 0
	}
	var c = b.getNamedAnimationRangeByName(this.getAnimationNameFromType(f));
	if (c) {
		var e = 1 * c.FPS;
		if (a) {
			e *= -1
		}
		if (!(d.EndFrame == c.End && d.StartFrame == c.Begin && CL3D.equals(d.FramesPerSecond, e))) {
			d.setFrameLoop(c.Begin, c.End);
			if (e) {
				d.setAnimationSpeed(e)
			}
			d.setLoopMode(f == 0 || f == 1 || f == 3)
		}
		return (c.End - c.Begin) * c.FPS * 1000
	} else {
		d.setFrameLoop(1, 1);
		d.setLoopMode(false)
	}
	return 0
};
CL3D.Animator3rdPersonCamera = function (a) {
	this.lastAnimTime = 0;
	this.SMGr = a;
	this.SceneNodeIDToFollow = -1;
	this.FollowSmoothingSpeed = 15;
	this.AdditionalRotationForLooking = new CL3D.Vect3d();
	this.FollowMode = 0;
	this.TargetHeight = 0;
	this.CollidesWithWorld = false;
	this.World = 0;
	this.LastAnimationTime = 0;
	this.InitialDeltaToObject = new CL3D.Vect3d();
	this.DeltaToCenterOfFollowObject = new CL3D.Vect3d();
	this.NodeToFollow = null;
	this.TriedToLinkWithNode = false;
	this.firstUpdate = true
};
CL3D.Animator3rdPersonCamera.prototype = new CL3D.Animator();
CL3D.Animator3rdPersonCamera.prototype.getType = function () {
	return "3rdpersoncamera"
};
CL3D.Animator3rdPersonCamera.prototype.animateNode = function (p, x) {
	var m = x - this.lastAnimTime;
	if (m > 250) {
		m = 250
	}
	this.lastAnimTime = x;
	var g = false;
	if (p == null) {
		return false
	}
	var s = p;
	this.linkWithNode(p.scene);
	if (!this.NodeToFollow) {
		return false
	}
	var g = false;
	var t = s.Target.clone();
	s.Target = this.NodeToFollow.getAbsolutePosition();
	s.Target.addToThis(this.DeltaToCenterOfFollowObject);
	s.Target.Y += this.TargetHeight;
	if (!s.Target.equals(t)) {
		g = true
	}
	if (this.firstUpdate) {
		this.NodeToFollow.updateAbsolutePosition();
		s.updateAbsolutePosition();
		this.DeltaToCenterOfFollowObject = this.NodeToFollow.getBoundingBox().getExtent();
		this.DeltaToCenterOfFollowObject.Y = this.DeltaToCenterOfFollowObject.Y / 2;
		this.DeltaToCenterOfFollowObject.X = 0;
		this.DeltaToCenterOfFollowObject.Z = 0;
		this.lastAnimTime = x;
		this.firstUpdate = false
	}
	if (!(s.scene.getActiveCamera() === s)) {
		return false
	}
	if (this.InitialDeltaToObject.equalsZero()) {
		this.InitialDeltaToObject = this.NodeToFollow.getAbsolutePosition().substract(s.getAbsolutePosition())
	}
	var a = this.NodeToFollow.Rot;
	var v = new CL3D.Matrix4();
	v.setRotationDegrees(a);
	var o = new CL3D.Matrix4();
	o.setRotationDegrees(this.AdditionalRotationForLooking);
	v = v.multiply(o);
	var w = s.Pos.clone();
	switch (this.FollowMode) {
	case 0:
		break;
	case 2:
		w = this.NodeToFollow.getAbsolutePosition().substract(this.InitialDeltaToObject);
		break;
	case 1:
		var i = this.InitialDeltaToObject.clone();
		v.rotateVect(i);
		var h = this.NodeToFollow.getAbsolutePosition().substract(i);
		var y = s.getAbsolutePosition().getDistanceTo(h);
		var b = this.InitialDeltaToObject.getLength();
		var q = y > b * 2.2;
		if (CL3D.equals(this.FollowSmoothingSpeed, 0) || q) {
			w = h
		} else {
			var u = Math.sqrt(y) * (m / 1000) * this.FollowSmoothingSpeed;
			if (u > y) {
				u = y
			}
			var k = h.substract(s.Pos);
			k.setLength(u);
			k.addToThis(s.Pos);
			w = k
		}
		break
	}
	if (this.CollidesWithWorld && this.World != null && !s.Pos.equals(w)) {
		this.World.setNodeToIgnore(this.NodeToFollow);
		var j = new CL3D.Line3d();
		j.Start = s.Target.clone();
		j.End = w.clone();
		var l = j.getVector();
		var n = l.getLength();
		var f = this.InitialDeltaToObject.getLength() / 10;
		l.setLength(f);
		j.End.addToThis(l);
		var r = new CL3D.Triangle3d();
		var e = this.World.getCollisionPointWithLine(j.Start, j.End, true, r, true);
		if (e != null) {
			var c = e.substract(j.Start);
			var d = c.getLength();
			if (d < f) {
				d = f
			}
			d -= f;
			if (d > n) {
				d = n
			}
			c.setLength(d);
			w = j.Start.add(c)
		}
		this.World.setNodeToIgnore(null)
	}
	if (!s.Pos.equals(w)) {
		g = true;
		s.Pos = w
	}
	return g
};
CL3D.Animator3rdPersonCamera.prototype.linkWithNode = function (a) {
	if (this.TriedToLinkWithNode) {
		return
	}
	if (this.SceneNodeIDToFollow == -1) {
		return
	}
	if (a == null) {
		return
	}
	var b = a.getSceneNodeFromId(this.SceneNodeIDToFollow);
	if (b && !(b === this.NodeToFollow)) {
		this.NodeToFollow = b;
		this.firstUpdate = true
	}
	this.TriedToLinkWithNode = true
};
CL3D.AnimatorOnFirstFrame = function (a) {
	this.RunAlready = false;
	this.AlsoOnReload = false;
	this.SMGr = a;
	this.TheActionHandler = null
};
CL3D.AnimatorOnFirstFrame.prototype = new CL3D.Animator();
CL3D.AnimatorOnFirstFrame.prototype.getType = function () {
	return "onfirstframe"
};
CL3D.AnimatorOnFirstFrame.prototype.animateNode = function (b, a) {
	if (this.RunAlready) {
		return false
	}
	this.RunAlready = true;
	if (this.TheActionHandler) {
		this.TheActionHandler.execute(b);
		return true
	}
	return false
};
CL3D.SoundManager = function () {
	this.Sounds = new Array();
	this.PlayingSounds = new Array()
};
CL3D.SoundManager.prototype.getSoundFromName = function (a) {
	for (var c = 0; c < this.Sounds.length; ++c) {
		var b = this.Sounds[c];
		if (b.Name == a) {
			return b
		}
	}
	return null
};
CL3D.SoundManager.prototype.addSound = function (a) {
	if (a != null) {
		if (this.getSoundFromName(a.Name) != null && CL3D.gCCDebugOutput) {
			CL3D.gCCDebugOutput.print("ERROR! Cannot add the sound multiple times: " + a.Name)
		}
		this.Sounds.push(a)
	}
};
CL3D.SoundManager.prototype.getSoundFromSoundName = function (b, a) {
	if (b == null || b == "") {
		return null
	}
	var c = this.getSoundFromName(b);
	if (c != null) {
		return c
	}
	if (a) {
		c = new CL3D.SoundSource(b);
		this.addSound(c);
		return c
	}
	return null
};
CL3D.SoundManager.prototype.play2D = function (e, a, h) {
	if (e == null) {
		return null
	}
	var b = null;
	if (typeof (e) == "string") {
		b = this.getSoundFromSoundName(e, true)
	} else {
		b = e
	} if (b == null || b.audioElem == null) {
		return
	}
	this.clearFinishedPlayingSounds();
	for (var c = 0; c < this.PlayingSounds.length;) {
		if (this.PlayingSounds[c].src === b) {
			this.PlayingSounds[c].src.audioElem.pause();
			this.PlayingSounds.remove(c)
		} else {
			++c
		}
	}
	try {
		b.audioElem.currentTime = 0
	} catch (g) {}
	b.audioElem.play();
	var d = new CL3D.PlayingSound(b);
	this.PlayingSounds.push(d);
	if (b.lastListener) {
		b.audioElem.removeEventListener("ended", b.lastListener, false)
	}
	b.audioElem.lastListener = null;
	if (a) {
		d.looping = true;
		var f = function () {
			if (!d.hasStopped) {
				try {
					this.currentTime = 0
				} catch (i) {}
				this.play()
			}
		};
		b.audioElem.addEventListener("ended", f, false);
		b.audioElem.lastListener = f
	}
	return d
};
CL3D.SoundManager.prototype.stop = function (a) {
	if (!a) {
		return
	}
	a.src.audioElem.pause();
	a.hasStopped = true;
	this.clearFinishedPlayingSounds()
};
CL3D.SoundManager.prototype.setVolume = function (c, a) {
	if (!c) {
		return
	}
	try {
		c.src.audioElem.volume = a
	} catch (b) {}
};
CL3D.SoundManager.prototype.stopAll = function () {
	for (var a = 0; a < this.PlayingSounds.length; ++a) {
		var b = this.PlayingSounds[a];
		b.hasStopped = true;
		b.src.audioElem.pause()
	}
	this.PlayingSounds = new Array()
};
CL3D.SoundManager.prototype.clearFinishedPlayingSounds = function () {
	for (var a = 0; a < this.PlayingSounds.length;) {
		if (this.PlayingSounds[a].hasPlayingCompleted()) {
			this.PlayingSounds.remove(a)
		} else {
			++a
		}
	}
};
CL3D.gSoundManager = new CL3D.SoundManager();
CL3D.SoundSource = function (c) {
	this.Name = c;
	var b = null;
	try {
		b = new Audio();
		b.src = c
	} catch (d) {}
	this.loaded = true;
	this.audioElem = b
};
CL3D.SoundSource.prototype.onAudioLoaded = function () {};
CL3D.PlayingSound = function (a) {
	this.src = a;
	this.hasStopped = false;
	this.looping = false;
	var b = new Date();
	this.startTime = b.getTime()
};
CL3D.PlayingSound.prototype.hasPlayingCompleted = function () {
	if (this.hasStopped) {
		return true
	}
	if (this.looping) {
		return false
	}
	var c = new Date();
	var a = c.getTime();
	var b = this.src.duration;
	return b > 0 && (a > this.startTime + b)
};
startCopperLichtFromFile = function (b, a) {
	var d = new CL3D.CopperLicht(b, true);
	d.load(a);
	return d
};
CL3D.CopperLicht = function (d, e, c, a) {
	if ((e == null || e == true) && CL3D.gCCDebugOutput == null) {
		CL3D.gCCDebugOutput = new CL3D.DebugOutput(d, a)
	}
	this.ElementIdOfCanvas = d;
	this.MainElement = document.getElementById(this.ElementIdOfCanvas);
	this.MainElement.height = this.MainElement.parentNode.clientHeight;
	this.MainElement.width = this.MainElement.parentNode.clientWidth;
	this.Document = new CL3D.CCDocument();
	this.TheRenderer = null;
	this.IsPaused = false;
	this.NextCameraToSetActive = null;
	this.TheTextureManager = new CL3D.TextureManager();
	this.TheMeshCache = new CL3D.MeshCache();
	this.LoadingAFile = false;
	this.LoadingAnimationCounter = 0;
	this.FPS = 60;
	this.OnAnimate = null;
	this.OnBeforeDrawAll = null;
	this.OnAfterDrawAll = null;
	this.OnLoadingComplete = null;
	this.RegisteredAnimatorsForKeyUp = new Array();
	this.RegisteredAnimatorsForKeyDown = new Array();
	this.MouseIsDown = false;
	this.MouseX = 0;
	this.MouseY = 0;
	this.MouseDownX = 0;
	this.MouseDownY = 0;
	this.MouseIsInside = true;
	this.LastCameraDragTime = 0;
	this.updateCanvasTopLeftPosition();
	if (c) {
		this.FPS = c
	}
	var b = this;
	CL3D.LoadingTimer = setInterval(function () {
		b.loadingUpdateIntervalHandler()
	}, 100)
};
CL3D.CopperLicht.prototype.initRenderer = function () {
	return this.createRenderer()
};
CL3D.CopperLicht.prototype.getRenderer = function () {
	return this.TheRenderer
};
CL3D.CopperLicht.prototype.getScene = function () {
	if (this.Document == null) {
		return null
	}
	return this.Document.getCurrentScene()
};
CL3D.CopperLicht.prototype.registerEventHandlers = function () {
	var a = this;
	document.onkeydown = function (c) {
		a.handleKeyDown(c)
	};
	document.onkeyup = function (c) {
		a.handleKeyUp(c)
	};
	var b = this.MainElement;
	if (b != null) {
		b.onmousemove = function (c) {
			a.handleMouseMove(c)
		};
		b.onmousedown = function (c) {
			a.handleMouseDown(c)
		};
		b.onmouseup = function (c) {
			a.handleMouseUp(c)
		};
		b.onmouseover = function (c) {
			a.MouseIsInside = true
		};
		b.onmouseout = function (c) {
			a.MouseIsInside = false
		}
	}
};
CL3D.CopperLicht.prototype.load = function (b) {
	if (!this.createRenderer()) {
		return false
	}
	var c = this;
	this.LoadingAFile = true;
	var a = new CL3D.CCFileLoader(b);
	a.load(function (d) {
		c.parseFile(d, b)
	})
};
CL3D.CopperLicht.prototype.createRenderer = function () {
	if (this.TheRenderer != null) {
		return true
	}
	var e = this.MainElement;
	if (e == null) {
		return false
	}
	var b = e;
	this.TheRenderer = new CL3D.Renderer();
	if (this.TheRenderer.init(b) == false) {
		return false
	}
	if (this.TheTextureManager) {
		this.TheTextureManager.TheRenderer = this.TheRenderer
	}
	this.registerEventHandlers();
	var d = this;
	var a = 1000 / this.FPS;
	setInterval(function () {
		d.draw3DIntervalHandler()
	}, a);
	return true
};
CL3D.CopperLicht.prototype.draw3DIntervalHandler = function () {
	this.draw3dScene();
	/*if (CL3D.gCCDebugOutput != null) {
		var b = this.Document.getCurrentScene();
		var a = null;
		if (b != null && b.UseCulling) {
			a = " nodes rendered: " + b.NodeCountRenderedLastTime
		}
		CL3D.gCCDebugOutput.updatefps(a)
	}*/
};
CL3D.CopperLicht.prototype.loadingUpdateIntervalHandler = function () {
	if (!CL3D.gCCDebugOutput) {
		return
	}++this.LoadingAnimationCounter;
	var b = 0;
	var c = 0;
	if (this.TheTextureManager) {
		b = this.TheTextureManager.getCountOfTexturesToLoad();
		c = this.TheTextureManager.getTextureCount()
	}

	if (this.LoadingAFile || b) {
		var a = "Loading and parsing 3D geometry (This could take a few minutes, please be patient)...";
		if (b > 0) {
			a = "Loading textures [" + (c - b) + "/" + c + "] "
		}
		switch (this.LoadingAnimationCounter % 4) {
		case 0:
			a += "--";
			break;
		case 1:
			a += "\\";
			break;
		case 2:
			a += "|";
			break;
		case 3:
			a += "/";
			break
		}
		CL3D.gCCDebugOutput.setLoadingText(a)
	} else {
		CL3D.gCCDebugOutput.setLoadingText(null)
	}
};
CL3D.CopperLicht.prototype.isLoading = function (a, b) {
	return this.LoadingAFile
};
CL3D.CopperLicht.prototype.parseFile = function (b, c) {
	this.LoadingAFile = false;
	var a = new CL3D.FlaceLoader();
	var d = a.loadFile(b, c, this.TheTextureManager, this.TheMeshCache, this);
	if (d != null) {
		this.Document = d;
		if (a.LoadedAReloadAction) {
			this.LastLoadedFileContent = a.StoredFileContent;
			this.LastLoadedFilename = c
		}
		this.gotoScene(d.getCurrentScene());
		this.draw3dScene();
		if (this.OnLoadingComplete != null) {
			this.OnLoadingComplete()
		}
	}
};
CL3D.CopperLicht.prototype.draw3dScene = function () {
	timeElapsed = (Date.now() - _oldTimeStamp)*_SPEED;
	_TIME += timeElapsed;
	_oldTimeStamp = Date.now();

	if (this.Document == null || this.TheRenderer == null) {
		return
	}
	this.updateCanvasTopLeftPosition();
	this.internalOnBeforeRendering();
	var a = this.Document.getCurrentScene();
	if (!this.IsPaused && a) {
		if (this.OnAnimate) {
			this.OnAnimate()
		}
		this.TheRenderer.registerFrame();
		if (a.doAnimate(this.TheRenderer)) {
			this.TheRenderer.beginScene(a.BackgroundColor);
			if (this.OnBeforeDrawAll) {
				this.OnBeforeDrawAll()
			}
			a.drawAll(this.TheRenderer);
			if (this.OnAfterDrawAll) {
				this.OnAfterDrawAll()
			}
			this.TheRenderer.endScene()
		}
	}
	this.internalOnAfterRendering()
};
CL3D.CopperLicht.prototype.internalOnAfterRendering = function () {
	this.setNextCameraActiveIfNeeded()
};
CL3D.CopperLicht.prototype.internalOnBeforeRendering = function () {
	this.setNextCameraActiveIfNeeded()
};
CL3D.CopperLicht.prototype.getScenes = function () {
	if (this.Document) {
		return this.Document.Scenes
	}
	return 0
};
CL3D.CopperLicht.prototype.addScene = function (a) {
	if (this.Document) {
		this.Document.Scenes.push(a);
		if (this.Document.Scenes.length == 1) {
			this.Document.setCurrentScene(a)
		}
	}
};
CL3D.CopperLicht.prototype.gotoSceneByName = function (f, e) {
	if (!this.Document) {
		return false
	}
	var b = this.Document.Scenes;
	var c = f;
	if (e) {
		c = c.toLowerCase()
	}
	for (var d = 0; d < b.length; ++d) {
		var a = b[d].Name;
		if (e) {
			a = a.toLowerCase()
		}
		if (c == a) {
			this.gotoScene(b[d]);
			return
		}
	}
};
CL3D.CopperLicht.prototype.gotoScene = function (f) {
	if (!f) {
		return false
	}
	var k = f.getSceneType() == "panorama";
	var l = f.getSceneType() == "free";
	var c = null;
	this.Document.setCurrentScene(f);
	if (f.WasAlreadyActivatedOnce) {
		c = f.getActiveCamera()
	} else {
		f.WasAlreadyActivatedOnce = true;
		var b = false;
		var h = f.getAllSceneNodesOfType("camera");
		if (h) {
			for (var e = 0; e < h.length; ++e) {
				var d = h[e];
				if (d && d.Active) {
					c = d;
					b = true;
					c.setAutoAspectIfNoFixedSet(this.TheRenderer.width, this.TheRenderer.height);
					break
				}
			}
		}
		if (!b) {
			var a = 4 / 3;
			if (this.TheRenderer.width && this.TheRenderer.height) {
				a = this.TheRenderer.width / this.TheRenderer.height
			}
			c = new CL3D.CameraSceneNode();
			c.setAspectRatio(a);
			f.RootNode.addChild(c);
			var j = null;
			var g = null;
			if (!k) {
				g = new CL3D.AnimatorCameraFPS(c, this);
				c.addAnimator(g)
			}
			if (l) {
				if (f.DefaultCameraPos != null) {
					c.Pos = f.DefaultCameraPos.clone()
				}
				if (f.DefaultCameraTarget != null) {
					if (g != null) {
						g.lookAt(f.DefaultCameraTarget)
					} else {
						c.setTarget(f.DefaultCameraTarget)
					}
				}
			}
			if (g) {
				g.setMayMove(!k)
			}
		}
		f.setActiveCamera(c);
		f.CollisionWorld = f.createCollisionGeometry(true);
		this.setCollisionWorldForAllSceneNodes(f.getRootSceneNode(), f.CollisionWorld)
	}
	f.setRedrawMode(this.Document.UpdateMode);
	f.forceRedrawNextFrame();
	return true
};
CL3D.CopperLicht.prototype.setNextCameraActiveIfNeeded = function () {
	if (this.NextCameraToSetActive == null) {
		return
	}
	var a = this.Document.getCurrentScene();
	if (a == null) {
		return
	}
	if (this.NextCameraToSetActive.scene === a) {
		if (this.TheRenderer) {
			this.NextCameraToSetActive.setAutoAspectIfNoFixedSet(this.TheRenderer.getWidth(), this.TheRenderer.getHeight())
		}
		a.setActiveCamera(this.NextCameraToSetActive);
		this.NextCameraToSetActive = null
	}
};
CL3D.CopperLicht.prototype.handleKeyDown = function (a) {
	var e = this.getScene();
	if (e == null) {
		return
	}
	if (a == null) {
		a = window.event
	}
	var b = false;
	var d = e.getActiveCamera();
	if (d != null) {
		b = d.onKeyDown(a)
	}
	for (var c = 0; c < this.RegisteredAnimatorsForKeyUp.length; ++c) {
		if (this.RegisteredAnimatorsForKeyDown[c].onKeyDown(a)) {
			b = true
		}
	}
	return this.handleKeyPropagation(a, b)
};
CL3D.CopperLicht.prototype.handleKeyUp = function (a) {
	var e = this.getScene();
	if (e == null) {
		return
	}
	if (a == null) {
		a = window.event
	}
	var b = false;
	var d = e.getActiveCamera();
	if (d != null) {
		b = d.onKeyUp(a)
	}
	for (var c = 0; c < this.RegisteredAnimatorsForKeyUp.length; ++c) {
		if (this.RegisteredAnimatorsForKeyUp[c].onKeyUp(a)) {
			b = true
		}
	}
	return this.handleKeyPropagation(a, b)
};
CL3D.CopperLicht.prototype.handleKeyPropagation = function (a, b) {
	if (b) {
		try {
			a.prevtDefault()
		} catch (c) {}
		return true
	}
	return false
};
CL3D.CopperLicht.prototype.registerAnimatorForKeyUp = function (a) {
	if (a != null) {
		this.RegisteredAnimatorsForKeyUp.push(a)
	}
};
CL3D.CopperLicht.prototype.registerAnimatorForKeyDown = function (a) {
	if (a != null) {
		this.RegisteredAnimatorsForKeyDown.push(a)
	}
};
CL3D.CopperLicht.prototype.updateCanvasTopLeftPosition = function (c) {
	var a = 0;
	var d = 0;
	var b = this.MainElement;
	while (b != null) {
		a += b.offsetLeft;
		d += b.offsetTop;
		b = b.offsetParent
	}
	this.CanvasTopLeftX = a;
	this.CanvasTopLeftY = d
};
CL3D.CopperLicht.prototype.getMousePosXFromEvent = function (a) {
	if (a.pageX) {
		return a.pageX - this.CanvasTopLeftX
	} else {
		return a.clientX - this.MainElement.offsetLeft + document.body.scrollLeft
	}
};
CL3D.CopperLicht.prototype.getMousePosYFromEvent = function (a) {
	if (a.pageY) {
		return a.pageY - this.CanvasTopLeftY
	} else {
		return a.clientY - this.MainElement.offsetTop + document.body.scrollTop
	}
};
CL3D.CopperLicht.prototype.handleMouseDown = function (a) {
	if (a == null) {
		a = window.event
	}
	this.MouseIsDown = true;
	this.MouseIsInside = true;
	if (a) {
		this.MouseDownX = this.getMousePosXFromEvent(a);
		this.MouseDownY = this.getMousePosYFromEvent(a)
	}
	var c = this.getScene();
	if (c == null) {
		return
	}
	var b = c.getActiveCamera();
	if (b != null) {
		b.onMouseDown(a)
	}
	c.postMouseDownToAnimators(a)
};
CL3D.CopperLicht.prototype.isMouseOverCanvas = function () {
	return this.MouseIsInside
};
CL3D.CopperLicht.prototype.getMouseX = function () {
	return this.MouseX
};
CL3D.CopperLicht.prototype.getMouseY = function () {
	return this.MouseY
};
CL3D.CopperLicht.prototype.isMouseDown = function () {
	return this.MouseIsDown
};
CL3D.CopperLicht.prototype.getMouseDownX = function () {
	return this.MouseDownX
};
CL3D.CopperLicht.prototype.getMouseDownY = function () {
	return this.MouseDownY
};
CL3D.CopperLicht.prototype.setMouseDownWhereMouseIsNow = function () {
	this.MouseDownX = this.MouseX;
	this.MouseDownY = this.MouseY
};
CL3D.CopperLicht.prototype.handleMouseUp = function (a) {
	if (a == null) {
		a = window.event
	}
	this.MouseIsDown = false;
	var c = this.getScene();
	if (c == null) {
		return
	}
	var b = c.getActiveCamera();
	if (b != null) {
		b.onMouseUp(a)
	}
	c.postMouseUpToAnimators(a)
};
CL3D.CopperLicht.prototype.handleMouseMove = function (a) {
	if (a == null) {
		a = window.event
	}
	if (a) {
		this.MouseX = this.getMousePosXFromEvent(a);
		this.MouseY = this.getMousePosYFromEvent(a)
	}
	var c = this.getScene();
	if (c == null) {
		return
	}
	var b = c.getActiveCamera();
	if (b != null) {
		b.onMouseMove(a)
	}
};
CL3D.CopperLicht.prototype.OnAnimate = null;
CL3D.CopperLicht.prototype.OnAfterDrawAll = null;
CL3D.CopperLicht.prototype.OnBeforeDrawAll = null;
CL3D.CopperLicht.prototype.OnLoadingComplete = null;
CL3D.CopperLicht.prototype.get3DPositionFrom2DPosition = function (m, k) {
	var a = this.TheRenderer;
	if (a == null) {
		return null
	}
	var c = a.getProjection();
	var l = a.getView();
	if (c == null || l == null) {
		return null
	}
	var b = c.multiply(l);
	var i = new CL3D.ViewFrustrum();
	i.setFrom(b);
	var d = i.getFarLeftUp();
	var g = i.getFarRightUp().substract(d);
	var f = i.getFarLeftDown().substract(d);
	var n = a.getWidth();
	var e = a.getHeight();
	var p = m / n;
	var o = k / e;
	var j = d.add(g.multiplyWithScal(p)).add(f.multiplyWithScal(o));
	return j
};
CL3D.CopperLicht.prototype.get2DPositionFrom3DPosition = function (b) {
	var a = this.TheRenderer;
	_tempM2.resetToZero();

	if (!a.Projection) {
		return null
	}
	a.Projection.copyTo(_tempM2);
	_tempM2.multiplyThisWith(a.View);
	var i = a.getWidth() / 2;
	var e = a.getHeight() / 2;
	var h = i;
	var g = e;
	if (e == 0 || i == 0) {
		return null
	}
	_tempV5.set(b.X, b.Y, b.Z);
	_tempV5.W = 1;
	_tempM2.multiplyWith1x4Matrix(_tempV5);
	var c = _tempV5.W == 0 ? 1 : (1 / _tempV5.W);
	if (_tempV5.Z < 0) {
		return null
	}

	_temp2V0.X = i * (_tempV5.X * c) + h;
	_temp2V0.Y = g - (e * (_tempV5.Y * c));
	return _temp2V0;
};
CL3D.CopperLicht.prototype.setActiveCameraNextFrame = function (a) {
	if (a == null) {
		return
	}
	this.NextCameraToSetActive = a
};
CL3D.CopperLicht.prototype.getTextureManager = function () {
	return this.TheTextureManager
};
CL3D.CopperLicht.prototype.setCollisionWorldForAllSceneNodes = function (g, e) {
	if (!g) {
		return
	}
	for (var a = 0; a < g.Animators.length; ++a) {
		var d = g.Animators[a];
		if (d) {
			if (d.getType() == "collisionresponse") {
				d.setWorld(e)
			} else {
				if (d.getType() == "onclick" || d.getType() == "onmove") {
					d.World = e
				} else {
					if (d.getType() == "gameai") {
						d.World = e
					} else {
						if (d.getType() == "3rdpersoncamera") {
							d.World = e
						}
					}
				}
			}
		}
	}
	for (var b = 0; b < g.Children.length; ++b) {
		var f = g.Children[b];
		if (f) {
			this.setCollisionWorldForAllSceneNodes(f, e)
		}
	}
};
CL3D.CopperLicht.prototype.reloadScene = function (e) {
	if (!e || !this.Document) {
		return false
	}
	if (this.LastLoadedFileContent == null) {
		return false
	}
	var f = null;
	var g = -1;
	for (var c = 0; c < this.Document.Scenes.length; ++c) {
		if (e == this.Document.Scenes[c].Name) {
			g = c;
			f = this.Document.Scenes[c];
			break
		}
	}
	if (g == -1) {
		return
	}
	var a = new CL3D.FlaceLoader();
	var b = a.reloadScene(this.LastLoadedFileContent, f, g, this.LastLoadedFilename, this.TheTextureManager, this.TheMeshCache, this);
	if (b != null) {
		var d = this.Document.getCurrentScene() == f;
		this.Document.Scenes[g] = b;
		if (d) {
			this.gotoScene(b)
		}
	}
	return true
};
CL3D.Scene = function () {
	this.RootNode = new CL3D.SceneNode();
	this.RootNode.scene = this;
	this.Name = "";
	this.BackgroundColor = 0;
	this.CollisionWorld = null;
	this.AmbientLight = new CL3D.ColorF();
	this.AmbientLight.R = 0;
	this.AmbientLight.G = 0;
	this.AmbientLight.B = 0;
	this.LastUsedRenderer = null;
	this.StartTime = 0;
	this.ActiveCamera = null;
	this.ForceRedrawThisFrame = false;
	this.LastViewProj = new CL3D.Matrix4();
	this.TheSkyBoxSceneNode = null;
	this.RedrawMode = 2;
	this.CurrentRenderMode = 0;
	this.SceneNodesToRender = new Array();
	this.SceneNodesToRenderTransparent = new Array();
	this.LightsToRender = new Array();
	this.Overlay2DToRender = new Array();
	this.RegisteredSceneNodeAnimatorsForEventsList = new Array();
	this.NodeCountRenderedLastTime = 0;
	this.UseCulling = false;
	this.WasAlreadyActivatedOnce = false
};
CL3D.Scene.prototype.init = function () {
	this.RootNode = new CL3D.SceneNode();
	this.RootNode.scene = this;
	this.Name = "";
	this.LastViewProj = new CL3D.Matrix4()
};
CL3D.Scene.prototype.getSceneType = function () {
	return "unknown"
};
CL3D.Scene.prototype.doAnimate = function (b) {
	this.LastUsedRenderer = b;
	if (this.StartTime == 0) {
		this.StartTime = CL3D.CLTimer.getTime()
	}
	this.TheSkyBoxSceneNode = null;
	var d = this.RootNode.OnAnimate(this, CL3D.CLTimer.getTime());
	var e = this.HasViewChangedSinceLastRedraw();
	var c = b ? b.getAndResetTextureWasLoadedFlag() : false;
	var a = this.ForceRedrawThisFrame || (this.RedrawMode == 0 && (e || c)) || (this.RedrawMode == 1 && (e || d || c)) || (this.RedrawMode == 2);
	if (!a) {
		return false
	}
	this.ForceRedrawThisFrame = false;
	return true
};
CL3D.Scene.prototype.getCurrentRenderMode = function () {
	return this.CurrentRenderMode
};
CL3D.Scene.prototype.updateNodesToRender = function(){
	delete this.SceneNodesToRender;
	delete this.SceneNodesToRenderTransparent;
	delete this.LightsToRender;
	delete this.Overlay2DToRender;

	this.SceneNodesToRender = new Array();
	this.SceneNodesToRenderTransparent = new Array();
	this.LightsToRender = new Array();
	this.Overlay2DToRender = new Array();
	this.RootNode.OnRegisterSceneNode(this);//SS: fill all the above arrays (pushes all the elements to be rendered)
}
CL3D.Scene.prototype.drawAll = function (f) {
	var a = 0; // Rendered Nodes Counter
	var b= null; // ActiveCamera
	var h = null; // Camera Bounding Box
	var length;

	this.CurrentRenderMode = CL3D.Scene.RENDER_MODE_CAMERA;
	
	if (this.ActiveCamera) {
		b = this.ActiveCamera.getAbsolutePosition();
		this.ActiveCamera.render(f)
	}
	this.CurrentRenderMode = CL3D.Scene.RENDER_MODE_SKYBOX;
	if (this.SkyBoxSceneNode) {
		this.SkyBoxSceneNode.render(f)
	}

	//I'm not using dynamic lights so the chuck below is not necessary (the less code, the better)

	//f.clearDynamicLights();
	//f.AmbientLight = this.AmbientLight.clone(); //SS: clone returns a new object, leaving the object f.AmbientLight is pointing to unreachable
	/*var d;	
	if (b != null && this.LightsToRender.length > 0) {
		this.LightsToRender.sort(function (l, i) {
			var m = b.getDistanceFromSQ(l.getAbsolutePosition());
			var k = b.getDistanceFromSQ(i.getAbsolutePosition());
			if (m > k) {
				return 1
			}
			if (m < k) {
				return -1
			}
			return 0
		})
	}
	this.CurrentRenderMode = CL3D.Scene.RENDER_MODE_LIGHTS;
	for (d = 0; d < this.LightsToRender.length; ++d) {
		this.LightsToRender[d].render(f)
	}
	a += this.LightsToRender.length;*/

	if (this.UseCulling) {
		var e = null;
		var c = f.getProjection();
		var g = f.getView();
		if (c != null && g != null && b != null) {
			var e = new CL3D.ViewFrustrum();
			e.setFrom(c.multiply(g));
			h = e.getBoundingBox(b)
		}
	}
	this.CurrentRenderMode = CL3D.Scene.RENDER_MODE_DEFAULT;
	length = this.SceneNodesToRender.length;
	for (d = 0; d < length; ++d) {
		var j = this.SceneNodesToRender[d];
		if (h == null || h.intersectsWithBox(j.getTransformedBoundingBox())) {
			j.render(f);
			a += 1
		}
	}
	this.CurrentRenderMode = CL3D.Scene.RENDER_MODE_TRANSPARENT;
	length = this.SceneNodesToRenderTransparent.length;
	if (b != null && length > 0) {
		this.SceneNodesToRenderTransparent.sort(function (l, i) {
			var m = b.getDistanceFromSQ(l.getAbsolutePosition());
			var k = b.getDistanceFromSQ(i.getAbsolutePosition());
			if (m < k) {
				return 1
			}
			if (m > k) {
				return -1
			}
			return 0
		})
	}
	for (d = 0; d < length; ++d) {
		var j = this.SceneNodesToRenderTransparent[d];
		if (h == null || h.intersectsWithBox(j.getTransformedBoundingBox())) {
			j.render(f);
			a += 1
		}
	}
	this.CurrentRenderMode = CL3D.Scene.RENDER_MODE_2DOVERLAY;
	length = this.Overlay2DToRender.length;
	for (d = 0; d < length; ++d) {
		this.Overlay2DToRender[d].render(f)
	}
	a += this.Overlay2DToRender.length;
	this.NodeCountRenderedLastTime = a;
	this.StoreViewMatrixForRedrawCheck()
};

CL3D.Scene.prototype.HasViewChangedSinceLastRedraw = function () {
	if (!this.ActiveCamera) {
		return true
	}
	_tempM0.resetToZero();
	this.ActiveCamera.Projection.copyTo(_tempM0);
	_tempM0.multiplyThisWith(this.ActiveCamera.ViewMatrix);
	return !_tempM0.equals(this.LastViewProj)
};
CL3D.Scene.prototype.StoreViewMatrixForRedrawCheck = function () {
	if (!this.ActiveCamera) {
		return
	}
	this.ActiveCamera.Projection.copyTo(this.LastViewProj);
	this.LastViewProj.multiplyThisWith(this.ActiveCamera.ViewMatrix);
};
CL3D.Scene.prototype.getLastUsedRenderer = function () {
	return this.LastUsedRenderer
};
CL3D.Scene.prototype.setBackgroundColor = function (a) {
	this.BackgroundColor = a
};
CL3D.Scene.prototype.getBackgroundColor = function () {
	return this.BackgroundColor
};
CL3D.Scene.prototype.getName = function () {
	return this.Name
};
CL3D.Scene.prototype.setName = function (a) {
	this.Name = a
};
CL3D.Scene.prototype.setRedrawMode = function (a) {
	this.RedrawMode = a
};
CL3D.Scene.prototype.setActiveCamera = function (a) {
	this.ActiveCamera = a
};
CL3D.Scene.prototype.getActiveCamera = function () {
	return this.ActiveCamera
};
CL3D.Scene.prototype.forceRedrawNextFrame = function () {
	this.ForceRedrawThisFrame = true
};
CL3D.Scene.prototype.getStartTime = function () {
	return this.StartTime
};
CL3D.Scene.prototype.registerNodeForRendering = function (a, b) {
	if (b == null) {
		b = CL3D.Scene.RENDER_MODE_DEFAULT
	}
	switch (b) {
	case CL3D.Scene.RENDER_MODE_SKYBOX:
		this.SkyBoxSceneNode = a;
		break;
	case CL3D.Scene.RENDER_MODE_DEFAULT:
		this.SceneNodesToRender.push(a);
		break;
	case CL3D.Scene.RENDER_MODE_LIGHTS:
		this.LightsToRender.push(a);
		break;
	case CL3D.Scene.RENDER_MODE_CAMERA:
		break;
	case CL3D.Scene.RENDER_MODE_TRANSPARENT:
		this.SceneNodesToRenderTransparent.push(a);
		break;
	case CL3D.Scene.RENDER_MODE_2DOVERLAY:
		this.Overlay2DToRender.push(a);
		break
	}
};
CL3D.Scene.prototype.getAllSceneNodesOfType = function (b) {
	if (this.RootNode == null) {
		return null
	}
	var a = new Array();
	this.getAllSceneNodesOfTypeImpl(this.RootNode, b, a);
	return a
};
CL3D.Scene.prototype.getAllSceneNodesOfTypeImpl = function (g, f, b) {
	if (g.getType() == f) {
		b.push(g)
	}
	for (var d = 0; d < g.Children.length; ++d) {
		var e = g.Children[d];
		this.getAllSceneNodesOfTypeImpl(e, f, b)
	}
};
CL3D.Scene.prototype.getAllSceneNodesWithAnimator = function (b) {
	if (this.RootNode == null) {
		return null
	}
	var a = new Array();
	this.getAllSceneNodesWithAnimatorImpl(this.RootNode, b, a);
	return a
};
CL3D.Scene.prototype.getAllSceneNodesWithAnimatorImpl = function (f, d, b) {
	if (f.getAnimatorOfType(d) != null) {
		b.push(f)
	}
	for (var c = 0; c < f.Children.length; ++c) {
		var e = f.Children[c];
		this.getAllSceneNodesWithAnimatorImpl(e, d, b)
	}
};
CL3D.Scene.prototype.getSceneNodeFromName = function (a) {
	if (this.RootNode == null) {
		return null
	}
	return this.getSceneNodeFromNameImpl(this.RootNode, a)
};
CL3D.Scene.prototype.getSceneNodeFromNameImpl = function (e, a) {
	if (e.Name == a) {
		return e
	}
	for (var b = 0; b < e.Children.length; ++b) {
		var d = e.Children[b];
		var c = this.getSceneNodeFromNameImpl(d, a);
		if (c) {
			return c
		}
	}
	return null
};
CL3D.Scene.prototype.getSceneNodeFromId = function (a) {
	if (this.RootNode == null) {
		return null
	}
	return this.getSceneNodeFromIdImpl(this.RootNode, a)
};
CL3D.Scene.prototype.getSceneNodeFromIdImpl = function (e, d) {
	if (e.Id == d) {
		return e
	}
	for (var a = 0; a < e.Children.length; ++a) {
		var c = e.Children[a];
		var b = this.getSceneNodeFromIdImpl(c, d);
		if (b) {
			return b
		}
	}
	return null
};
CL3D.Scene.prototype.getRootSceneNode = function () {
	return this.RootNode
};
CL3D.Scene.prototype.registerSceneNodeAnimatorForEvents = function (b) {
	if (b == null) {
		return
	}
	for (var c = 0; c < this.RegisteredSceneNodeAnimatorsForEventsList.length; ++c) {
		var d = this.RegisteredSceneNodeAnimatorsForEventsList[c];
		if (d === b) {
			return
		}
	}
	this.RegisteredSceneNodeAnimatorsForEventsList.push(b)
};
CL3D.Scene.prototype.postMouseDownToAnimators = function (c) {
	for (var a = 0; a < this.RegisteredSceneNodeAnimatorsForEventsList.length; ++a) {
		var b = this.RegisteredSceneNodeAnimatorsForEventsList[a];
		b.onMouseDown(c)
	}
};
CL3D.Scene.prototype.postMouseUpToAnimators = function (c) {
	for (var a = 0; a < this.RegisteredSceneNodeAnimatorsForEventsList.length; ++a) {
		var b = this.RegisteredSceneNodeAnimatorsForEventsList[a];
		b.onMouseUp(c)
	}
};
CL3D.Scene.prototype.getCollisionGeometry = function () {
	return this.CollisionWorld
};
CL3D.Scene.prototype.createCollisionGeometry = function (f, g) {
	var d = this.getAllSceneNodesOfType("mesh");
	if (d == null) {
		return null
	}
	var b = null;
	if (g) {
		g.clear();
		b = g
	} else {
		b = new CL3D.MetaTriangleSelector()
	}
	for (var e = 0; e < d.length; ++e) {
		var c = d[e];
		if (c && c.DoesCollision) {
			var a = null;
			if (c.Selector) {
				a = c.Selector
			} else {
				if (c.OwnedMesh && c.OwnedMesh.GetPolyCount() > 100) {
					a = new CL3D.OctTreeTriangleSelector(c.OwnedMesh, c)
				} else {
					a = new CL3D.MeshTriangleSelector(c.OwnedMesh, c)
				}
			} if (f && c.Selector == null) {
				c.Selector = a
			}
			b.addSelector(a)
		}
	}
	return b
};
CL3D.Scene.REDRAW_WHEN_CAM_MOVED = 2;
CL3D.Scene.REDRAW_WHEN_SCENE_CHANGED = 1;
CL3D.Scene.REDRAW_EVERY_FRAME = 2;
CL3D.Scene.RENDER_MODE_SKYBOX = 1;
CL3D.Scene.RENDER_MODE_DEFAULT = 0;
CL3D.Scene.RENDER_MODE_LIGHTS = 2;
CL3D.Scene.RENDER_MODE_CAMERA = 3;
CL3D.Scene.RENDER_MODE_TRANSPARENT = 4;
CL3D.Scene.RENDER_MODE_2DOVERLAY = 5;
CL3D.PanoramaScene = function () {
	this.init()
};
CL3D.PanoramaScene.prototype = new CL3D.Scene();
CL3D.PanoramaScene.prototype.getSceneType = function () {
	return "panorama"
};
CL3D.Free3dScene = function () {
	this.init();
	this.DefaultCameraPos = new CL3D.Vect3d();
	this.DefaultCameraTarget = new CL3D.Vect3d()
};
CL3D.Free3dScene.prototype = new CL3D.Scene();
CL3D.Free3dScene.prototype.getSceneType = function () {
	return "free"
};
CL3D.FlaceLoader = function () {
	this.Document = null;
	this.Data = null;
	this.Filename = "";
	this.NextTagPos = 0;
	this.TheTextureManager = null;
	this.CursorControl = null;
	this.PathRoot = "";
	this.TheMeshCache = null;
	this.StoredFileContent = null;
	this.LoadedAReloadAction = false;
	this.loadFile = function (b, c, f, e, g) {
		this.Filename = c;
		this.TheTextureManager = f;
		this.CursorControl = g;
		this.TheMeshCache = e;
		if (b.length == 0) {
			CL3D.gCCDebugOutput.printError("Error: Could not load file '" + c + "'\n(If your Internet connection is slow, try reloading the page)");
			var d = navigator.appVersion;
			if (d != null && d.indexOf("Chrome") != -1) {
				CL3D.gCCDebugOutput.printError("if you're opening this from your local files with Chrome,\nremember to add the parameter '--allow-file-access-from-files' when starting the browser.", true)
			}
			return null
		}
		/*if (c.indexOf(".ccbjs")) {
			b = CL3D.base64decode(b)
		}*/
		var a = new CL3D.CCDocument();
		this.Document = a;
		this.setRootPath();
		this.Data = new CL3D.BinaryStream(b);
		if (!this.parseFile()) {
			return null
		}
		this.StoredFileContent = b;
		return a
	};
	this.setRootPath = function () {
		var b = this.Filename;
		var a = b.lastIndexOf("/");
		if (a != -1) {
			b = b.substring(0, a + 1)
		}
		this.PathRoot = b
	};
	this.parseFile = function () {
		var e = this.Data.readSI32();
		if (e != 1701014630) {
			return false
		}
		var c = this.Data.readSI32();
		var b = this.Data.readUI32();
		var d = 0;
		while (this.Data.bytesAvailable() > 0) {
			var a = this.readTag();
			++d;
			if (d == 1 && a != 1) {
				return false
			}
			switch (a) {
			case 1:
				this.readDocument();
				break;
			case 12:
				this.readEmbeddedFiles();
				break;
			default:
				this.SkipToNextTag()
			}
		}
		return true
	};
	this.SkipToNextTag = function () {
		this.Data.seek(this.NextTagPos, true)
	};
	this.readTag = function () {
		var b = 0;
		b = this.Data.readUnsignedShort();
		var a = 0;
		a = this.Data.readUnsignedInt();
		this.CurrentTagSize = a;
		this.NextTagPos = this.Data.getPosition() + a;
		return b
	};
	this.ReadMatrix = function () {
		var a = new CL3D.Matrix4(false);
		this.ReadIntoExistingMatrix(a);
		return a
	};
	this.ReadIntoExistingMatrix = function (a) {
		for (var b = 0; b < 16; ++b) {
			a.setByIndex(b, this.Data.readFloat())
		}
	};
	this.ReadQuaternion = function () {
		var a = new CL3D.Quaternion();
		a.W = this.Data.readFloat();
		a.X = this.Data.readFloat();
		a.Y = this.Data.readFloat();
		a.Z = this.Data.readFloat();
		return a
	};
	this.ReadString = function (e) {
		var d = this.Data.readUnsignedInt();
		if (d > 1024 * 1024 * 100) {
			return ""
		}
		if (d <= 0) {
			return ""
		}
		var c = [];
		for (var a = 0; a < d; ++a) {
			var b = this.Data.readNumber(1);
			if (b != 0) {
				c.push(String.fromCharCode(b))
			}
		}
		return c.join("")
	};
	this.readDocument = function () {
		var d = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < d) {
			var a = this.readTag();
			switch (a) {
			case 1004:
				this.Document.CurrentScene = this.Data.readInt();
				break;
			case 20:
				this.readPublishSettings();
				break;
			case 2:
				var b = this.Data.readInt();
				var c = null;
				switch (b) {
				case 0:
					c = new CL3D.Free3dScene();
					this.readFreeScene(c);
					break;
				case 1:
					c = new CL3D.PanoramaScene();
					this.readPanoramaScene(c);
					break;
				default:
					this.SkipToNextTag()
				}
				this.Document.addScene(c);
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.reloadScene = function (i, h, a, b, j, g, k) {
		this.Filename = b;
		this.TheTextureManager = j;
		this.CursorControl = k;
		this.TheMeshCache = g;
		this.Data = new CL3D.BinaryStream(i);
		this.setRootPath();
		this.Data.readSI32();
		this.Data.readSI32();
		this.Data.readUI32();
		var f = -1;
		var l = this.readTag();
		if (l != 1) {
			return null
		}
		var c = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < c) {
			var l = this.readTag();
			switch (l) {
			case 2:
				var e = this.Data.readInt();
				++f;
				if (f == a) {
					var d = null;
					switch (e) {
					case 0:
						d = new CL3D.Free3dScene();
						this.readFreeScene(d);
						break;
					case 1:
						d = new CL3D.PanoramaScene();
						this.readPanoramaScene(d);
						break;
					default:
						this.SkipToNextTag()
					}
					return d
				} else {
					this.SkipToNextTag()
				}
			default:
				this.SkipToNextTag()
			}
		}
		return null
	};
	this.readPublishSettings = function () {
		this.Data.readInt();
		this.Document.ApplicationTitle = this.ReadString();
		var c = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < c) {
			var a = this.readTag();
			switch (a) {
			case 37:
				var b = this.Data.readInt();
				this.Data.readInt();
				if ((b & 1) != 0) {
					if (CL3D.gCCDebugOutput == null) {
						CL3D.gCCDebugOutput = new CL3D.DebugOutput(elementIdOfCanvas, showFPSCounter)
					} else {
						CL3D.gCCDebugOutput.enableFPSCounter()
					}
				}
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.readFreeScene = function (c) {
		var b = this.NextTagPos;
		this.readScene(c);
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < b) {
			var a = this.readTag();
			switch (a) {
			case 1007:
				c.DefaultCameraPos = this.Read3DVectF();
				c.DefaultCameraTarget = this.Read3DVectF();
				break;
			case 8:
				this.ReadSceneGraph(c);
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.readPanoramaScene = function (a) {
		this.SkipToNextTag()
	};
	this.Read3DVectF = function () {
		var a = new CL3D.Vect3d();
		a.X = this.Data.readFloat();
		a.Y = this.Data.readFloat();
		a.Z = this.Data.readFloat();
		return a
	};
	this.ReadColorF = function () {
		var a = new CL3D.ColorF();
		a.R = this.Data.readFloat();
		a.G = this.Data.readFloat();
		a.B = this.Data.readFloat();
		a.A = this.Data.readFloat();
		return a
	};
	this.ReadColorFAsInt = function () {
		var f = this.Data.readFloat();
		var e = this.Data.readFloat();
		var c = this.Data.readFloat();
		var d = this.Data.readFloat();
		if (f > 1) {
			f = 1
		}
		if (e > 1) {
			e = 1
		}
		if (c > 1) {
			c = 1
		}
		if (d > 1) {
			d = 1
		}
		return CL3D.createColor(d * 255, f * 255, e * 255, c * 255)
	};
	this.Read2DVectF = function () {
		var a = new CL3D.Vect2d();
		a.X = this.Data.readFloat();
		a.Y = this.Data.readFloat();
		return a
	};
	this.Read3DBoxF = function () {
		var a = new CL3D.Box3d();
		a.MinEdge = this.Read3DVectF();
		a.MaxEdge = this.Read3DVectF();
		return a
	};
	this.readScene = function (b) {
		var a = this.readTag();
		if (a == 26) {
			b.Name = this.ReadString();
			b.BackgroundColor = this.Data.readInt()
		} else {
			this.JumpBackFromTagReading()
		}
	};
	this.JumpBackFromTagReading = function () {
		this.Data.position -= 10
	};
	this.ReadSceneGraph = function (c) {
		var b = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < b) {
			var a = this.readTag();
			switch (a) {
			case 9:
				this.ReadSceneNode(c, c.RootNode, 0);
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.ReadSceneNode = function (x, s, y) {
		if (s == null) {
			return
		}
		var f = this.NextTagPos;
		var d = this.Data.readInt();
		var l = this.Data.readInt();
		var C = this.ReadString();
		var e = this.Read3DVectF();
		var j = this.Read3DVectF();
		var z = this.Read3DVectF();
		var i = this.Data.readBoolean();
		var n = this.Data.readInt();
		var g = null;
		var q = 0;
		if (y == 0) {
			s.setVisible(i);
			s.Name = C;
			s.Culling = n
		}
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < f) {
			var B = this.readTag();
			switch (B) {
			case 9:
				this.ReadSceneNode(x, g ? g : s, y + 1);
				break;
			case 10:
				switch (d) {
				case 2037085030:
					var v = new CL3D.SkyBoxSceneNode();
					v.Type = d;
					v.Pos = e;
					v.Rot = j;
					v.Scale = z;
					v.setVisible(i);
					v.Name = C;
					v.Culling = n;
					v.Id = l;
					v.scene = x;
					this.readFlaceMeshNode(v);
					s.addChild(v);
					g = v;
					g.updateAbsolutePosition();
					break;
				case 1752395110:
					var o = new CL3D.MeshSceneNode();
					o.Type = d;
					o.Pos = e;
					o.Rot = j;
					o.Scale = z;
					o.setVisible(i);
					o.Name = C;
					o.Culling = n;
					o.Id = l;
					o.scene = x;
					this.readFlaceMeshNode(o);
					s.addChild(o);
					g = o;
					g.updateAbsolutePosition();
					break;
				case 1835950438:
					var w = new CL3D.AnimatedMeshSceneNode();
					w.Type = d;
					w.Pos = e;
					w.Rot = j;
					w.Scale = z;
					w.setVisible(i);
					w.Name = C;
					w.Culling = n;
					w.Id = l;
					w.scene = x;
					this.readFlaceAnimatedMeshNode(w);
					s.addChild(w);
					g = w;
					g.updateAbsolutePosition();
					break;
				case 1953526632:
					var t = new CL3D.HotspotSceneNode(this.CursorControl, null);
					t.Type = d;
					t.Pos = e;
					t.Rot = j;
					t.Scale = z;
					t.setVisible(i);
					t.Name = C;
					t.Culling = n;
					t.Id = l;
					t.scene = x;
					this.readFlaceHotspotNode(t);
					s.addChild(t);
					g = t;
					g.updateAbsolutePosition();
					break;
				case 1819042406:
					var a = new CL3D.BillboardSceneNode();
					a.Type = d;
					a.Pos = e;
					a.Rot = j;
					a.Scale = z;
					a.setVisible(i);
					a.Name = C;
					a.Culling = n;
					a.Id = l;
					a.scene = x;
					this.readFlaceBillBoardNode(a);
					s.addChild(a);
					g = a;
					g.updateAbsolutePosition();
					break;
				case 1835098982:
					var u = new CL3D.CameraSceneNode();
					u.Type = d;
					u.Pos = e;
					u.Rot = j;
					u.Scale = z;
					u.setVisible(i);
					u.Name = C;
					u.Culling = n;
					u.scene = x;
					u.Id = l;
					this.readFlaceCameraNode(u);
					s.addChild(u);
					g = u;
					g.updateAbsolutePosition();
					break;
				case 1751608422:
					var k = new CL3D.LightSceneNode();
					k.Type = d;
					k.Pos = e;
					k.Rot = j;
					k.Scale = z;
					k.setVisible(i);
					k.Name = C;
					k.Culling = n;
					k.Id = l;
					k.scene = x;
					this.readFlaceLightNode(k);
					s.addChild(k);
					g = k;
					g.updateAbsolutePosition();
					break;
				case 1935946598:
					var m = new CL3D.SoundSceneNode();
					m.Type = d;
					m.Pos = e;
					m.Rot = j;
					m.Scale = z;
					m.setVisible(i);
					m.Name = C;
					m.Culling = n;
					m.Id = l;
					m.scene = x;
					this.readFlace3DSoundNode(m);
					s.addChild(m);
					g = m;
					g.updateAbsolutePosition();
					break;
				case 1752461414:
					var A = new CL3D.PathSceneNode();
					A.Type = d;
					A.Pos = e;
					A.Rot = j;
					A.Scale = z;
					A.setVisible(i);
					A.Name = C;
					A.Culling = n;
					A.Id = l;
					A.scene = x;
					this.readFlacePathNode(A);
					s.addChild(A);
					g = A;
					g.updateAbsolutePosition();
					break;
				case 1954112614:
					var b = new CL3D.DummyTransformationSceneNode();
					b.Type = d;
					b.Pos = e;
					b.Rot = j;
					b.Scale = z;
					b.setVisible(i);
					b.Name = C;
					b.Culling = n;
					b.Id = l;
					b.scene = x;
					b.Box = this.Read3DBoxF();
					for (var p = 0; p < 16; ++p) {
						b.RelativeTransformationMatrix.setByIndex(p, this.Data.readFloat())
					}
					s.addChild(b);
					g = b;
					g.updateAbsolutePosition();
					break;
				case 1868837478:
					var r = new CL3D.Overlay2DSceneNode(this.CursorControl);
					r.Type = d;
					r.Pos = e;
					r.Rot = j;
					r.Scale = z;
					r.setVisible(i);
					r.Name = C;
					r.Culling = n;
					r.Id = l;
					r.scene = x;
					this.readFlace2DOverlay(r);
					s.addChild(r);
					g = r;
					g.updateAbsolutePosition();
					break;
				default:
					if (y == 0) {
						x.AmbientLight = this.ReadColorF()
					}
					this.SkipToNextTag();
					break
				}
				break;
			case 11:
				var h = this.ReadMaterial();
				if (g && g.getMaterial(q)) {
					g.getMaterial(q).setFrom(h)
				}++q;
				break;
			case 25:
				var c = g;
				if (c == null && y == 0) {
					c = x.getRootSceneNode()
				}
				this.ReadAnimator(c, x);
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.readFlaceMeshNode = function (c) {
		var d = this.NextTagPos;
		c.Box = this.Read3DBoxF();
		this.Data.readBoolean();
		this.Data.readBoolean();
		c.DoesCollision = this.Data.readBoolean();
		this.Data.readBoolean();
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < d) {
			var b = this.readTag();
			switch (b) {
			case 14:
				var a = this.ReadMesh();
				c.OwnedMesh = a;
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.ReadMesh = function () {
		var b = new CL3D.Mesh();
		b.Box = this.Read3DBoxF();
		var d = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < d) {
			var a = this.readTag();
			switch (a) {
			case 15:
				var c = this.ReadMeshBuffer();
				if (c != null) {
					b.AddMeshBuffer(c)
				}
				break;
			default:
				this.SkipToNextTag()
			}
		}
		return b
	};
	this.ReadMeshBuffer = function () {
		var h = new CL3D.MeshBuffer();
		h.Box = this.Read3DBoxF();
		var a = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < a) {
			var n = this.readTag();
			switch (n) {
			case 11:
				h.Mat = this.ReadMaterial();
				break;
			case 16:
				var j = Math.floor(this.CurrentTagSize / 2);
				for (var f = 0; f < j; ++f) {
					h.Indices.push(this.Data.readShort())
				}
				break;
			case 17:
				var k = Math.floor(this.CurrentTagSize / 36);
				for (var m = 0; m < k; ++m) {
					var b = new CL3D.Vertex3D();
					b.Pos = this.Read3DVectF();
					b.Normal = this.Read3DVectF();
					b.Color = this.Data.readInt();
					b.TCoords = this.Read2DVectF();
					b.TCoords2 = new CL3D.Vect2d();
					h.Vertices.push(b)
				}
				break;
			case 18:
				var i = Math.floor(this.CurrentTagSize / 44);
				for (var d = 0; d < i; ++d) {
					var g = new CL3D.Vertex3D();
					g.Pos = this.Read3DVectF();
					g.Normal = this.Read3DVectF();
					g.Color = this.Data.readInt();
					g.TCoords = this.Read2DVectF();
					g.TCoords2 = this.Read2DVectF();
					h.Vertices.push(g)
				}
				break;
			case 19:
				var c = this.CurrentTagSize / 60;
				for (var l = 0; l < c; ++l) {
					var e = new CL3D.Vertex3D();
					e.Pos = this.Read3DVectF();
					e.Normal = this.Read3DVectF();
					e.Color = this.Data.readInt();
					e.TCoords = this.Read2DVectF();
					e.TCoords2 = new CL3D.Vect2d();
					this.Read3DVectF();
					this.Read3DVectF();
					h.Vertices.push(e)
				}
				break;
			default:
				this.SkipToNextTag()
			}
		}
		return h
	};
	this.ReadMaterial = function () {
		var c = new CL3D.Material();
		c.Type = this.Data.readInt();
		this.Data.readInt();
		this.Data.readInt();
		this.Data.readInt();
		this.Data.readInt();
		this.Data.readFloat();
		this.Data.readInt();
		this.Data.readInt();
		this.Data.readBoolean();
		this.Data.readBoolean();
		c.Lighting = this.Data.readBoolean();
		c.ZWriteEnabled = this.Data.readBoolean();
		this.Data.readByte();
		c.BackfaceCulling = this.Data.readBoolean();
		this.Data.readBoolean();
		this.Data.readBoolean();
		this.Data.readBoolean();
		for (var b = 0; b < 4; ++b) {
			var a = this.ReadTextureRef();
			switch (b) {
			case 0:
				c.Tex1 = a;
				break;
			case 1:
				c.Tex2 = a;
				break
			}
			this.Data.readBoolean();
			this.Data.readBoolean();
			this.Data.readBoolean();
			var d = this.Data.readShort();
			if (d != 0) {
				switch (b) {
				case 0:
					c.ClampTexture1 = true;
					break;
				case 1:
					break
				}
			}
		}
		return c
	};
	this.ReadFileStrRef = function () {
		return this.ReadString()
	};
	this.ReadSoundRef = function () {
		var b = this.ReadFileStrRef();
		var a = this.PathRoot + b;
		return CL3D.gSoundManager.getSoundFromSoundName(a, true)
	};
	this.ReadTextureRef = function () {
		var b = this.ReadFileStrRef();
		var a = this.PathRoot + b;
		if (this.TheTextureManager != null && b != "") {
			return this.TheTextureManager.getTexture(a, true)
		}
		return null
	};
	this.readFlaceHotspotNode = function (b) {
		var c = this.NextTagPos;
		b.Box = this.Read3DBoxF();
		b.Width = this.Data.readInt();
		b.Height = this.Data.readInt();
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < c) {
			var a = this.readTag();
			switch (a) {
			case 3:
				this.readHotspotData(b);
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.readHotspotData = function (b) {
		var c = this.NextTagPos;
		b.caption = this.ReadString();
		b.TheTexture = this.ReadTextureRef();
		this.Read2DVectF();
		this.Data.readInt();
		b.dateLimit = this.ReadString();
		b.useDateLimit = this.Data.readBoolean();
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < c) {
			var a = this.readTag();
			switch (a) {
			case 6:
				b.bExecuteJavaScript = true;
				b.executeJavaScript = this.ReadString();
				break;
			case 4:
				b.bGotoScene = true;
				b.gotoScene = this.ReadString();
				break;
			case 5:
				b.bOpenWebsite = true;
				b.website = this.ReadString();
				b.websiteTarget = this.ReadString();
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.readFlaceCameraNode = function (a) {
		a.Box = this.Read3DBoxF();
		a.Target = this.Read3DVectF();
		a.UpVector = this.Read3DVectF();
		a.Fovy = this.Data.readFloat();
		a.Aspect = this.Data.readFloat();
		a.ZNear = this.Data.readFloat();
		a.ZFar = this.Data.readFloat();
		a.Active = this.Data.readBoolean();
		a.recalculateProjectionMatrix()
	};
	this.readFlaceLightNode = function (b) {
		b.Box = this.Read3DBoxF();
		this.Data.readInt();
		b.LightData.Color = this.ReadColorF();
		this.ReadColorF();
		this.Data.readBoolean();
		this.Read3DVectF();
		var a = this.Data.readFloat();
		b.LightData.Radius = a;
		if (a != 0) {
			b.LightData.Attenuation = 1 / a
		}
	};
	this.readFlaceBillBoardNode = function (b) {
		b.MeshBuffer.Box = this.Read3DBoxF();
		b.Box = b.MeshBuffer.Box;
		b.SizeX = this.Data.readFloat();
		b.SizeY = this.Data.readFloat();
		var a = this.Data.readByte();
		b.IsVertical = (a & 2) != 0
	};
	this.readFlace3DSoundNode = function (a) {
		a.Box = this.Read3DBoxF();
		a.TheSound = this.ReadSoundRef();
		a.MinDistance = this.Data.readFloat();
		a.MaxDistance = this.Data.readFloat();
		a.PlayMode = this.Data.readInt();
		a.DeleteWhenFinished = this.Data.readBoolean();
		a.MaxTimeInterval = this.Data.readInt();
		a.MinTimeInterval = this.Data.readInt();
		a.Volume = this.Data.readFloat();
		a.PlayAs2D = this.Data.readBoolean();
		this.Data.readInt()
	};
	this.readFlacePathNode = function (a) {
		a.Box = this.Read3DBoxF();
		a.Tightness = this.Data.readFloat();
		a.IsClosedCircle = this.Data.readBoolean();
		this.Data.readInt();
		var b = this.Data.readInt();
		for (var c = 0; c < b; ++c) {
			a.Nodes.push(this.Read3DVectF())
		}
	};
	this.readFlace2DOverlay = function (a) {
		this.Data.readInt();
		a.SizeModeIsAbsolute = this.Data.readBoolean();
		if (a.SizeModeIsAbsolute) {
			a.PosAbsoluteX = this.Data.readInt();
			a.PosAbsoluteY = this.Data.readInt();
			a.SizeAbsoluteWidth = this.Data.readInt();
			a.SizeAbsoluteHeight = this.Data.readInt()
		} else {
			a.PosRelativeX = this.Data.readFloat();
			a.PosRelativeY = this.Data.readFloat();
			a.SizeRelativeWidth = this.Data.readFloat();
			a.SizeRelativeHeight = this.Data.readFloat()
		}
		a.ShowBackGround = this.Data.readBoolean();
		a.BackGroundColor = this.Data.readInt();
		a.Texture = this.ReadTextureRef();
		a.TextureHover = this.ReadTextureRef();
		a.RetainAspectRatio = this.Data.readBoolean();
		a.DrawText = this.Data.readBoolean();
		a.TextAlignment = this.Data.readByte();
		a.Text = this.ReadString();
		a.FontName = this.ReadString();
		a.TextColor = this.Data.readInt();
		a.AnimateOnHover = this.Data.readBoolean();
		a.OnHoverSetFontColor = this.Data.readBoolean();
		a.HoverFontColor = this.Data.readInt();
		a.OnHoverSetBackgroundColor = this.Data.readBoolean();
		a.HoverBackgroundColor = this.Data.readInt();
		a.OnHoverDrawTexture = this.Data.readBoolean()
	};
	this.ReadAnimator = function (t, z) {
		if (!t) {
			this.SkipToNextTag();
			return
		}
		var v;
		var q;
		var d = this.Data.readInt();
		var A = null;
		switch (d) {
		case 100:
			var a = new CL3D.AnimatorRotation();
			a.Rotation = this.Read3DVectF();
			A = a;
			break;
		case 101:
			var p = new CL3D.AnimatorFlyStraight();
			p.Start = this.Read3DVectF();
			p.End = this.Read3DVectF();
			p.TimeForWay = this.Data.readInt();
			p.Loop = this.Data.readBoolean();
			p.recalculateImidiateValues();
			A = p;
			break;
		case 102:
			var l = new CL3D.AnimatorFlyCircle();
			l.Center = this.Read3DVectF();
			l.Direction = this.Read3DVectF();
			l.Radius = this.Data.readFloat();
			l.Speed = this.Data.readFloat();
			l.init();
			A = l;
			break;
		case 103:
			var s = new CL3D.AnimatorCollisionResponse();
			s.Radius = this.Read3DVectF();
			s.Gravity = this.Read3DVectF();
			s.Translation = this.Read3DVectF();
			this.Read3DVectF();
			s.SlidingSpeed = this.Data.readFloat();
			A = s;
			break;
		case 104:
			var o = t;
			var b = new CL3D.AnimatorCameraFPS(t, this.CursorControl);
			b.MaxVerticalAngle = this.Data.readFloat();
			b.MoveSpeed = this.Data.readFloat();
			b.RotateSpeed = this.Data.readFloat();
			b.JumpSpeed = this.Data.readFloat();
			b.NoVerticalMovement = this.Data.readBoolean();
			var g = this.Data.readInt();
			if (g & 1) {
				b.moveByMouseMove = false;
				b.moveByMouseDown = true
			} else {
				b.moveByMouseMove = true;
				b.moveByMouseDown = false
			} if (o) {
				b.targetZoomValue = CL3D.radToDeg(o.Fovy);
				b.maxZoom = b.targetZoomValue + 10;
				b.zoomSpeed = (b.maxZoom - b.minZoom) / 50;
				if (b.mayZoom) {
					o.setFov(CL3D.degToRad(b.minZoom))
				}
			}
			A = b;
			break;
		case 105:
			var c = new CL3D.AnimatorCameraModelViewer(t, this.CursorControl);
			c.Radius = this.Data.readFloat();
			c.RotateSpeed = this.Data.readFloat();
			c.NoVerticalMovement = this.Data.readBoolean();
			var g = this.Data.readInt();
			if (g & 2) {
				c.SlideAfterMovementEnd = true;
				c.SlidingSpeed = this.Data.readFloat()
			}
			A = c;
			break;
		case 106:
			var k = new CL3D.AnimatorFollowPath(z);
			k.TimeNeeded = this.Data.readInt();
			k.LookIntoMovementDirection = this.Data.readBoolean();
			k.PathToFollow = this.ReadString();
			k.OnlyMoveWhenCameraActive = this.Data.readBoolean();
			k.AdditionalRotation = this.Read3DVectF();
			k.EndMode = this.Data.readByte();
			k.CameraToSwitchTo = this.ReadString();
			var g = this.Data.readInt();
			if (g & 1) {
				k.TimeDisplacement = this.Data.readInt()
			}
			A = k;
			break;
		case 107:
			var j = new CL3D.AnimatorOnClick(z, this.CursorControl);
			j.BoundingBoxTestOnly = this.Data.readBoolean();
			j.CollidesWithWorld = this.Data.readBoolean();
			this.Data.readInt();
			j.TheActionHandler = this.ReadActionHandlerSection(z);
			A = j;
			break;
		case 108:
			var e = new CL3D.AnimatorOnProximity(z);
			e.EnterType = this.Data.readInt();
			e.ProximityType = this.Data.readInt();
			e.Range = this.Data.readFloat();
			e.SceneNodeToTest = this.Data.readInt();
			this.Data.readInt();
			e.TheActionHandler = this.ReadActionHandlerSection(z);
			A = e;
			break;
		case 109:
			var f = new CL3D.AnimatorAnimateTexture();
			f.TextureChangeType = this.Data.readInt();
			f.TimePerFrame = this.Data.readInt();
			f.TextureIndexToChange = this.Data.readInt();
			f.Loop = this.Data.readBoolean();
			var n = this.Data.readInt();
			f.Textures = new Array();
			for (var u = 0; u < n; ++u) {
				f.Textures.push(this.ReadTextureRef())
			}
			A = f;
			break;
		case 110:
			var j = new CL3D.AnimatorOnMove(z, this.CursorControl);
			j.BoundingBoxTestOnly = this.Data.readBoolean();
			j.CollidesWithWorld = this.Data.readBoolean();
			this.Data.readInt();
			j.ActionHandlerOnLeave = this.ReadActionHandlerSection(z);
			j.ActionHandlerOnEnter = this.ReadActionHandlerSection(z);
			A = j;
			break;
		case 111:
			var r = new CL3D.AnimatorTimer(z);
			r.TickEverySeconds = this.Data.readInt();
			this.Data.readInt();
			r.TheActionHandler = this.ReadActionHandlerSection(z);
			A = r;
			break;
		case 112:
			var y = new CL3D.AnimatorOnKeyPress(z, this.CursorControl);
			y.KeyPressType = this.Data.readInt();
			y.KeyCode = this.Data.readInt();
			y.IfCameraOnlyDoIfActive = this.Data.readBoolean();
			this.Data.readInt();
			y.TheActionHandler = this.ReadActionHandlerSection(z);
			A = y;
			break;
		case 113:
			var h = new CL3D.AnimatorGameAI(z);
			h.AIType = this.Data.readInt();
			h.MovementSpeed = this.Data.readFloat();
			h.ActivationRadius = this.Data.readFloat();
			h.CanFly = this.Data.readBoolean();
			h.Health = this.Data.readInt();
			h.Tags = this.ReadString();
			h.AttacksAIWithTags = this.ReadString();
			h.PatrolRadius = this.Data.readFloat();
			h.RotationSpeedMs = this.Data.readInt();
			h.AdditionalRotationForLooking = this.Read3DVectF();
			h.StandAnimation = this.ReadString();
			h.WalkAnimation = this.ReadString();
			h.DieAnimation = this.ReadString();
			h.AttackAnimation = this.ReadString();
			this.Data.readInt();
			h.ActionHandlerOnAttack = this.ReadActionHandlerSection(z);
			h.ActionHandlerOnActivate = this.ReadActionHandlerSection(z);
			h.ActionHandlerOnHit = this.ReadActionHandlerSection(z);
			h.ActionHandlerOnDie = this.ReadActionHandlerSection(z);
			A = h;
			break;
		case 114:
			var x = new CL3D.Animator3rdPersonCamera();
			x.SceneNodeIDToFollow = this.Data.readInt();
			x.AdditionalRotationForLooking = this.Read3DVectF();
			x.FollowMode = this.Data.readInt();
			x.FollowSmoothingSpeed = this.Data.readFloat();
			x.TargetHeight = this.Data.readFloat();
			var g = this.Data.readInt();
			if (g & 1) {
				x.CollidesWithWorld = true
			} else {
				x.CollidesWithWorld = false
			}
			A = x;
			break;
		case 115:
			var m = new CL3D.AnimatorKeyboardControlled(z, this.CursorControl);
			this.Data.readInt();
			m.RunSpeed = this.Data.readFloat();
			m.MoveSpeed = this.Data.readFloat();
			m.RotateSpeed = this.Data.readFloat();
			m.JumpSpeed = this.Data.readFloat();
			m.AdditionalRotationForLooking = this.Read3DVectF();
			m.StandAnimation = this.ReadString();
			m.WalkAnimation = this.ReadString();
			m.JumpAnimation = this.ReadString();
			m.RunAnimation = this.ReadString();
			var g = this.Data.readInt();
			if (g & 1) {
				m.DisableWithoutActiveCamera = true
			}
			A = m;
			break;
		case 116:
			var w = new CL3D.AnimatorOnFirstFrame(z);
			w.AlsoOnReload = this.Data.readBoolean();
			this.Data.readInt();
			w.TheActionHandler = this.ReadActionHandlerSection(z);
			A = w;
			break;
		default:
			this.SkipToNextTag();
			return
		}
		if (A) {
			t.addAnimator(A)
		}
	};
	this.ReadActionHandlerSection = function (b) {
		var c = this.Data.readInt();
		if (c) {
			var a = new CL3D.ActionHandler(b);
			this.ReadActionHandler(a, b);
			return a
		}
		return null
	};
	this.ReadActionHandler = function (c, f) {
		var a = this.readTag();
		if (a != 29) {
			this.SkipToNextTag();
			return
		}
		var b = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < b) {
			a = this.readTag();
			if (a == 30) {
				var d = this.Data.readInt();
				var e = this.ReadAction(d, f);
				if (e) {
					c.addAction(e)
				}
			} else {
				this.SkipToNextTag()
			}
		}
	};
	this.readEmbeddedFiles = function () {
		var f = this.NextTagPos;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < f) {
			var a = this.readTag();
			switch (a) {
			case 13:
				var b = this.Data.readInt();
				var d = this.ReadString();
				var c = this.Data.readInt();
				if (b & 4) {
					var e = this.TheMeshCache.getMeshFromName(d);
					if (e) {
						this.readSkinnedMesh(e, c)
					}
				}
				this.SkipToNextTag();
				break;
			default:
				this.SkipToNextTag()
			}
		}
	};
	this.readFlaceAnimatedMeshNode = function (c) {
		c.Box = this.Read3DBoxF();
		this.Data.readBoolean();
		this.Data.readInt();
		var b = this.Data.readInt();
		var a = this.Data.readInt();
		c.FramesPerSecond = this.Data.readFloat();
		this.Data.readByte();
		c.Looping = this.Data.readBoolean();
		this.Data.readInt();
		c.setMesh(this.ReadAnimatedMeshRef(c));
		c.StartFrame = b;
		c.EndFrame = a
	};
	this.ReadAnimatedMeshRef = function (a) {
		var b = this.ReadFileStrRef();
		var c = this.TheMeshCache.getMeshFromName(b);
		if (c == null) {
			var d = new CL3D.SkinnedMesh();
			d.Name = b;
			this.TheMeshCache.addMesh(d);
			c = d
		}
		if (a != null && c != null) {
			if (c.AnimatedMeshesToLink == null) {
				c.AnimatedMeshesToLink = new Array()
			}
			c.AnimatedMeshesToLink.push(a)
		}
		return c
	};
	this.readSkinnedMesh = function (a, n) {
		if (a == null) {
			return
		}
		this.Data.readInt();
		a.DefaultFPS = this.Data.readFloat();
		var u = this.NextTagPos;
		var v = this.Data.getPosition() + n;
		var m = new Array();
		var s = 0;
		while (this.Data.bytesAvailable() > 0 && this.Data.getPosition() < u && this.Data.getPosition() < v) {
			var w = this.readTag();
			if (w == 33) {
				var q = new CL3D.SkinnedMeshJoint();
				q.Name = this.ReadString();
				q.LocalMatrix = this.ReadMatrix();
				q.GlobalInversedMatrix = this.ReadMatrix();
				a.AllJoints.push(q);
				var d = this.Data.readInt();
				m.push(q);
				if (d >= 0 && d < m.length) {
					var t = m[d];
					t.Children.push(q)
				}
				var f = this.Data.readInt();
				for (var o = 0; o < f; ++o) {
					q.AttachedMeshes.push(this.Data.readInt())
				}
				var c = this.Data.readInt();
				for (s = 0; s < c; ++s) {
					var g = new CL3D.SkinnedMeshPositionKey();
					g.frame = this.Data.readFloat();
					g.position = this.Read3DVectF();
					q.PositionKeys.push(g)
				}
				c = this.Data.readInt();
				for (s = 0; s < c; ++s) {
					var b = new CL3D.SkinnedMeshScaleKey();
					b.frame = this.Data.readFloat();
					b.scale = this.Read3DVectF();
					q.ScaleKeys.push(b)
				}
				c = this.Data.readInt();
				for (s = 0; s < c; ++s) {
					var r = new CL3D.SkinnedMeshRotationKey();
					r.frame = this.Data.readFloat();
					r.rotation = this.ReadQuaternion();
					q.RotationKeys.push(r)
				}
				c = this.Data.readInt();
				for (s = 0; s < c; ++s) {
					var h = new CL3D.SkinnedMeshWeight();
					h.buffer_id = this.Data.readUnsignedShort();
					h.vertex_id = this.Data.readInt();
					h.strength = this.Data.readFloat();
					q.Weights.push(h)
				}
			} else {
				if (w == 15) {
					var p = this.ReadMeshBuffer();
					if (p != null) {
						a.AddMeshBuffer(p)
					}
				} else {
					if (w == 34) {
						var l = new CL3D.NamedAnimationRange();
						l.Name = this.ReadString();
						l.Begin = this.Data.readFloat();
						l.End = this.Data.readFloat();
						l.FPS = this.Data.readFloat();
						a.addNamedAnimationRange(l)
					} else {
						this.SkipToNextTag()
					}
				}
			}
		}
		try {
			a.finalize()
		} catch (e) {
			CL3D.gCCDebugOutput.printError("error finalizing skinned mesh: " + e)
		}
		if (a.AnimatedMeshesToLink && a.AnimatedMeshesToLink.length) {
			for (s = 0; s < a.AnimatedMeshesToLink.length; ++s) {
				var k = a.AnimatedMeshesToLink[s];
				if (k) {
					k.setFrameLoop(k.StartFrame, k.EndFrame)
				}
			}
			a.AnimatedMeshesToLink = null
		}
	};
	this.ReadAction = function (e, s) {
		var j = 0;
		switch (e) {
		case 0:
			var q = new CL3D.Action.MakeSceneNodeInvisible();
			q.InvisibleMakeType = this.Data.readInt();
			q.SceneNodeToMakeInvisible = this.Data.readInt();
			q.ChangeCurrentSceneNode = this.Data.readBoolean();
			this.Data.readInt();
			return q;
		case 1:
			var i = new CL3D.Action.ChangeSceneNodePosition();
			i.PositionChangeType = this.Data.readInt();
			i.SceneNodeToChangePosition = this.Data.readInt();
			i.ChangeCurrentSceneNode = this.Data.readBoolean();
			i.Vector = this.Read3DVectF();
			i.RelativeToCurrentSceneNode = this.Data.readBoolean();
			i.SceneNodeRelativeTo = this.Data.readInt();
			j = this.Data.readInt();
			if (j & 1) {
				i.UseAnimatedMovement = true;
				i.TimeNeededForMovementMs = this.Data.readInt()
			}
			return i;
		case 2:
			var h = new CL3D.Action.ChangeSceneNodeRotation();
			h.RotationChangeType = this.Data.readInt();
			h.SceneNodeToChangeRotation = this.Data.readInt();
			h.ChangeCurrentSceneNode = this.Data.readBoolean();
			h.Vector = this.Read3DVectF();
			h.RotateAnimated = false;
			j = this.Data.readInt();
			if (j & 1) {
				h.RotateAnimated = true;
				h.TimeNeededForRotationMs = this.Data.readInt()
			}
			return h;
		case 3:
			var g = new CL3D.Action.ChangeSceneNodeScale();
			g.ScaleChangeType = this.Data.readInt();
			g.SceneNodeToChangeScale = this.Data.readInt();
			g.ChangeCurrentSceneNode = this.Data.readBoolean();
			g.Vector = this.Read3DVectF();
			this.Data.readInt();
			return g;
		case 4:
			var f = new CL3D.Action.ChangeSceneNodeTexture();
			f.TextureChangeType = this.Data.readInt();
			f.SceneNodeToChange = this.Data.readInt();
			f.ChangeCurrentSceneNode = this.Data.readBoolean();
			f.TheTexture = this.ReadTextureRef();
			if (f.TextureChangeType == 1) {
				f.IndexToChange = this.Data.readInt()
			}
			this.Data.readInt();
			return f;
		case 5:
			var p = new CL3D.Action.ActionPlaySound();
			this.Data.readInt();
			p.TheSound = this.ReadSoundRef();
			p.MinDistance = this.Data.readFloat();
			p.MaxDistance = this.Data.readFloat();
			p.Volume = this.Data.readFloat();
			p.PlayAs2D = this.Data.readBoolean();
			p.SceneNodeToPlayAt = this.Data.readInt();
			p.PlayAtCurrentSceneNode = this.Data.readBoolean();
			p.Position3D = this.Read3DVectF();
			return p;
		case 6:
			var r = new CL3D.Action.ActionStopSound();
			r.SoundChangeType = this.Data.readInt();
			return r;
		case 7:
			var t = new CL3D.Action.ExecuteJavaScript();
			this.Data.readInt();
			t.JScript = this.ReadString();
			return t;
		case 8:
			var v = new CL3D.Action.OpenWebpage();
			this.Data.readInt();
			v.Webpage = this.ReadString();
			v.Target = this.ReadString();
			return v;
		case 9:
			var w = new CL3D.Action.SetSceneNodeAnimation();
			w.SceneNodeToChangeAnim = this.Data.readInt();
			w.ChangeCurrentSceneNode = this.Data.readBoolean();
			w.Loop = this.Data.readBoolean();
			w.AnimName = this.ReadString();
			this.Data.readInt();
			return w;
		case 10:
			var d = new CL3D.Action.SwitchToScene(this.CursorControl);
			d.SceneName = this.ReadString();
			this.Data.readInt();
			return d;
		case 11:
			var m = new CL3D.Action.SetActiveCamera(this.CursorControl);
			m.CameraToSetActive = this.Data.readInt();
			this.Data.readInt();
			return m;
		case 12:
			var k = new CL3D.Action.SetCameraTarget();
			k.PositionChangeType = this.Data.readInt();
			k.SceneNodeToChangePosition = this.Data.readInt();
			k.ChangeCurrentSceneNode = this.Data.readBoolean();
			k.Vector = this.Read3DVectF();
			k.RelativeToCurrentSceneNode = this.Data.readBoolean();
			k.SceneNodeRelativeTo = this.Data.readInt();
			j = this.Data.readInt();
			if (j & 1) {
				k.UseAnimatedMovement = true;
				k.TimeNeededForMovementMs = this.Data.readInt()
			}
			return k;
		case 13:
			var c = new CL3D.Action.Shoot();
			c.ShootType = this.Data.readInt();
			c.Damage = this.Data.readInt();
			c.BulletSpeed = this.Data.readFloat();
			c.SceneNodeToUseAsBullet = this.Data.readInt();
			c.WeaponRange = this.Data.readFloat();
			j = this.Data.readInt();
			if (j & 1) {
				c.SceneNodeToShootFrom = this.Data.readInt();
				c.ShootToCameraTarget = this.Data.readBoolean();
				c.AdditionalDirectionRotation = this.Read3DVectF()
			}
			if (j & 2) {
				c.ActionHandlerOnImpact = this.ReadActionHandlerSection(s)
			}
			return c;
		case 14:
			this.SkipToNextTag();
			return null;
		case 15:
			var n = new CL3D.Action.SetOverlayText();
			this.Data.readInt();
			n.SceneNodeToChange = this.Data.readInt();
			n.ChangeCurrentSceneNode = this.Data.readBoolean();
			n.Text = this.ReadString();
			return n;
		case 16:
			var o = new CL3D.Action.SetOrChangeAVariable();
			this.Data.readInt();
			o.VariableName = this.ReadString();
			o.Operation = this.Data.readInt();
			o.ValueType = this.Data.readInt();
			o.Value = this.ReadString();
			return o;
		case 17:
			var b = new CL3D.Action.IfVariable();
			this.Data.readInt();
			b.VariableName = this.ReadString();
			b.ComparisonType = this.Data.readInt();
			b.ValueType = this.Data.readInt();
			b.Value = this.ReadString();
			b.TheActionHandler = this.ReadActionHandlerSection(s);
			return b;
		case 18:
			var l = new CL3D.Action.RestartBehaviors();
			l.SceneNodeToRestart = this.Data.readInt();
			l.ChangeCurrentSceneNode = this.Data.readBoolean();
			this.Data.readInt();
			return l;
		case 19:
			var a = new CL3D.Action.ActionStoreLoadVariable();
			this.Data.readInt();
			a.VariableName = this.ReadString();
			a.Load = this.Data.readBoolean();
			return a;
		case 20:
			var u = new CL3D.Action.ActionRestartScene(this.CursorControl);
			this.Data.readInt();
			u.SceneName = this.ReadString();
			this.LoadedAReloadAction = true;
			return u;
		default:
			this.SkipToNextTag()
		}
		return null
	}
};
CL3D.CCDocument = function () {
	this.CurrentScene = -1;
	this.ApplicationTitle = "";
	this.Scenes = new Array();
	this.UpdateMode = CL3D.Scene.REDRAW_EVERY_FRAME;
	this.CanvasWidth = 320;
	this.CanvasHeight = 200;
	this.addScene = function (a) {
		this.Scenes.push(a)
	};
	this.getCurrentScene = function (a) {
		if (this.CurrentScene < 0 || this.CurrentScene >= this.Scenes.length) {
			return null
		}
		return this.Scenes[this.CurrentScene]
	};
	this.setCurrentScene = function (b) {
		for (var a = 0; a < this.Scenes.length; ++a) {
			if (this.Scenes[a] === b) {
				this.CurrentScene = a;
				return
			}
		}
	}
};
CL3D.base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
CL3D.base64decode = function (j) {
	var f, d, b, a;
	var g, h, e;
	var c = CL3D.base64DecodeChars;
	h = j.length;
	g = 0;
	e = "";
	while (g < h) {
		do {
			f = c[j.charCodeAt(g++) & 255]
		} while (g < h && f == -1);
		if (f == -1) {
			break
		}
		do {
			d = c[j.charCodeAt(g++) & 255]
		} while (g < h && d == -1);
		if (d == -1) {
			break
		}
		e += String.fromCharCode((f << 2) | ((d & 48) >> 4));
		do {
			b = j.charCodeAt(g++) & 255;
			if (b == 61) {
				return e
			}
			b = c[b]
		} while (g < h && b == -1);
		if (b == -1) {
			break
		}
		e += String.fromCharCode(((d & 15) << 4) | ((b & 60) >> 2));
		do {
			a = j.charCodeAt(g++) & 255;
			if (a == 61) {
				return e
			}
			a = c[a]
		} while (g < h && a == -1);
		if (a == -1) {
			break
		}
		e += String.fromCharCode(((b & 3) << 6) | a)
	}
	return e
};
CL3D.TriangleSelector = function () {};
CL3D.TriangleSelector.prototype.getAllTriangles = function (a, b) {};
CL3D.TriangleSelector.prototype.getTrianglesInBox = function (c, a, b) {
	this.getAllTriangles(a, b)
};
CL3D.TriangleSelector.prototype.getCollisionPointWithLine = function (e, d, f, m, a) {
	if (!e || !d) {
		return null
	}
	if (this.Node != null && a && this.Node.getVisible() == false) {
		return null
	}
	var h = new CL3D.Box3d();
	h.MinEdge = e.clone();
	h.MaxEdge = e.clone();
	h.addInternalPointByVector(d);
	var l = new Array();
	this.getTrianglesInBox(h, null, l);
	var c = d.substract(e);
	c.normalize();
	var g;
	var b = 999999999.9;
	var k = d.substract(e).getLengthSQ();
	var v = Math.min(e.X, d.X);
	var t = Math.max(e.X, d.X);
	var s = Math.min(e.Y, d.Y);
	var r = Math.max(e.Y, d.Y);
	var q = Math.min(e.Z, d.Z);
	var p = Math.max(e.Z, d.Z);
	var w = null;
	for (var o = 0; o < l.length; ++o) {
		var n = l[o];
		if (f && !n.getPlane().isFrontFacing(c)) {
			continue
		}
		if (v > n.pointA.X && v > n.pointB.X && v > n.pointC.X) {
			continue
		}
		if (t < n.pointA.X && t < n.pointB.X && t < n.pointC.X) {
			continue
		}
		if (s > n.pointA.Y && s > n.pointB.Y && s > n.pointC.Y) {
			continue
		}
		if (r < n.pointA.Y && r < n.pointB.Y && r < n.pointC.Y) {
			continue
		}
		if (q > n.pointA.Z && q > n.pointB.Z && q > n.pointC.Z) {
			continue
		}
		if (p < n.pointA.Z && p < n.pointB.Z && p < n.pointC.Z) {
			continue
		}
		if (e.getDistanceFromSQ(n.pointA) >= b && e.getDistanceFromSQ(n.pointB) >= b && e.getDistanceFromSQ(n.pointC) >= b) {
			continue
		}
		g = n.getIntersectionWithLine(e, c);
		if (g) {
			var u = g.getDistanceFromSQ(e);
			var j = g.getDistanceFromSQ(d);
			if (u < k && j < k && u < b) {
				b = u;
				if (m) {
					n.copyTo(m)
				}
				w = g
			}
		}
	}
	if (w) {
		return w.clone()
	}
	return null
};
CL3D.TriangleSelector.prototype.getRelatedSceneNode = function () {
	return null
};
CL3D.TriangleSelector.prototype.setNodeToIgnore = function (a) {};
CL3D.MeshTriangleSelector = function (k, i) {
	if (!k) {
		return
	}
	this.Node = i;
	this.Triangles = new Array();
	for (var g = 0; g < k.MeshBuffers.length; ++g) {
		var h = k.MeshBuffers[g];
		if (h) {
			var c = h.Indices.length;
			for (var a = 0; a < c; a += 3) {
				var f = h.Vertices[h.Indices[a]];
				var e = h.Vertices[h.Indices[a + 1]];
				var d = h.Vertices[h.Indices[a + 2]];
				this.Triangles.push(new CL3D.Triangle3d(f.Pos, e.Pos, d.Pos))
			}
		}
	}
};
CL3D.MeshTriangleSelector.prototype = new CL3D.TriangleSelector();
/*CL3D.MeshTriangleSelector.prototype.getAllTriangles = function (a, d) {
	if (!this.Node.AbsoluteTransformation) {
		return
	}
	var c;
	if (a) {
		c = a.multiply(this.Node.AbsoluteTransformation)
	} else {
		c = this.Node.AbsoluteTransformation
	}
	var b;
	if (c.isIdentity()) {
		for (b = 0; b < this.Triangles.length; ++b) {
			d.push(this.Triangles[b])
		}
	} else {
		if (c.isTranslateOnly()) {
			for (b = 0; b < this.Triangles.length; ++b) {
				d.push(new CL3D.Triangle3d(c.getTranslatedVect(this.Triangles[b].pointA), c.getTranslatedVect(this.Triangles[b].pointB), c.getTranslatedVect(this.Triangles[b].pointC)))
			}
		} else {
			for (b = 0; b < this.Triangles.length; ++b) {
				d.push(new CL3D.Triangle3d(c.getTransformedVect(this.Triangles[b].pointA), c.getTransformedVect(this.Triangles[b].pointB), c.getTransformedVect(this.Triangles[b].pointC)))
			}
		}
	}
};*/
CL3D.MeshTriangleSelector.prototype.getTrianglesInBox = function (c, a, b) {
	this.getAllTriangles(a, b)
};
CL3D.MeshTriangleSelector.prototype.getRelatedSceneNode = function () {
	return this.Node
};
CL3D.MetaTriangleSelector = function () {
	this.Selectors = new Array();
	this.NodeToIgnore = null
};
CL3D.MetaTriangleSelector.prototype = new CL3D.TriangleSelector();
CL3D.MetaTriangleSelector.prototype.getAllTriangles = function (b, d) {
	var a = this.NodeToIgnore;
	for (var c = 0; c < this.Selectors.length; ++c) {
		var e = this.Selectors[c];
		if (a != null && a == e.getRelatedSceneNode()) {
			continue
		}
		e.getAllTriangles(b, d)
	}
};
CL3D.MetaTriangleSelector.prototype.getTrianglesInBox = function (e, b, d) {
	var a = this.NodeToIgnore;
	for (var c = 0; c < this.Selectors.length; ++c) {
		var f = this.Selectors[c];
		if (a != null && a == f.getRelatedSceneNode()) {
			continue
		}
		f.getTrianglesInBox(e, b, d)
	}
};
CL3D.MetaTriangleSelector.prototype.addSelector = function (a) {
	this.Selectors.push(a)
};
CL3D.MetaTriangleSelector.prototype.clear = function () {
	this.Selectors = new Array()
};
CL3D.MetaTriangleSelector.prototype.getCollisionPointWithLine = function (a, d, e, j, h) {
	var c = 999999999.9;
	var b = null;
	var k = null;
	if (j) {
		k = new CL3D.Triangle3d()
	}
	for (var g = 0; g < this.Selectors.length; ++g) {
		var l = this.Selectors[g].getCollisionPointWithLine(a, d, e, k, h);
		if (l != null) {
			var f = l.getDistanceFromSQ(a);
			if (f < c) {
				b = l.clone();
				c = f;
				if (j) {
					k.copyTo(j)
				}
			}
		}
	}
	return b
};
CL3D.MetaTriangleSelector.prototype.setNodeToIgnore = function (a) {
	this.NodeToIgnore = a
};
CL3D.SOctTreeNode = function () {
	this.Triangles = new Array();
	this.Box = new CL3D.Box3d();
	this.Child = new Array()
};
CL3D.OctTreeTriangleSelector = function (m, k, g) {
	this.DebugNodeCount = 0;
	this.DebugPolyCount = 0;
	if (g == null) {
		this.MinimalPolysPerNode = 64
	} else {
		this.MinimalPolysPerNode = g
	} if (!m) {
		return
	}
	this.Node = k;
	this.Root = new CL3D.SOctTreeNode();
	this.Triangles = new Array();
	for (var h = 0; h < m.MeshBuffers.length; ++h) {
		var i = m.MeshBuffers[h];
		if (i) {
			var c = i.Indices.length;
			for (var a = 0; a < c; a += 3) {
				var f = i.Vertices[i.Indices[a]];
				var e = i.Vertices[i.Indices[a + 1]];
				var d = i.Vertices[i.Indices[a + 2]];
				var l = new CL3D.Triangle3d(f.Pos, e.Pos, d.Pos);
				this.Root.Triangles.push(l);
				this.Triangles.push(l)
			}
		}
	}
	this.constructTree(this.Root)
};
CL3D.OctTreeTriangleSelector.prototype = new CL3D.TriangleSelector();
CL3D.OctTreeTriangleSelector.prototype.constructTree = function (c) {
	++this.DebugNodeCount;
	c.Box.MinEdge = c.Triangles[0].pointA.clone();
	c.Box.MaxEdge = c.Box.MinEdge.clone();
	var h;
	var b = c.Triangles.length;
	for (var e = 1; e < b; ++e) {
		h = c.Triangles[e];
		c.Box.addInternalPointByVector(h.pointA);
		c.Box.addInternalPointByVector(h.pointB);
		c.Box.addInternalPointByVector(h.pointC)
	}
	if (!c.Box.MinEdge.equals(c.Box.MaxEdge) && b > this.MinimalPolysPerNode) {
		var j = c.Box.getCenter();
		var d = c.Box.getEdges();
		var f = new CL3D.Box3d();
		for (var a = 0; a < 8; ++a) {
			var g = new Array();
			f.MinEdge = j.clone();
			f.MaxEdge = j.clone();
			f.addInternalPointByVector(d[a]);
			c.Child.push(new CL3D.SOctTreeNode());
			for (var e = 0; e < c.Triangles.length; ++e) {
				h = c.Triangles[e];
				if (h.isTotalInsideBox(f)) {
					c.Child[a].Triangles.push(h)
				} else {
					g.push(h)
				}
			}
			c.Triangles = g;
			if (c.Child[a].Triangles.length == 0) {
				c.Child[a] = null
			} else {
				this.constructTree(c.Child[a])
			}
		}
	}
	this.DebugPolyCount += c.Triangles.length
};
CL3D.OctTreeTriangleSelector.prototype.getAllTriangles = function (a, b) {
	CL3D.MeshTriangleSelector.prototype.getAllTriangles.call(this, a, b)
};
CL3D.OctTreeTriangleSelector.prototype.getTrianglesInBox = function (e, b, d) {
	if (!this.Node.AbsoluteTransformation) {
		return
	}
	var c = new CL3D.Matrix4();
	var a = e.clone();
	if (this.Node) {
		c.setTo(this.Node.getAbsoluteTransformation());
		c.makeInverse();
		c.transformBoxEx(a)
	}
	c.makeIdentity();
	if (b) {
		c = b.clone()
	}
	if (this.Node) {
		c = c.multiply(this.Node.getAbsoluteTransformation())
	}
	if (this.Root) {
		this.getTrianglesFromOctTree(this.Root, d, a, c)
	}
};
CL3D.OctTreeTriangleSelector.prototype.getTrianglesFromOctTree = function (g, e, f, a) {
	if (!g.Box.intersectsWithBox(f)) {
		return
	}
	var d = g.Triangles.length;
	var b;
	if (a.isIdentity()) {
		for (b = 0; b < d; ++b) {
			e.push(g.Triangles[b])
		}
	} else {
		if (a.isTranslateOnly()) {
			for (b = 0; b < d; ++b) {
				e.push(new CL3D.Triangle3d(a.getTranslatedVect(g.Triangles[b].pointA), a.getTranslatedVect(g.Triangles[b].pointB), a.getTranslatedVect(g.Triangles[b].pointC)))
			}
		} else {
			for (b = 0; b < d; ++b) {
				e.push(new CL3D.Triangle3d(a.getTransformedVect(g.Triangles[b].pointA), a.getTransformedVect(g.Triangles[b].pointB), a.getTransformedVect(g.Triangles[b].pointC)))
			}
		}
	}
	for (b = 0; b < 8; ++b) {
		var h = g.Child[b];
		if (h != null) {
			this.getTrianglesFromOctTree(h, e, f, a)
		}
	}
};
CL3D.OctTreeTriangleSelector.prototype.getRelatedSceneNode = function () {
	return this.Node
};