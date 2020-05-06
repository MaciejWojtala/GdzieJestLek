<?php 
    $str = (isset($_POST['str'])) ? $_POST['str'] : "%";
    if($str == "%") {
	echo "%";
	return;
    }

    $LOGIN = "***";
    $PASS = "**";
    $conn = oci_connect($LOGIN,$PASS);

     if (!$conn) {
    	echo "oci_connect failed\n";
       	return;
    }

    $query = "
		select distinct Leki.Nazwa, Leki.Substancja_czynna,
                Leki.Postac, Leki.Dawka,
                Leki.Zawartosc_opakowania, Leki.Kod_EAN,
                Leki.Poziom_odplatnosci,
                Leki.Zakres_objetych_refundacja,
                Leki.Wysokosc_doplaty
		from Leki
		inner join (
		select distinct Nazwa, Substancja_czynna
		from Leki
		where Nazwa like '%".$str."%'
		or Substancja_czynna like '%".$str."%'
		or Postac like '%".$str."%' 
		or Dawka like '%".$str."%'
		or Zawartosc_opakowania like '%".$str."%'
		or Kod_EAN like '%".$str."%'
		or Poziom_odplatnosci like '%".$str."%'
		or Zakres_objetych_refundacja like '%".$str."%'
		or Wysokosc_doplaty like '%".$str."%') h
		on Leki.Nazwa = h.Nazwa
		and Leki.Substancja_czynna = h.Substancja_czynna
	    	order by Leki.Nazwa, Leki.Substancja_czynna,
		Leki.Postac, Leki.Dawka, 
		Leki.Zawartosc_opakowania, Leki.Kod_EAN,
		Leki.Poziom_odplatnosci,
		Leki.Zakres_objetych_refundacja,
		Leki.Wysokosc_doplaty  
	    ";

    $stmt = oci_parse($conn, $query);

    if(!oci_execute($stmt, OCI_NO_AUTO_COMMIT)) {
	echo oci_error($stmt);
	return;
    }

    while(($row = oci_fetch_array($stmt, OCI_NUM))) {
	$tab[] = $row;
    }
    echo json_encode($tab);
?>
