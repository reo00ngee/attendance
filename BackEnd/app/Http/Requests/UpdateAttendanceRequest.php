<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'attendance_id' => 'required|integer|exists:attendance,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'comment' => 'nullable|string|max:2000',
            'attendance_breaks' => 'nullable|array',
            'attendance_breaks.*.start_time' => 'required|date',
            'attendance_breaks.*.end_time' => 'nullable|date|after_or_equal:attendance_breaks.*.start_time',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $breaks = $this->attendance_breaks ?? [];
            $breakCount = count($breaks);

            $attendanceStart = new \DateTime($this->start_time);
            $attendanceEnd = new \DateTime($this->end_time);

            for ($i = 0; $i < $breakCount; $i++) {
                $b = $breaks[$i];
                if (!empty($b['start_time'])) {
                    $breakStart = new \DateTime($b['start_time']);
                    if ($breakStart < $attendanceStart) {
                        $validator->errors()->add('attendance_breaks.' . $i . '.start_time', "Break " . ($i + 1) . ": Start time must not be before attendance start time.");
                    }
                    if ($breakStart > $attendanceEnd) {
                        $validator->errors()->add('attendance_breaks.' . $i . '.start_time', "Break " . ($i + 1) . ": Start time must not be after attendance end time.");
                    }
                }
                if (!empty($b['end_time'])) {
                    $breakEnd = new \DateTime($b['end_time']);
                    if ($breakEnd < $attendanceStart) {
                        $validator->errors()->add('attendance_breaks.' . $i . '.end_time', "Break " . ($i + 1) . ": End time must not be before attendance start time.");
                    }
                    if ($breakEnd > $attendanceEnd) {
                        $validator->errors()->add('attendance_breaks.' . $i . '.end_time', "Break " . ($i + 1) . ": End time must not be after attendance end time.");
                    }
                }
            }

            for ($i = 0; $i < $breakCount - 1; $i++) {
                if (
                    (empty($breaks[$i]['start_time']) || empty($breaks[$i]['end_time']))
                    && !empty($breaks[$i + 1]['start_time'])
                ) {
                    $validator->errors()->add('attendance_breaks.' . $i, "Break " . ($i + 1) . ": Start and end time must be set if there is a subsequent break.");
                }
            }
        });
    }
}
