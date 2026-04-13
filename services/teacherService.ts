import { supabase } from './supabase';

export function generateTeacherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const saveTeacherCode = async (uid: string, code: string) => {
  await supabase.from('teachers').upsert({ id: uid, code });
  await supabase.from('teacher_codes').upsert({ code, teacher_id: uid });
  await supabase.from('users').update({ teacherCode: code }).eq('id', uid);
};

export const resolveTeacherCode = async (code: string): Promise<string | null> => {
  const { data } = await supabase
    .from('teacher_codes')
    .select('teacher_id')
    .eq('code', code.toUpperCase())
    .single();
  return data ? data.teacher_id : null;
};

export const linkStudentToTeacher = async (studentUid: string, teacherUid: string) => {
  await supabase.from('users').update({ teacherUid }).eq('id', studentUid);
  await supabase.from('teacher_students').upsert({
    teacher_id: teacherUid,
    student_id: studentUid,
    joined_at: new Date().toISOString()
  });
};

export const getTeacherStudents = async (teacherUid: string) => {
  const { data: relations } = await supabase
    .from('teacher_students')
    .select('student_id')
    .eq('teacher_id', teacherUid);
    
  if (!relations || relations.length === 0) return [];
  
  const studentUids = relations.map(r => r.student_id);
  const { data: students } = await supabase
    .from('users')
    .select('*')
    .in('id', studentUids);
    
  return students || [];
};
