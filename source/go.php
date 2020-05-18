<?php 
    session_start();

/* 
    Pliki sesji 
    $_SESSION['str'] - szukany poprzednio wyraz
    $_SESSION['tab']  - wynik ostatniego wyszukiwania
*/

/* 
    Pliki w POST
    $_POST['str']     - szukany wyraz
    $_POST['start']   - indeks pierwszego wiersza 
*/

    if(!(isset($_POST['str']))) {
	echo "Puste zapytanie";
	return;
    }
    $str = $_POST['str'];

/* Dane do wysłania */
    $mess->tab = [];  				// dane do wyświetlenia
    $mess->start = intval($_POST['start']);		// indeks pierwszego wiersza
    $mess->is_more = 0;   			// czy jest wiecej o wyzszym indeksie
  
    if(isset($_SESSION['str']) && $_SESSION['str'] == $str) {
        $i = intval($_POST['start']);
        while($i < intval($_POST['start']) + 100 && $i < count($_SESSION['tab'])) {
            $mess->tab[] = $_SESSION['tab'][$i];
            $i++;
        }
	$mess->is_more = ($i < count($_SESSION['tab']) - 1) ? 1 : 0;  
	echo json_encode($mess);
    	return;
    }
 
    $_SESSION['str'] = $str;

    $LOGIN = "js406351";
    $PASS = "exks170899";
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
   
    $_SESSION['tab'] = $tab;

    $i = 0;
    while($i < 100 && $i < sizeof($tab)) {
	$mess->tab[] = $tab[$i];
	$i++;
    }
    $mess->is_more = ($i < sizeof($tab) - 1) ? 1 : 0;
    echo json_encode($mess);
?>
