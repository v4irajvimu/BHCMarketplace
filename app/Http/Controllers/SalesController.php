<?php

namespace App\Http\Controllers;

use App\Models\Sales;
use Illuminate\Http\Request;
use App\Classes\CheckSign;

class SalesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $current_owner = $request->current_owner;
        $collection = $request->collection;
        $token_id = $request->token_id;
        if ($request->has(["current_owner", "collection", "token_id"])) {
            if ($sales = Sales::where("collection", $collection)->where('current_owner', $current_owner)->where("token_id", $token_id)->doesntExist()) {
                return response(false);
            }
            return response(true);
        }
        $sales = Sales::all();
        return $sales;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            "collection" => "required",
            "current_owner" => "required",
            "token_id" => "required",
            "price" => "required",
            'is_instant' => "required",
            "currency" => "required",
            "signature" => "required",
            "order_id" => "required",
            "salt" => "required"
        ]);
        $checker = new CheckSign;
        $message = $request->order_id;
        $granted = $checker->checkSign($message, $request->signature, $request->current_owner);
        if ($granted) {
            if (Sales::where("collection", $request->collection)->where("current_owner", $request->current_owner)->where("token_id", $request->token_id)->exists()) {
                $id = Sales::where("collection", $request->collection)->where("current_owner", $request->current_owner)->where("token_id", $request->token_id)->get(id);
                Sales::destroy($id);
            }
            $order = Sales::create([
                "collection" => $request->collection,
                "current_owner" => $request->current_owner,
                "token_id" => $request->token_id,
                "price" => $request->price,
                "is_instant" => $request->is_instant,
                "currency" => $request->currency,
                "signature" => $request->signature,
                "salt" => $request->salt,
            ]);
            return response()->json(["success" => true]);
        } else {
            return response()->json($granted);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Sales  $sales
     * @return \Illuminate\Http\Response
     */
    public function show($address)
    {
        $sales = Sales::where("current_owner", $address)->get();
        return $sales;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Sales  $sales
     * @return \Illuminate\Http\Response
     */
    public function edit(Sales $sales)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Sales  $sales
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Sales $sales)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Sales  $sales
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Sales::destroy($id);
        return true;
    }
}
