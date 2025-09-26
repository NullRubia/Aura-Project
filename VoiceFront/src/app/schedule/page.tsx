"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import BottomNav from "@/components/layout/BottomNav";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SchedulePage() {
  //로그인 여부 확인
  const router = useRouter();
  // 로그인 상태 훅
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  //기존코드
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventNote, setEventNote] = useState("");
  const [eventAllDay, setEventAllDay] = useState(false);
  const [eventColor, setEventColor] = useState<string>("#3b82f6");
  const [eventsByDate, setEventsByDate] = useState<
    Record<
      string,
      {
        id: string;
        title: string;
        startTime?: string;
        endTime?: string;
        location?: string;
        note?: string;
        allDay?: boolean;
        color?: string;
      }[]
    >
  >({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const hexToRgba = (hex: string, alpha: number) => {
    const value = hex.replace('#','');
    const bigint = parseInt(value.length === 3 ? value.split('').map((c)=>c+c).join('') : value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const { days } = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay(); // 0(Sun)-6(Sat)

    const totalCells = 42; // 6주 그리드
    const monthDays = lastDay.getDate();

    const cells: Array<{
      date: Date;
      dayNumber: number;
      isToday: boolean;
      isCurrentMonth: boolean;
    }> = [];

    const today = new Date();

    // 이전 달 정보
    const prevMonthDate = new Date(year, month, 0);
    const prevMonthLastDate = prevMonthDate.getDate();
    const prevMonthYear = prevMonthDate.getFullYear();
    const prevMonthMonth = prevMonthDate.getMonth();

    // 앞쪽: 이전 달 날짜 채우기
    if (startWeekday > 0) {
      for (
        let d = prevMonthLastDate - startWeekday + 1;
        d <= prevMonthLastDate;
        d += 1
      ) {
        const dateObj = new Date(prevMonthYear, prevMonthMonth, d);
        const isToday =
          dateObj.getFullYear() === today.getFullYear() &&
          dateObj.getMonth() === today.getMonth() &&
          dateObj.getDate() === today.getDate();
        cells.push({
          date: dateObj,
          dayNumber: d,
          isToday,
          isCurrentMonth: false,
        });
      }
    }

    // 현재 달 날짜
    for (let d = 1; d <= monthDays; d += 1) {
      const dateObj = new Date(year, month, d);
      const isToday =
        dateObj.getFullYear() === today.getFullYear() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getDate() === today.getDate();
      cells.push({
        date: dateObj,
        dayNumber: d,
        isToday,
        isCurrentMonth: true,
      });
    }

    // 뒤쪽: 다음 달 날짜로 채우기
    let nextDay = 1;
    const nextMonthDate = new Date(year, month + 1, 1);
    const nextMonthYear = nextMonthDate.getFullYear();
    const nextMonthMonth = nextMonthDate.getMonth();
    while (cells.length < totalCells) {
      const dateObj = new Date(nextMonthYear, nextMonthMonth, nextDay);
      const isToday =
        dateObj.getFullYear() === today.getFullYear() &&
        dateObj.getMonth() === today.getMonth() &&
        dateObj.getDate() === today.getDate();
      cells.push({
        date: dateObj,
        dayNumber: nextDay,
        isToday,
        isCurrentMonth: false,
      });
      nextDay += 1;
    }

    return { days: cells };
  }, [year, month]);

  // 6주 x 7일로 주 단위로 분리
  const weeks = useMemo(() => {
    const chunks: typeof days[] = [] as any;
    for (let i = 0; i < days.length; i += 7) {
      chunks.push(days.slice(i, i + 7));
    }
    return chunks;
  }, [days]);

  const gotoPrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const gotoNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const gotoToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // 날짜 선택만 수행 (모달 열지 않음)
  const selectDateOnly = (d: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    setSelectedDate(d);
  };

  const openDatePicker = () => {
    const input = dateInputRef.current;
    if (!input) return;
    // 최신 브라우저의 showPicker 사용, 없으면 click fallback
    // @ts-ignore
    if (typeof input.showPicker === "function") {
      // @ts-ignore
      input.showPicker();
    } else {
      input.click();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const picked = new Date(e.target.value);
    setSelectedDate(picked);
    setCurrentDate(picked);
  };

  const formatKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const openAddEvent = (d: Date, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) {
      setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
    setSelectedDate(d);
    setEventTitle("");
    setEventStartTime("");
    setEventEndTime("");
    setEventLocation("");
    setEventNote("");
    setEventAllDay(false);
    setEventColor("#3b82f6");
    setEditingKey(null);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const saveEvent = () => {
    if (!selectedDate || !eventTitle.trim()) {
      return;
    }
    const key = formatKey(selectedDate);
    setEventsByDate((prev) => {
      const next = { ...prev };
      const entry = {
        id:
          editingKey && editingIndex !== null
            ? next[key]?.[editingIndex!]?.id || `${Date.now()}`
            : `${Date.now()}`,
        title: eventTitle.trim(),
        startTime: eventAllDay ? undefined : eventStartTime || undefined,
        endTime: eventAllDay ? undefined : eventEndTime || undefined,
        location: eventLocation || undefined,
        note: eventNote || undefined,
        allDay: eventAllDay || undefined,
        color: eventColor || undefined,
      };
      if (
        editingKey &&
        editingIndex !== null &&
        key === editingKey &&
        next[key] &&
        next[key][editingIndex]
      ) {
        next[key] = [...next[key]];
        next[key][editingIndex] = entry;
      } else {
        next[key] = [...(next[key] || []), entry];
      }
      return next;
    });
    setIsModalOpen(false);
  };

  const openEditEvent = (key: string, index: number) => {
    const ev = (eventsByDate[key] || [])[index];
    if (!ev) return;
    const parts = key.split("-");
    const d = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );
    setSelectedDate(d);
    setEventTitle(ev.title);
    setEventStartTime(ev.startTime || "");
    setEventEndTime(ev.endTime || "");
    setEventLocation(ev.location || "");
    setEventNote(ev.note || "");
    setEventAllDay(!!ev.allDay);
    setEventColor(ev.color || "#3b82f6");
    setEditingKey(key);
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const deleteEvent = () => {
    if (!selectedDate) return;
    const key = editingKey || formatKey(selectedDate);
    if (editingIndex === null) return;
    setEventsByDate((prev) => {
      const next = { ...prev };
      next[key] = (next[key] || []).filter((_, i) => i !== editingIndex);
      return next;
    });
    setIsModalOpen(false);
  };

  // 로그인 여부 확인 로직(스토리지 토큰 확인)
  useEffect(() => {
    let token =
      localStorage.getItem("auth_refresh_token") ||
      sessionStorage.getItem("auth_refresh_token");

    if (!token) {
      router.replace("/login");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);
  if (isAuthenticated === null) {
    // 로딩 스피너나 빈 화면 보여주기
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            일정
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="w-32 flex items-center gap-2">
              <button
                onClick={gotoPrevMonth}
                aria-label="이전 달"
                className="h-10 w-10 rounded-full border border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/70 backdrop-blur hover:bg-white/90 dark:hover:bg-gray-700 active:scale-[0.98] transition flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={gotoToday}
                aria-label="오늘"
                className="h-10 w-10 rounded-full border border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/70 backdrop-blur hover:bg-white/90 dark:hover:bg-gray-700 active:scale-[0.98] transition flex items-center justify-center">
                {/* rounded star icon */}
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3l2.7 5.5 6.1.9-4.4 4.2 1 6.1L12 16.6 6.6 19.7l1-6.1-4.4-4.2 6.1-.9L12 3z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={gotoNextMonth}
                aria-label="다음 달"
                className="h-10 w-10 rounded-full border border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/70 backdrop-blur hover:bg-white/90 dark:hover:bg-gray-700 active:scale-[0.98] transition flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="font-extrabold tracking-tight text-gray-900 dark:text-gray-100 text-2xl sm:text-3xl">
              {year}. {String(month + 1).padStart(2, "0")}
            </div>
            <div className="w-32 flex items-center justify-end">
              <button
                onClick={openDatePicker}
                aria-label="날짜 선택"
                className="h-10 w-10 rounded-full border border-gray-200/80 dark:border-gray-700/80 bg-white/70 dark:bg-gray-800/70 backdrop-blur hover:bg-white/90 dark:hover:bg-gray-700 active:scale-[0.98] transition flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V5a1 1 0 112 0v2m4 0V5a1 1 0 112 0v2m-9 4h10M7 21h10a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v11a2 2 0 002 2z" />
                </svg>
              </button>
              <input
                ref={dateInputRef}
                type="date"
                className="sr-only"
                onChange={handleDateChange}
              />
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekdayNames.map((name, idx) => (
              <div
                key={name}
                className={`text-center text-[11px] sm:text-xs font-medium py-1 rounded-lg select-none ${
                  idx === 0
                    ? 'text-red-500 dark:text-red-400'
                    : idx === 6
                    ? 'text-blue-500 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {name}
              </div>
            ))}
          </div>

          {/* 달력 그리드: 주 단위 행 + 주간 구분선 */}
          <div className="space-y-2">
            {weeks.map((week, wIdx) => (
              <div
                key={wIdx}
                className={`grid grid-cols-7 gap-2 ${wIdx > 0 ? 'pt-2 border-t border-gray-200 dark:border-gray-700' : ''}`}
              >
                {week.map((cell, idx) => {
                  const dayOfWeek = cell.date.getDay();
                  const isSelected =
                    !!selectedDate &&
                    selectedDate.getFullYear() === cell.date.getFullYear() &&
                    selectedDate.getMonth() === cell.date.getMonth() &&
                    selectedDate.getDate() === cell.date.getDate();

                  const key = formatKey(cell.date);
                  const dayEvents = eventsByDate[key] || [];

                  const baseText = cell.isCurrentMonth
                    ? 'text-gray-700 dark:text-gray-200'
                    : 'text-gray-400 dark:text-gray-600';

                  return (
                    <div
                      key={idx}
                      className={`h-20 sm:h-24 rounded-xl p-1.5 text-xs transition cursor-pointer ${
                        isSelected ? 'ring-2 ring-primary-300' : ''
                      } ${cell.isToday ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'}`}
                      onClick={() => selectDateOnly(cell.date, cell.isCurrentMonth)}
                    >
                      <div className="flex items-start justify-between">
                        {cell.isToday ? (
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-white font-semibold ring-2 ring-primary-500 dark:ring-primary-400 ${
                            dayOfWeek === 0
                              ? 'text-red-500 dark:text-red-400'
                              : dayOfWeek === 6
                              ? 'text-blue-500 dark:text-blue-400'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {cell.dayNumber}
                          </span>
                        ) : (
                          <span
                            className={`${
                              cell.isCurrentMonth
                                ? (dayOfWeek === 0
                                    ? 'text-red-500 dark:text-red-400'
                                    : dayOfWeek === 6
                                    ? 'text-blue-500 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-200')
                                : (dayOfWeek === 0
                                    ? 'text-red-500 opacity-60 dark:text-red-400'
                                    : dayOfWeek === 6
                                    ? 'text-blue-500 opacity-60 dark:text-blue-400'
                                    : 'text-gray-400 dark:text-gray-600')
                            }`}
                          >
                            {cell.dayNumber}
                          </span>
                        )}
                      </div>

                      {dayEvents.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {dayEvents.slice(0, 2).map((ev, i) => (
                            <div
                              key={i}
                              className="truncate text-[11px] px-2 py-0.5 rounded-full border border-transparent text-gray-800 dark:text-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditEvent(key, i);
                              }}
                              title={ev.title}
                              style={{
                                backgroundColor: hexToRgba(ev.color || '#3b82f6', 0.18),
                              }}
                            >
                              <span className="inline-flex items-center gap-1">
                                <span
                                  className="inline-block w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: ev.color || '#3b82f6' }}
                                />
                                <span className="font-medium">{ev.title}</span>
                                {!ev.allDay && (ev.startTime || ev.endTime) && (
                                  <span className="text-[10px] text-gray-600 dark:text-gray-300">
                                    {ev.startTime || ''}
                                    {ev.endTime ? `-${ev.endTime}` : ''}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-gray-500 dark:text-gray-400">
                              +{dayEvents.length - 2}개 더 보기
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 일정 등록 모달 */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={
              selectedDate
                ? `${selectedDate.getFullYear()}-${String(
                    selectedDate.getMonth() + 1
                  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                    2,
                    "0"
                  )}`
                : "일정"
            }
            size="sm">
            <div className="space-y-4">
              <Input
                label="제목"
                value={eventTitle}
                onChange={setEventTitle}
                placeholder="일정 제목"
              />

              {/* 색상 선택 */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">
                  색상
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "#3b82f6",
                    "#22c55e",
                    "#ef4444",
                    "#f59e0b",
                    "#a78bfa",
                    "#ec4899",
                    "#14b8a6",
                    "#64748b",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEventColor(c)}
                      className={`w-6 h-6 rounded-full border ${
                        eventColor === c
                          ? "ring-2 ring-offset-2 ring-gray-400"
                          : ""
                      }`}
                      style={{ backgroundColor: c }}
                      aria-label={`색상 ${c}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={eventAllDay}
                    onChange={(e) => setEventAllDay(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>종일</span>
                </label>
              </div>

              {!eventAllDay && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="시작"
                    type="time"
                    value={eventStartTime}
                    onChange={setEventStartTime}
                    step={300}
                  />
                  <Input
                    label="종료"
                    type="time"
                    value={eventEndTime}
                    onChange={setEventEndTime}
                    min={eventStartTime || undefined}
                    step={300}
                  />
                </div>
              )}

              <Input
                label="장소"
                value={eventLocation}
                onChange={setEventLocation}
                placeholder="장소 (선택)"
              />
              <Input
                label="메모"
                value={eventNote}
                onChange={setEventNote}
                placeholder="메모 (선택)"
              />

              <div className="flex justify-between items-center pt-2">
                {editingIndex !== null ? (
                  <Button variant="danger" onClick={deleteEvent}>
                    삭제
                  </Button>
                ) : (
                  <span />
                )}
                <div className="space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}>
                    취소
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveEvent}
                    disabled={
                      !eventTitle.trim() ||
                      (!eventAllDay &&
                        !!eventStartTime &&
                        !!eventEndTime &&
                        eventEndTime < eventStartTime)
                    }>
                    저장
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      {/* 일정 추가 플로팅 버튼 */}
      <button
        type="button"
        onClick={() => openAddEvent(selectedDate || new Date(), true)}
        aria-label="일정 추가"
        className="fixed right-5 bottom-24 z-50 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 active:scale-95 transition"
      >
        <svg className="w-7 h-7 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <BottomNav />
    </div>
  );
}
