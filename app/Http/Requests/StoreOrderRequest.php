<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'send_to_kitchen_at' => 'required|date',
            'concessions' => 'required|array|min:1',
            'concessions.*.id' => 'required|exists:concession,id',
            'concessions.*.quantity' => 'required|integer|min:1',
            'concessions.*.price' => 'required|numeric|min:0'
        ];
    }
}
